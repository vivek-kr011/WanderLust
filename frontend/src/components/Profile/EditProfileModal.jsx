import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function EditProfileModal({
  formData,
  setFormData,
  openModal,
  setOpenModal,
  setUser,
}) {

  const [isUpdating, setIsUpdating] = useState(false);

  if (!openModal) return null;

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);

      const token = localStorage.getItem("token");

      const res = await api.patch("/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update ProfilePage state
      setUser(res.data.user);
      
      toast.success(res.data.message || "Profile updated successfully!");

      // Close Modal
      setOpenModal(false);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        {/* Username */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">Username</label>

          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Email */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold">Email</label>

          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpenModal(false)}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
