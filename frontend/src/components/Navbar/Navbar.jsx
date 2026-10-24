import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NavActions from "./NavActions";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto min-h-20 px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        <Logo title="WanderLust" />
        <SearchBar />
        <NavActions />
      </div>
    </header>
  );
}

export default Navbar;