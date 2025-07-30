import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import ItemForm from "../components/ItemForm";
import { FaArrowLeft, FaPlus, FaCamera, FaTags, FaMapMarkerAlt, FaInfoCircle, FaCheckCircle, FaLightbulb } from "react-icons/fa";
import "../styles.css";

export default function ListItemPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkip = () => {
    navigate('/browse');
  };

  const handleSubmit = async (item) => {
    if (!user) {
      showToast('Please login to list items', 'warning');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // The ItemForm component will handle the actual submission
      showToast('Item listed successfully! 🎉', 'success');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error listing item:', error);
      showToast('Failed to list item. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to list items for sale or swap.</p>
          <button 
            onClick={() => navigate('/login')}
            className="button primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-violet-600 hover:text-violet-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          
          <button
            onClick={handleSkip}
            className="button secondary"
          >
            Browse Items Instead
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            List Your Item
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your items with the Swapin community. Whether you want to sell, swap, or just give away, 
            we make it easy to connect with others who value your items.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center mb-6">
                <FaPlus className="text-violet-600 mr-3 text-xl" />
                <h2 className="text-2xl font-bold text-gray-800">Item Details</h2>
              </div>
              
              <ItemForm onSubmit={handleSubmit} />
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="w-full button secondary"
                >
                  Skip for now - Browse Items
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="card">
              <div className="flex items-center mb-4">
                <FaLightbulb className="text-yellow-500 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Listing Tips</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FaCamera className="text-violet-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Great Photos</h4>
                    <p className="text-sm text-gray-600">Take clear, well-lit photos from multiple angles</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaTags className="text-violet-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Honest Descriptions</h4>
                    <p className="text-sm text-gray-600">Be accurate about condition and any flaws</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-violet-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Fair Pricing</h4>
                    <p className="text-sm text-gray-600">Research similar items for competitive prices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="card">
              <div className="flex items-center mb-4">
                <FaCheckCircle className="text-green-500 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Why List on Swapin?</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Reach thousands of potential buyers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Secure payment and delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Easy item management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Community support</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="card">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-blue-500 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Community Stats</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">10K+</div>
                  <div className="text-xs text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">50K+</div>
                  <div className="text-xs text-gray-600">Items Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24h</div>
                  <div className="text-xs text-gray-600">Avg Response</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/my-listings')}
                  className="w-full text-left p-3 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                >
                  <div className="font-medium">View My Listings</div>
                  <div className="text-sm opacity-75">Manage your current items</div>
                </button>
                
                <button
                  onClick={() => navigate('/browse')}
                  className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium">Browse Items</div>
                  <div className="text-sm opacity-75">Find items to swap or buy</div>
                </button>
                
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left p-3 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  <div className="font-medium">My Profile</div>
                  <div className="text-sm opacity-75">Update your profile</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="card bg-gradient-to-r from-violet-50 to-blue-50 border-2 border-violet-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Start Swapping?</h3>
            <p className="text-gray-600 mb-4">
              Join thousands of users who are already swapping and selling on Swapin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/browse')}
                className="button primary"
              >
                Browse Items
              </button>
              <button
                onClick={() => navigate('/about')}
                className="button secondary"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
