import StatCard from "./StatCard";

export default function DashboardStats({ dashboard }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Total Listings"
        value={dashboard.totalListings}
        description="Properties you are currently hosting"
      />

      <StatCard
        title="Total Bookings"
        value={dashboard.totalBookings}
        description="Total bookings received for your properties"
      />

      <StatCard
        title="Active Bookings"
        value={dashboard.activeBookings}
        description="Bookings that are currently pending or confirmed"
      />

      <StatCard
        title="Cancelled Bookings"
        value={dashboard.cancelledBookings}
        description="Bookings that have been cancelled"
      />

    </div>
  );
}
