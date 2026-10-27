import { Link } from "react-router-dom";
import { FaCompass, FaInstagram, FaGithub, FaFacebook } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-3 text-2xl font-bold text-white"
            >
              <FaCompass className="text-sky-400" />
              WanderLust
            </Link>

            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Discover unique stays, explore beautiful destinations, and make
              every journey memorable.
            </p>

            <p className="mt-4 text-sm font-medium text-sky-400">
              Find your next escape.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="transition hover:text-sky-400">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Your Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/login" className="transition hover:text-sky-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="transition hover:text-sky-400">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/listings/new"
                  className="transition hover:text-sky-400"
                >
                  Add a Listing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:support@wanderlust.example"
                  className="transition hover:text-sky-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-400">
                  Help & FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} WanderLust. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/vivek-kr011/WanderLust"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition hover:text-sky-400"
            >
              <FaGithub size={19} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="transition hover:text-sky-400"
            >
              <FaInstagram size={19} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="transition hover:text-sky-400"
            >
              <FaFacebook size={19} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
