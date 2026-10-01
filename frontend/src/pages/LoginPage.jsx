import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import AuthContext from "../context/AuthContext";

import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import AuthButton from "../components/Auth/AuthButton";
import Divider from "../components/Auth/Divider";
import SocialLoginButton from "../components/Auth/SocialLoginButton";

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

      console.log("LOGIN RESPONSE:", res.data);
      console.log("LOGIN USER:", res.data.user);

      // Save token using AuthContext
      // login(res.data.token);
      login(res.data.user, res.data.token);

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Continue your journey"
    >
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
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

        <div className="mt-6">
          <AuthButton
            type="submit"
            text={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </div>
      </form>

      <Divider />

      <SocialLoginButton />

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-rose-500 hover:text-rose-600"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}