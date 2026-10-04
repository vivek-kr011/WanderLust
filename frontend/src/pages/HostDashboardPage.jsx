import { useEffect, useState } from "react";
import api from "../services/api";

import socket from "../services/socket";

import DashboardStats from "../components/HostDashboard/DashboardStats";
import MyListings from "../components/HostDashboard/MyListings";
import HostBookings from "../components/HostDashboard/HostBookings";

export default function HostDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data.dashboard);

        setDashboard(res.data.dashboard);
      } catch (error) {
        // console.log(error);

        setError(error.response?.data?.message || "Failed to fetch dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // =========== SOCKET.IO ================================

  useEffect(() => {
    function handleNewBooking(newBooking) {
      // console.log("New booking received:", newBooking);

      setDashboard((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          bookings: [newBooking, ...prev.bookings],
        };
      });
    }

    function handleBookingCancelledByUser(cancelledBooking) {
      // console.log("BOOKING CANCELLED BY USER EVENT RECEIVED");
      // console.log("Cancelled Booking ID:", cancelledBooking._id);
      // console.log("Cancelled Booking Status:", cancelledBooking.status);

      setDashboard((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          bookings: prev.bookings.map((booking) =>
            booking._id === cancelledBooking._id
              ? {
                  ...booking,
                  status: cancelledBooking.status,
                }
              : booking,
          ),
        };
      });
    }

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // TEMPORARY DEBUG
    // socket.onAny((event, ...args) => {
    //   console.log("SOCKET EVENT RECEIVED:", event, args);
    // });

    socket.on("newBooking", handleNewBooking);

    // User cancellation to Host
    socket.on("bookingCancelledByUser", handleBookingCancelledByUser);

    return () => {
      socket.off("connect");
      socket.off("newBooking", handleNewBooking);
      socket.off("bookingCancelledByUser", handleBookingCancelledByUser);
    };
  }, []);

  useEffect(() => {
    if (!dashboard) return;

    const hostId = dashboard?.listings?.[0]?.owner;

    if (!hostId) {
      // console.log("Host Id not found.");
      return;
    }

    if (socket.connected) {
      socket.emit("joinHostRoom", hostId);

      // console.log("Host joined room:", `host${hostId}`);
    }
  }, [dashboard]);

  // =============================================

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
      <h1 className="text-3xl font-bold mb-8">Host Dashboard Page</h1>

      <DashboardStats dashboard={dashboard} />
      {/* <MyListings listings={dashboard.listings} />  */}
      <MyListings
        listings={dashboard.listings}
        onDelete={(deletedId) => {
          setDashboard((prev) => ({
            ...prev,
            listings: prev.listings.filter(
              (listing) => listing._id !== deletedId,
            ),
            totalListings: prev.totalListings - 1,
          }));
        }}
      />

      <HostBookings
        bookings={dashboard.bookings}
        onConfirm={(confirmID) => {
          setDashboard((prev) => ({
            ...prev,
            bookings: prev.bookings.map((booking) =>
              booking._id === confirmID
                ? { ...booking, status: "confirmed" }
                : booking,
            ),
          }));
        }}
        onCancel={(cancelID) => {
          setDashboard((prev) => ({
            ...prev,
            bookings: prev.bookings.map((booking) =>
              booking._id === cancelID
                ? {
                    ...booking,
                    status: "cancelled",
                  }
                : booking,
            ),
          }));
        }}
      />
    </div>
  );
}
