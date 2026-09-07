const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.getDashboard = async (req, res, next) => {

    /* Current Logged-in Host */
    const hostId = req.user.id;

    /* Total Listings */
    const totalListings = await Listing.countDocuments({
        owner: hostId,
    });
    console.log("Total Listings : ", totalListings);

    /* Host ki Saari Listings */
    const listings = await Listing.find({
        owner: hostId,
    });

    /* Sirf Listing IDs */
    const listingIds = listings.map((listing) => listing._id);
    
    const bookings = await Booking.find({
        listing: {
            $in: listingIds,
        },
    })
        .populate("listing", "title image location country")
        .populate("user", "name email");

    console.log("Matched Bookings:", bookings);

    /* Total Bookings */
    const totalBookings = await Booking.countDocuments({
        listing: {
            $in: listingIds,
        },
    });

    /* Active Bookings (Pending + Confirmed) */
    const activeBookings = await Booking.countDocuments({
        listing: {
            $in: listingIds,
        },
        status: {
            $in: ["pending", "confirmed"],
        },
    });

    /* Cancelled Bookings */
    const cancelledBookings = await Booking.countDocuments({
        listing: {
            $in: listingIds,
        },
        status: "cancelled",
    });

    /* Dashboard Response */
    return res.status(200).json({
        success: true,
        dashboard: {
            totalListings,
            totalBookings,
            activeBookings,
            cancelledBookings,
            listings,
            bookings,
        },
    });
};