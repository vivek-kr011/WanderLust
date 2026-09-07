import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Route Guards
import ProtectedRoute from "../components/ProtectedRoute";

import HomePage from "../pages/HomePage";
import SearchResultPage from "../pages/SearchResultPage";
import ListingDetailsPage from "../pages/ListingDetailsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import BecomeHostPage from "../pages/BecomeHostPage";
import NewListingPage from "../pages/NewListingPage";
import EditListingPage from "../pages/EditListingPage";
import MyBookingsPage from "../pages/MyBookingPage";
import ProfilePage from "../pages/ProfilePage";
import MyListingsPage from "../pages/MyListingsPage";
import HostDashboardPage from "../pages/HostDashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ================= Public Routes ================= */}

        <Route path="/" element={<HomePage />} />

        <Route path="/search" element={<SearchResultPage />} />

        <Route path="/listings/:id" element={<ListingDetailsPage />} />

        {/* ================= Auth Routes ================= */}

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        {/* ================= Protected Routes ================= */}

        <Route
          path="/become-host"
          element={
            <ProtectedRoute>
              <BecomeHostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings/new"
          element={
            <ProtectedRoute>
              <NewListingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListingPage />
            </ProtectedRoute>
          }
        />

        <Route path="/my-bookings" element={<MyBookingsPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListingsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/host-dashboard" element={<HostDashboardPage />} />
        
      </Route>
      
    </Routes>
  );
}
