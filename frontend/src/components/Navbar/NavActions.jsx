import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";

import { FaGlobe } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { FaRegUserCircle } from "react-icons/fa";

export default function NavActions() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return undefined;

    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openMenu]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-5">
      {isAuthenticated ? (
        <>
          <Link
            to="/listings/new"
            className="hidden lg:block font-medium hover:text-rose-500 transition"
          >
            Become a Host
          </Link>

          <Link
            to="/host-dashboard"
            className="hidden lg:block font-medium hover:text-rose-500 transition"
          >
            Host Dashboard
          </Link>

          <button
            type="button"
            aria-label="Go to homepage"
            onClick={() => navigate("/")}
            className="text-xl transition hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
          >
            <FaGlobe aria-hidden="true" />
          </button>

          {/* Profile Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-expanded={openMenu}
              aria-haspopup="menu"
              aria-label="Open account menu"
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 transition hover:border-gray-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 sm:px-4"
            >
              <HiBars3 className="text-xl" />

              <FaRegUserCircle aria-hidden="true" className="text-2xl" />

              <span className="hidden sm:inline font-medium">
                {user?.username}
              </span>
            </button>

            {openMenu && (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-rose-500 focus:bg-gray-50 focus:outline-none focus:text-rose-500"
                >
                  Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/my-listings");
                    setOpenMenu(false);
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-rose-500 focus:bg-gray-50 focus:outline-none focus:text-rose-500"
                >
                  My Listings
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/host-dashboard");
                    setOpenMenu(false);
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-rose-500 focus:bg-gray-50 focus:outline-none focus:text-rose-500"
                >
                  Host Dashboard
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/my-bookings");
                    setOpenMenu(false);
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-rose-500 focus:bg-gray-50 focus:outline-none focus:text-rose-500"
                >
                  My Bookings
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/listings/new");
                    setOpenMenu(false);
                  }}
                  className="w-full px-5 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-rose-500 focus:bg-gray-50 focus:outline-none focus:text-rose-500"
                >
                  Become a Host
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full px-5 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 focus:bg-red-50 focus:outline-none"
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