import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import "../styles.css";

export default function SignupPage() {
  const { signup, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      showToast('Account created successfully! Welcome to Swapin! 🎉', 'success');
      navigate("/browse");
    } catch (error) {
      console.error('Signup error:', error);
      showToast(error.message || 'Failed to create account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      showToast('Welcome to Swapin! 🎉', 'success');
      navigate("/browse");
    } catch (err) {
      console.error('Google login error:', err);
      showToast('Google signup failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-violet-600 hover:text-violet-700 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🚀</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Join Swapin
            </h1>
            <p className="text-gray-600">
              Start swapping, buying, and selling with our community
            </p>
          </div>

          {/* Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 mb-6"
          >
            <FaGoogle className="text-red-500 mr-3" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or sign up with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <FaShieldAlt className="text-violet-600 mt-0.5 flex-shrink-0" />
              <p>
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-violet-600 hover:text-violet-700 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-violet-600 hover:text-violet-700 font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full button primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="mr-2" />
                  Create Account
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>

          {/* Skip Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/browse')}
              className="w-full button secondary"
            >
              Skip for now - Browse Items
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-800">Smart Swaps</h3>
            <p className="text-sm text-gray-600">AI-powered matching</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-semibold text-gray-800">Secure</h3>
            <p className="text-sm text-gray-600">Verified users only</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">🚚</div>
            <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Track your items</p>
          </div>
        </div>
      </div>
    </div>
  );
} 