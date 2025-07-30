import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaHome, FaSearch, FaArrowLeft, FaExclamationTriangle, FaQuestionCircle, FaHeadset, FaMapMarkerAlt, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import '../styles.css';

const Error404Page = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSearch = () => {
    navigate('/browse');
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('404 Error - Swapin Support');
    const body = encodeURIComponent(`Hi Swapin Support,\n\nI encountered a 404 error on your website.\n\nCurrent URL: ${window.location.href}\nUser ID: ${user?.uid || 'Not logged in'}\nEmail: ${user?.email || 'Not logged in'}\n\nIssue: `);
    window.open(`mailto:support@swapin.com?subject=${subject}&body=${body}`, '_blank');
  };

  const popularPages = [
    { name: 'Browse Items', path: '/browse', icon: FaSearch, description: 'Find items to swap' },
    { name: 'My Listings', path: '/my-listings', icon: FaUser, description: 'Manage your items' },
    { name: 'Cart', path: '/cart', icon: FaShoppingCart, description: 'View your cart' },
    { name: 'Wishlist', path: '/wishlist', icon: FaHeart, description: 'Your saved items' },
    { name: 'Profile', path: '/profile', icon: FaUser, description: 'Your profile' },
    { name: 'Settings', path: '/settings', icon: FaUser, description: 'Account settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🔍</div>
          <FaExclamationTriangle className="text-6xl text-orange-500 mx-auto mb-4" />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, we're here to help you find what you need!
        </p>

        {/* Current URL Display */}
        <div className="bg-gray-100 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <p className="text-sm text-gray-600 mb-2">You were looking for:</p>
          <p className="text-gray-800 font-mono text-sm break-all">
            {window.location.href}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={handleGoBack}
            className="button secondary flex items-center px-6 py-3"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="button primary flex items-center px-6 py-3"
          >
            <FaHome className="mr-2" />
            Go Home
          </button>
          
          <button
            onClick={handleSearch}
            className="button accent flex items-center px-6 py-3"
          >
            <FaSearch className="mr-2" />
            Browse Items
          </button>
          
          <button
            onClick={handleContactSupport}
            className="button secondary flex items-center px-6 py-3"
          >
            <FaHeadset className="mr-2" />
            Contact Support
          </button>
        </div>

        {/* Popular Pages */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Popular Pages You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularPages.map((page, index) => {
              const Icon = page.icon;
              return (
                <Link
                  key={index}
                  to={page.path}
                  className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
                >
                  <div className="flex items-center mb-3">
                    <Icon className="text-2xl text-violet-600 mr-3" />
                    <h4 className="font-semibold text-gray-800">{page.name}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
            <FaQuestionCircle className="mr-2 text-violet-600" />
            Need Help?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
              <p className="text-gray-600 text-sm mb-3">
                Get help from our support team
              </p>
              <button
                onClick={handleContactSupport}
                className="button primary text-sm"
              >
                Contact Us
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">📖</div>
              <h4 className="font-semibold text-gray-800 mb-2">FAQ</h4>
              <p className="text-gray-600 text-sm mb-3">
                Find answers to common questions
              </p>
              <Link to="/faq" className="button secondary text-sm">
                Read FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Search Suggestions */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What were you looking for?
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Electronics', 'Books', 'Clothing', 'Sports', 'Home & Garden',
              'Toys', 'Collectibles', 'Tools', 'Furniture', 'Jewelry'
            ].map((category, index) => (
              <button
                key={index}
                onClick={() => navigate(`/browse?category=${category.toLowerCase()}`)}
                className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200 transition-colors text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link to="/about" className="text-violet-600 hover:text-violet-700 text-sm">
              About Us
            </Link>
            <Link to="/privacy" className="text-violet-600 hover:text-violet-700 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-violet-600 hover:text-violet-700 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Page; 