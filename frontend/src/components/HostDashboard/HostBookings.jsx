import HostBookingCard from "../Bookings/HostBookingCard";

export default function HostBookings({ bookings, onConfirm }) {
  return (
    <section className="mt-12">

      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Host Bookings
        </h2>

        <p className="text-gray-500 mt-1">
          View bookings made on your listings.
        </p>
      </div>

      {/* Bookings */}
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {bookings.map((booking) => (

            <HostBookingCard
              key={booking._id}
              booking={booking}
              onConfirm={onConfirm}
            />

          ))}

        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">

          <h3 className="text-lg font-semibold text-gray-800">
            No bookings yet
          </h3>

          <p className="text-gray-500 mt-2">
            No one has booked your listings yet.
          </p>

        </div>
      )}

    </section>
  );
}