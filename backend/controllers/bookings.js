const Booking = require("../models/booking");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

const { getIO } = require("../socket");

/*========= CREATE BOOKING ==========*/

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;

  // Find listing
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const { booking } = req.body;

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  /* -------------- Calculate number of nights ------------ */
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  const nights = Math.ceil((checkOutDate - checkInDate) / MILLISECONDS_PER_DAY);

  /* Safety Check */
  if (nights <= 0) {
    throw new ExpressError(400, "Check-out must be after check-in.");
  }

  /* ----------- Price Calculation ------------ */
  const totalPrice = listing.price * nights;

  /* ---------------- CREATE BOOKING -------------- */
  const newBooking = new Booking({
    listing: id,
    user: req.user.id,

    checkIn: checkInDate,
    checkOut: checkOutDate,

    guests: booking.guests,

    totalPrice,
  });

  await newBooking.save();

  /* ---------------- IMPLEMENT SOCKET.IO --------------- */
  const populatedBooking = await Booking.findById(newBooking._id)
    .populate("listing")
    .populate("user");

  const io = getIO();

  io.emit("newBooking", populatedBooking);

  res.status(201).json({
    success: true,
    message: "Booking successfully",
    // booking: newBooking,
    booking: populatedBooking,
  });
};

/* ====================== GET MY BOOKINGS ========================= */
module.exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user.id,
  })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
};

/* CANCEL BOOKING */
module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  // booking.user == req.user.id;

  if (booking.user.toString() !== req.user.id) {
    throw new ExpressError(
      403,
      "You are not authorized to cancel this booking.",
    );
  }

  if (booking.status === "cancelled") {
    throw new ExpressError(400, "Booking is already cancelled.");
  }

  booking.status = "cancelled";

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking,
  });
};

/* ================= confirmHostBooking ======================== */

module.exports.confirmHostBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ExpressError(404, "Booking not found.");
  }

  const listing = await Listing.findById(booking.listing);
  if (!listing) {
    throw new ExpressError(404, "Listing not found.");
  }

  if (listing.owner.toString() !== req.user.id) {
    throw new ExpressError(
      403,
      "You are not authorized to confirm this booking.",
    );
  }

  if (booking.listing.toString() !== listing._id.toString()) {
    throw new ExpressError(400, "Invalid booking for this listing.");
  }

  if (booking.status !== "pending") {
    throw new ExpressError(400, "Only pending bookings can be confirmed");
  }

  booking.status = "confirmed";

  await booking.save();

  /*================== ADD SOCKET.IO ==================*/
  const populatedBooking = await Booking.findById(booking._id)
    .populate("listing")
    .populate("user");

  const io = getIO();

  // io.emit("bookingConfirmed", populatedBooking);

  const userId = populatedBooking.user._id.toString();

  io.to(`user:${userId}`).emit("bookingConfirmed", populatedBooking);

  /* ================================================= */

  res.status(200).json({
    success: true,
    message: "Booking confirmed successfully",
    // booking,
    booking: populatedBooking,
  });
};

/* ================= cancelHostBooking =======================*/
module.exports.cancelHostBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ExpressError(404, "Booking is not found.");
  }

  const listing = await Listing.findById(booking.listing);

  if (!listing) {
    throw new ExpressError(404, "Listing is not found.");
  }

  console.log("========== CANCEL DEBUG ==========");
  console.log("Booking ID:", booking._id.toString());
  console.log("Booking user ID:", booking.user.toString());
  console.log("Listing ID:", listing._id.toString());
  console.log("Listing owner ID:", listing.owner.toString());
  console.log("Logged-in user ID:", req.user.id);
  console.log(
    "Owner matches:",
    listing.owner.toString() === req.user.id.toString(),
  );
  console.log("=================================");

  if (listing.owner.toString() !== req.user.id) {
    throw new ExpressError(
      403,
      "You are not authorized to cancel this booking.",
    );
  }

  if (booking.status === "cancelled") {
    throw new ExpressError(400, "Booking is already cancelled.");
  }

  booking.status = "cancelled";

  await booking.save();

  /*============= realtime user notification/update ================ */
  const populatedBooking = await Booking.findById(booking._id)
    .populate("listing")
    .populate("user");

  const userId = populatedBooking.user._id.toString();

  const io = getIO();

  io.to(`user:${userId}`).emit("bookingCancelled", populatedBooking);

  res.status(200).json({
    success: true,
    message: "Booking Cancelled successfully.",
  });
};
