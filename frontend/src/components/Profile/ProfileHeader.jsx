import { FaUserCircle } from "react-icons/fa";

export default function ProfileHeader({ user, setOpenModal, setFormData }) {
  const { username, email } = user;

  const handleEdit = () => {
  setFormData({
    username: user.username,
    email: user.email,
  });

  setOpenModal(true);
};


  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <FaUserCircle className="shrink-0 text-6xl sm:text-8xl text-gray-500" />

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">{username}</h1>

            <p className="text-gray-500 mt-1 break-all">{email}</p>
          </div>
        </div>

        {/* Right Section */}
        <button
          onClick={handleEdit}
          className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition duration-300"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
