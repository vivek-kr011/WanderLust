import { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import UserInfoCard from "../components/Profile/UserInfoCard";
import EditProfileModal from "../components/Profile/EditProfileModal";

import api from "../services/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center shadow-sm">
        <p className="text-rose-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Banner */}
      <ProfileHeader 
        user={user} 
        setOpenModal={setOpenModal} 
        setFormData={setFormData} 
      />

      {/* User Information & Details Card */}
      <UserInfoCard user={user} />

      {/* Edit Profile Modal */}
      <EditProfileModal
        formData={formData}
        setFormData={setFormData}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setUser={setUser}
      />
    </main>
  );
}