import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../services/api";
import ListingCard from "../components/Listings/ListingCard";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);

      try {
        const res = await api.get("/listings", {
          params: {
            q: query,
          },
        });

        setListings(res.data.listings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Searching listings...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Info */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Search Results
          {query && (
            <span className="text-rose-600"> for &quot;{query}&quot;</span>
          )}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Found {listings.length}{" "}
          {listings.length === 1 ? "property" : "properties"} matching your
          search.
        </p>
      </div>

      {/* Listings Grid or Empty State */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-xl mx-auto my-10 p-8">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Listings Found</h3>
          <p className="text-sm text-gray-500 mt-1">
            We couldn't find any properties matching your search. Try searching
            for a different destination or keyword.
          </p>
        </div>
      )}
    </main>
  );
}
