export default function StatCard({ title, value, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>

      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </div>
  );
}
