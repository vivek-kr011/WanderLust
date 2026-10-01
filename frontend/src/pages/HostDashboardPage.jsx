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
        // console.log(res.data);

        setDashboard(res.data.dashboard);
      } catch (error) {
        console.log(error);

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
      console.log("New booking received:", newBooking);

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

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("newBooking", handleNewBooking);

    return () => {
      socket.off("connect");
      socket.off("newBooking", handleNewBooking);
    };
    
  }, []);

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
                : booking
            ),
          }));
        }}
      />
    </div>
  );
}
