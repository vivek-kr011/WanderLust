import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import api from "../services/api";

import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import AuthButton from "../components/Auth/AuthButton";
// import Divider from "../components/Auth/Divider";
// import SocialLoginButton from "../components/Auth/SocialLoginButton";

import { toast } from "react-toastify";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading]  = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post("/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      login(res.data.user, res.data.token);
      toast.success(res.data.message || "Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join WanderLust & start exploring or hosting today">
      <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuthInput
              label="Full Name"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <AuthInput
              label="Username"
              name="username"
              placeholder="Choose username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <AuthInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <AuthInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-3">
            <AuthButton
              type="submit"
              text={loading ? "Creating Account..." : "Agree and Continue"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-rose-500 hover:text-rose-600 transition"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}