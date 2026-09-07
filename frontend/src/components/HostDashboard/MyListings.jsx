import ListingCard from "../Listings/ListingCard";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

export default function MyListings({ listings, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(`/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);

      onDelete(listingId);
      navigate("/");

    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Unable to delete listing");
    }
  };

  return (
    <section className="mt-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>

        <p className="text-gray-500 mt-1">
          Manage and view the properties you are currently hosting.
        </p>
      </div>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id}>
              <ListingCard listing={listing} />

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => navigate(`/listings/${listing._id}/edit`)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition"
                >
                  Edit Listing
                </button>

                <button
                  onClick={() => handleDelete(listing._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
                >
                  Delete Listing
                </button>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No listings yet
          </h3>

          <p className="text-gray-500 mt-2">
            You haven't created any property listings yet.
          </p>
        </div>
      )}
    </section>
  );
}
