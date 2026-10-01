import { useContext, useEffect, useState } from "react";
import api from "../services/api";

import socket from "../services/socket";

import MyBookingCard from "../components/MyBookings/MyBookingCard";

import { FaRegCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/listings/6a5b3ef9068a9f00d2823552/bookings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      setBookings(res.data.bookings);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyBookings();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      console.log("User ID not available");
      return;
    }

    const userId = user.id;

    const joinUserRoom = () => {
      console.log("Joining user room:", userId);

      socket.emit("joinUserRoom", userId);
    };

    const handleBookingConfirmed = (confirmedBooking) => {

      console.log("EVENT RECEIVED");
      console.log("Confirmed booking ID:", confirmedBooking._id);
      console.log("Confirmed booking status:", confirmedBooking.status);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === confirmedBooking._id
            ? {
                ...booking,
                status: confirmedBooking.status,
              }
            : booking,
        ),
      );
    };

    const handleBookingCancelled = (cancelledBooking) => {

      console.log("CANCEL EVENT RECEIVED");
      console.log("Cancelled booking ID:", cancelledBooking._id);
      console.log("Cancelled booking status:", cancelledBooking.status);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === cancelledBooking._id
            ? {
                ...booking,
                status: cancelledBooking.status,

              }
            : booking,
        ),
      )
    }

    // Socket already connected hai
    if (socket.connected) {
      joinUserRoom();
    }

    // Socket baad mein connect ho
    socket.on("connect", joinUserRoom);

    // Booking confirmation event
    socket.on("bookingConfirmed", handleBookingConfirmed);

    socket.on("bookingCancelled", handleBookingCancelled);

    console.log("Listening for bookingConfirmed and bookingCancelled");

    return () => {
      socket.off("connect", joinUserRoom);
      socket.off("bookingConfirmed", handleBookingConfirmed);
      socket.off("bookingCancelled", handleBookingCancelled);
    };
  }, [user]);

  /* ====== CONEECTION TEST =============== */
  useEffect(() => {
    const handleConnect = () => {
      console.log("MyBookings Socket Connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("MyBookings Socket Disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  /*======================================== */

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const handleCancelBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: "cancelled" }
          : booking,
      ),
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <FaRegCalendarAlt className="mx-auto text-7xl text-gray-400 mb-6" />

        <h1 className="text-3xl font-bold text-gray-800">No Bookings Yet</h1>

        <p className="text-gray-500 mt-4">
          Looks like you haven't booked any stays yet.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Explore Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10">My Bookings</h1>

      {bookings.map((booking) => (
        <MyBookingCard
          key={booking._id}
          booking={booking}
          onCancel={handleCancelBooking}
        />
      ))}
    </div>
  );
}
