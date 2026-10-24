import Categories from "../components/Categories/Categories";
import Listings from "../components/Listings/Listings";

function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Categories />
      <Listings />
    </main>
  );
}

export default HomePage;