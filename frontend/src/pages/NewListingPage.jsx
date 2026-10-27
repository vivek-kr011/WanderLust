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
    <div className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
            Share your space
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create a new listing
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Add the details guests need to discover and book your place.
          </p>
        </header>

        <form
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-semibold text-gray-700">
                Listing title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                placeholder="e.g. Cozy cabin with mountain views"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                placeholder="Tell guests what makes this place special"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-semibold text-gray-700">
                  Price per night
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-gray-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    placeholder="2,500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="mb-2 block text-sm font-semibold text-gray-700">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">
                Cover image
              </label>
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-8 text-center transition hover:border-rose-400 hover:bg-rose-50/40"
              >
                <span className="text-sm font-medium text-gray-700">
                  {image ? image.name : "Choose an image to upload"}
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  JPG, PNG or WEBP
                </span>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  required
                />
              </label>
            </div>

            {imagePreview && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700">Image preview</p>
                </div>
                <img
                  src={imagePreview}
                  alt="Listing preview"
                  className="max-h-80 w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-rose-500 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
            >
              {loading ? "Creating..." : "Create listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
