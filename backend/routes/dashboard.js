const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");

const { verifyToken } = require("../middleware/authMiddleware");
const { validateBooking } = require("../middleware");

const dashboardController = require("../controllers/dashboard");

router.get(
    "/",
    verifyToken,
    wrapAsync(dashboardController.getDashboard)
);

module.exports = router;