/* THIS CARD IS FOR ONLY HOST CAN SEE BOOKINGS OF DIFFERNT USERS */

import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function HostBookingCard({ booking, onConfirm }) {

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);

      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/listings/${booking.listing._id}/bookings/${booking._id}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      toast.success("Booking confirmed successfully");
      
      onConfirm(booking._id);  // inform to thre parent (HostBookings.jsx)


    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to confirm booking."
      );

    } finally {
      setIsConfirming(false);
    }
  }


  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">

      {/* Listing Image */}
      <img
        src={booking.listing.image.url}
        alt={booking.listing.title}
        className="w-full h-56 object-cover"
      />

      {/* Listing Details */}
      <div className="p-5">

        <h2 className="text-xl font-bold text-gray-800">
          {booking.listing.title}
        </h2>

        <p className="text-gray-500 mt-2">
          {booking.listing.location}, {booking.listing.country}
        </p>

        {/* Guest Information */}
        <div className="mt-5 border-t pt-5">

          <h3 className="font-semibold text-gray-800">
            User Information
          </h3>

          <p className="text-gray-500 mt-2">
            Email: {booking.user.email}
          </p>

        </div>

        {/* Booking Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 border-t pt-5">

          {/* Check In */}
          <div>
            <p className="text-sm text-gray-500">
              Check-in
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Check Out */}
          <div>
            <p className="text-sm text-gray-500">
              Check-out
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Guests */}
          <div>
            <p className="text-sm text-gray-500">
              Guests
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {booking.guests}
            </p>
          </div>

          {/* Total Price */}
          <div>
            <p className="text-sm text-gray-500">
              Total Price
            </p>

            <p className="font-bold text-red-500 text-lg mt-1">
              ₹{booking.totalPrice}
            </p>
          </div>

        </div>

        {/* Status */}
        <div className="mt-5 border-t pt-5">

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              booking.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : booking.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {booking.status.toUpperCase()}
          </span>

          {
            booking.status === "pending" && (
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
              >
                {isConfirming ? "Confirming..." : "Confirm Booking"}
              </button>
            )
          }

        </div>

      </div>
    </div>
  );
}