import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import { toast } from "react-toastify";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);

        const data = res.data.listing;

        setListing(data);

        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          country: data.country,
        });
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0] || null;

    setImage(selectedImage);
    setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const form = new FormData();

      form.append("listing[title]", formData.title);
      form.append("listing[description]", formData.description);
      form.append("listing[price]", formData.price);
      form.append("listing[location]", formData.location);
      form.append("listing[country]", formData.country);

      if (image) {
        form.append("listing[image]", image);
      }

      const token = localStorage.getItem("token");

      const res = await api.put(`/listings/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Listing updated successfully!");

      navigate(`/listings/${id}`);
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Unable to update listing");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !listing) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  if (!listing) {
    return (
      <div className="text-center py-20 text-2xl font-semibold">
        Listing Not Found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}

        <div>
          <label className="block mb-2 font-medium">Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Description */}

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Price */}

        <div>
          <label className="block mb-2 font-medium">Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Location */}

        <div>
          <label className="block mb-2 font-medium">Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Country */}

        <div>
          <label className="block mb-2 font-medium">Country</label>

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Current Image / Preview */}
        <div>
          <label className="block mb-2 font-medium">
            {imagePreview ? "New Image Preview" : "Current Image"}
          </label>

          <img
            src={imagePreview || listing.image.url}
            alt={listing.title}
            className="w-80 max-h-80 object-cover rounded-lg mb-4"
          />
        </div>

        {/* Upload New Image */}
        <div>
          <label className="block mb-2 font-medium">Upload New Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
}
