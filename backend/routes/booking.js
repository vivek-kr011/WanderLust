const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");

const { verifyToken } = require("../middleware/authMiddleware");
const { validateBooking } = require("../middleware");

const bookingsController = require("../controllers/bookings");


// temporary test route
router.patch("/test", (req, res) => {
  console.log("PATCH ROUTE HIT");
  res.send("PATCH WORKING")
})

/* GET MY BOOKINGS */
router.get(
  "/my",
  verifyToken,
  wrapAsync(bookingsController.getMyBookings)
);

/* CREATE BOOKING */
router.post(
  "/",
  (req, res, next) => {
    console.log("POST BOOKING ROUTE HIT");
    next();
  },
  verifyToken,
  validateBooking,
  wrapAsync(bookingsController.createBooking)
);

/* CANCEL BOOKING */
router.patch(
  "/:bookingId/cancel",
  (req, res, next) => {
    console.log("PATCH, BOOKING CANCEL ROUTE HIT");
    next();
  },
  verifyToken,
  wrapAsync(bookingsController.cancelBooking),
);

/* Host confirm route */ 
router.patch(
  "/:bookingId/confirm",
  (req, res, next) => {
    console.log("CONFIRM ROUTE HIT");
    console.log("Params:", req.params);
    next();
  },
  verifyToken,
  wrapAsync(bookingsController.confirmHostBooking)
);


/* Host Cancel Booking */
router.patch(
  "/:bookingId/host-cancel",
  verifyToken,
  wrapAsync(bookingsController.cancelHostBooking)
)

module.exports = router;