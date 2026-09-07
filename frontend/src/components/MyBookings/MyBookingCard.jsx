import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { IoMoon } from "react-icons/io5";
import { useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { MdCurrencyRupee } from "react-icons/md";

import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function MyBookingCard({ booking, onCancel }) {
  const { listing, checkIn, checkOut, totalPrice, status } = booking;

  const [isCancelling, setIsCancelling] = useState(false);

  // prevent if listing is not available
  if(!listing) {
    return null;
  }

  const formattedCheckIn = new Date(checkIn).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedCheckOut = new Date(checkOut).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const totalNights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );

  const getStatusIcon = () => {
    if (status === "confirmed")
      return <FaCheckCircle className="text-green-600" />;

    if (status === "cancelled")
      return <FaTimesCircle className="text-red-600" />;

    return <BsClockHistory className="text-yellow-600" />;
  };

  const getStatusColor = () => {
    if (status === "confirmed") return "bg-green-100 text-green-700";

    if (status === "cancelled") return "bg-red-100 text-red-700";

    return "bg-yellow-100 text-yellow-700";
  };

  const handleCancel = async () => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setIsCancelling(true);

      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/listings/${listing._id}/bookings/${booking._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      // Update parent state
      onCancel(booking._id);

      // Success Toast
      toast.success("Booking cancelled successfully!");
      
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 mb-8">
      {/* Image */}

      <div className="md:w-80 h-64">
        <img
          src={listing.image.url}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{listing.title}</h2>

          <div className="flex items-center gap-2 text-gray-500 mt-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span>
              {listing.location}, {listing.country}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-red-500" />

              <div>
                <p className="text-sm text-gray-500">Stay</p>

                <p className="font-medium">
                  {formattedCheckIn} → {formattedCheckOut}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IoMoon className="text-red-500 text-lg" />

              <div>
                <p className="text-sm text-gray-500">Duration</p>

                <p className="font-medium">
                  {totalNights} {totalNights > 1 ? "Nights" : "Night"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MdCurrencyRupee className="text-red-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="font-bold text-lg text-red-500">₹{totalPrice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}

        <div className="flex justify-end mt-8">
          {status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-300 mx-3"
            >
              {isCancelling ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}

          <span
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}
          >
            {getStatusIcon()}
            {status.toUpperCase()}
          </span>

          <Link
            to={`/listings/${listing._id}`}
            className="px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition duration-300"
          >
            View Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
