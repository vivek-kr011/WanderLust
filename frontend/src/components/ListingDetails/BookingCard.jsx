import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

import api from "../../services/api";

import { toast } from "react-toastify";

export default function BookingCard({ listing }) {
  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guests, setGuests] = useState(1);

  const { user } = useContext(AuthContext);

  /*================ CALCULATE NUMBER OF NIGHTS======================= */
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  let nights = 0;

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    nights = Math.ceil((checkOutDate - checkInDate) / MILLISECONDS_PER_DAY);

    if (nights < 0) nights = 0;
  }

  /* Price Calculation */
  const totalPrice = listing.price * nights;

  const handleReserve = async () => {
    if (!user) {
      toast.error("Please login to make a booking");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/listings/${listing._id}/bookings`,
        {
          booking: {
            checkIn,
            checkOut,
            guests,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Booking created successfully!");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Unable to create booking.");
    }
    console.log("Reserve Button Clicked");
  };

  return (
    <div className="sticky top-24 border border-gray-200 rounded-2xl shadow-xl p-6 bg-white">
      {/* Price */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-baseline gap-1">
        ₹{listing.price}
        <span className="text-base font-normal text-gray-500">/ night</span>
      </h2>

      {/* Unified Input Box (Professional Look) */}
      <div className="border border-gray-400 rounded-xl mb-4 overflow-hidden">
        {/* Dates Row */}
        <div className="flex border-b border-gray-400 w-full">
          {/* Check In */}
          <div className="flex-1 p-3 border-r border-gray-400 cursor-pointer hover:bg-gray-50 transition">
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
              Check In
            </p>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 w-full text-sm outline-none bg-transparent"
            />
          </div>

          {/* Check Out */}
          <div className="flex-1 p-3 cursor-pointer hover:bg-gray-50 transition">
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
              Check Out
            </p>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 w-full text-sm outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="p-3 w-full cursor-pointer hover:bg-gray-50 transition">
          <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
            Guests
          </p>
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-8 h-8 rounded-full border border-gray-400 hover:bg-gray-100"
            >
              −
            </button>

            <span className="font-medium">
              {guests} Guest{guests > 1 ? "s" : ""}
            </span>

            <button
              type="button"
              onClick={() => setGuests(Math.min(20, guests + 1))}
              className="w-8 h-8 rounded-full border border-gray-400 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {nights > 0 && (
        <div>
          <div>
            <span>
              {" "}
              ₹{listing.price} * {nights}night = {nights > 1 ? "s" : ""}{" "}
            </span>

            <span>₹{totalPrice}</span>
          </div>

          <hr />
          <div>
            <span>Total: </span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      )}

      {/* Reserve Button */}
      <button
        type="button"
        onClick={handleReserve}
        disabled={!checkIn || !checkOut || nights <= 0}
        className={`w-full py-3.5 rounded-lg text-lg font-semibold transition

          ${
            !checkIn || !checkOut || nights <= 0
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-rose-600 hover:bg-rose-700 text-white"
          }
        `}
      >
        Reserve
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        You won't be charged yet.
      </p>
    </div>
  );
}
