import { useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

import { toast } from "react-toastify";

import { FaStar } from "react-icons/fa";

export default function ReviewForm({ refreshListing }) {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    rating: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/listings/${id}/reviews`,
        {
          review: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Review created successfully!");

      await refreshListing();

      // Reset Form
      setFormData({
        rating: "",
        comment: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit review");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6">Leave a Review</h3>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Rating */}
        {/* Rating */}
        <div>
          <label className="block mb-2 font-medium">Rating</label>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: String(star),
                  }))
                }
                aria-label={`Rate ${star} out of 5 stars`}
                className="text-2xl transition hover:scale-110"
              >
                <FaStar
                  className={
                    star <= Number(formData.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}

            <span className="ml-2 text-sm text-gray-600">
              {formData.rating ? `${formData.rating}/5` : "Select rating"}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block mb-2 font-medium">Comment</label>

          <textarea
            rows="5"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your experience..."
            className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
