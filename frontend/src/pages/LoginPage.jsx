import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import AuthContext from "../context/AuthContext";

import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import AuthButton from "../components/Auth/AuthButton";
// import Divider from "../components/Auth/Divider";
// import SocialLoginButton from "../components/Auth/SocialLoginButton";

import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/login", formData);

      // Save user & token using AuthContext
      login(res.data.user, res.data.token);

      toast.success(res.data.message || "Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Continue your journey with WanderLust">
      <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <AuthInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="pt-3">
            <AuthButton
              type="submit"
              text={loading ? "Logging in..." : "Continue"}
              disabled={loading}
            />
          </div>
        </form>

        {/* <Divider />

        <div className="mt-4">
          <SocialLoginButton />
        </div> */}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-rose-500 hover:text-rose-600 transition"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}