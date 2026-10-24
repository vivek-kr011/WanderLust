import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";

import { FaGlobe } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { FaRegUserCircle } from "react-icons/fa";

export default function NavActions() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-5">
      {isAuthenticated ? (
        <>
          <Link
            to="/listings/new"
            className="font-medium hover:text-rose-500 transition"
          >
            Become a Host
          </Link>

          <Link
            to="/host-dashboard"
            className="font-medium hover:text-rose-500 transition"
          >
            Host Dashboard
          </Link>

          <button className="text-xl hover:text-rose-500 transition">
            <FaGlobe />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-3 border rounded-full px-4 py-2 hover:shadow-md transition"
            >
              <HiBars3 className="text-xl" />

              <FaRegUserCircle className="text-2xl" />

              <span className="font-medium">
                {user?.username}
              </span>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden z-50">

                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/my-listings");
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100"
                >
                  My Listings
                </button>

                <button
                  onClick={() => {
                    navigate("/host-dashboard");
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100"
                >
                  Host Dashboard
                </button>

                <button
                  onClick={() => {
                    navigate("/my-bookings");
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100"
                >
                  My Bookings
                </button>

                <button
                  onClick={() => {
                    navigate("/listings/new");
                    setOpenMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100"
                >
                  Become a Host
                </button>

                <hr />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="font-medium hover:text-rose-500"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="font-medium hover:text-rose-500"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}