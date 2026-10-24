import { useState, useEffect } from "react";
import ListingCard from "../components/Listings/ListingCard";

import api from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await api.get("/listings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setListings(res.data.listings);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "Failed to fetch listings.");

        toast.error(
          error.response?.data?.message || "Failed to fetch listings.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  if(loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-xl font-semibold">Loading Listings...</p>
      </div>
    );
  }

  if(error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  if(listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          No Listings Yet
        </h2>

        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Start hosting by creating your first listing and share your amazing
          place with travelers.
        </p>

        <Link
          to="/listings/new"
          className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition duration-300"
        >
          Create Your First Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-4xl font-bold">My Listings</h1>
      <p>Total Listings: {listings.length}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
