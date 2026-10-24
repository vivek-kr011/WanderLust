import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { toast } from "react-toastify";

export default function NewListingPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0] || null;

    setImage(selectedImage);
    setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

      const res = await api.post("/listings", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // alert(res.data.message);
      toast.success(res.data.message || "Listing created successfully!");
      navigate("/");
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Enter listing title"
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
            placeholder="Enter description"
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
            placeholder="₹ Price"
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
            placeholder="Enter location"
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
            placeholder="Enter country"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-medium">Upload Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-600">
              Image Preview
            </p>

            <img
              src={imagePreview}
              alt="Listing preview"
              className="w-full max-h-80 object-cover rounded-lg border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
