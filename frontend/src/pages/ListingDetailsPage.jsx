import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";
import AuthContext from "../context/AuthContext";

import { toast } from "react-toastify";

import BookingCard from "../components/ListingDetails/BookingCard";
import ReviewSection from "../components/Reviews/ReviewSection";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useContext(AuthContext);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchListing = useCallback(async () => {
    const res = await api.get(`/listings/${id}`);
    console.log("Listing Response: ", res.data);
    return res.data.listing;
  }, [id]);

  const refreshListing = async () => {
    try {
      const data = await fetchListing();
      setListing(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to refresh listing");
    }
  };

  useEffect(() => {
    const loadListing = async () => {
      try {
        const data = await fetchListing();
        setListing(data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to load listing");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [fetchListing]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(`/listings/${listing._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Listing deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to delete listing");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-600">Loading Listing...</div>;
  }

  if (!listing) {
    return (
      <h1 className="text-center mt-20 text-2xl font-semibold text-gray-700">
        Listing Not Found
      </h1>
    );
  }

  const isOwner =
    isAuthenticated && user && listing.owner && user.id === listing.owner._id;

  const hostName = listing.owner?.username || "Host";
  const hostInitial = hostName.charAt(0).toUpperCase();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Listing Title & Location */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {listing.title}
        </h1>
        <p className="mt-1 text-sm text-gray-600 flex items-center">
          <i className="fa-solid fa-location-dot text-rose-500 mr-1.5"></i>
          <span className="underline font-medium">
            {listing.location}, {listing.country}
          </span>
        </p>
      </div>

      {/* Image Gallery Showcase */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg h-[350px] sm:h-[450px] relative bg-gray-100">
        <img
          src={listing.image?.url || listing.image}
          alt={listing.title || "Listing Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layout Grid: Details & Booking Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host Info Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Entire place hosted by {hostName}
              </h2>
              <p className="text-sm text-gray-500">
                {listing.guests || 1} guest · {listing.bedrooms || 1} bedroom · {listing.beds || 1} bed · {listing.baths || 1} bath
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow">
              {hostInitial}
            </div>
          </div>

          {/* Action Buttons (Edit / Delete) - Owner Only */}
          {isOwner && (
            <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/listings/${listing._id}/edit`)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg shadow transition flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span>Edit Listing</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow transition flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
              >
                <i className="fa-solid fa-trash"></i>
                <span>Delete Listing</span>
              </button>
            </div>
          )}

          {/* About This Place */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              About this place
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div>
            <ReviewSection listing={listing} refreshListing={refreshListing} />
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingCard listing={listing} />
          </div>
        </div>
      </div>
    </main>
  );
}