import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

import api from "../../services/api";

import { toast } from "react-toastify";

export default function ReviewCard({ review, listingId, refreshListing }) {
  const { user } = useContext(AuthContext);

  // const isReviewAuthor = user && review.author && user.id === review.author._id;

  /* OPTIONAL CHAINNING (?) */
  const isReviewAuthor = user?.id === review.author?._id;

  const handleDelete = async () => {
    try {
      // DELETE API CALL
      const token = localStorage.getItem("token");

      // API CALL
      const res = await api.delete(
        `/listings/${listingId}/reviews/${review._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Review deleted successfully!");

      await refreshListing();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Unable to delete review");
    }
  };

  return (
    <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white">
      {/* Rating */}
      <div className="text-yellow-500 text-lg mb-2">
        {"⭐".repeat(review.rating)}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            — {review.author?.username}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(review.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {isReviewAuthor && (
          <button
            className="text-red-500 hover:text-red-700 font-medium"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
