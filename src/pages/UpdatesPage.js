import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, callBackendFunction } from '../AuthContext';
import { useToast } from '../ToastContext';
import { FaArrowLeft, FaHistory, FaExchangeAlt, FaShoppingCart, FaCheckCircle, FaTimes, FaClock, FaMapMarkerAlt, FaUser, FaStar, FaFilter, FaDownload, FaShare } from 'react-icons/fa';
import '../styles.css';

export default function UpdatesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, swaps, orders, deliveries
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      try {
        // Fetch swaps, orders, and deliveries
        const [swaps, orders, deliveries] = await Promise.all([
          callBackendFunction('getUserSwaps', 'GET').catch(() => []),
          callBackendFunction('getPaymentHistory', 'GET').catch(() => []),
          callBackendFunction('getDeliveryHistory', 'GET').catch(() => [])
        ]);

        // Combine and format all history items
        const allHistory = [
          ...swaps.map(swap => ({ ...swap, type: 'swap' })),
          ...orders.map(order => ({ ...order, type: 'order' })),
          ...deliveries.map(delivery => ({ ...delivery, type: 'delivery' }))
        ].sort((a, b) => {
          const dateA = a.createdAt?._seconds ? a.createdAt._seconds * 1000 : new Date(a.createdAt).getTime();
          const dateB = b.createdAt?._seconds ? b.createdAt._seconds * 1000 : new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setHistory(allHistory);
      } catch (e) {
        console.error('Error fetching history:', e);
        setError('Failed to load history');
        showToast('Failed to load history', 'error');
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user, showToast]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'accepted':
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'declined':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status, type) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'accepted':
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
      case 'processing':
        return <FaClock className="text-yellow-600" />;
      case 'cancelled':
      case 'declined':
      case 'failed':
        return <FaTimes className="text-red-600" />;
      default:
        return type === 'swap' ? <FaExchangeAlt className="text-blue-600" /> : 
               type === 'order' ? <FaShoppingCart className="text-orange-600" /> : 
               <FaMapMarkerAlt className="text-purple-600" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date._seconds ? new Date(date._seconds * 1000) : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = !searchTerm || 
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.itemTitle && item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `swapin-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('History exported successfully!', 'success');
  };

  const shareHistory = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Swapin History',
        text: `Check out my Swapin activity! I've completed ${filteredHistory.length} transactions.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to view your transaction history.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-violet-600 font-semibold">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="button primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-violet-600 hover:text-violet-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={exportHistory}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <FaDownload className="mr-2" />
              Export
            </button>
            <button
              onClick={shareHistory}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <FaShare className="mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            📊 Transaction History
          </h1>
          <p className="text-gray-600 text-lg">
            View all your swaps, orders, and deliveries in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-2xl font-bold text-violet-600">
              {history.filter(h => h.type === 'swap').length}
            </div>
            <div className="text-sm text-gray-600">Swaps</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-2xl font-bold text-orange-600">
              {history.filter(h => h.type === 'order').length}
            </div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">🚚</div>
            <div className="text-2xl font-bold text-blue-600">
              {history.filter(h => h.type === 'delivery').length}
            </div>
            <div className="text-sm text-gray-600">Deliveries</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">
              {history.filter(h => ['completed', 'accepted', 'delivered'].includes(h.status?.toLowerCase())).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="swap">Swaps Only</option>
                <option value="order">Orders Only</option>
                <option value="delivery">Deliveries Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {searchTerm ? 'No matching transactions' : 'No Transactions Yet'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters.'
                : 'Start swapping, buying, or selling to see your transaction history here!'
              }
            </p>
            <button 
              onClick={() => navigate('/browse')}
              className="button primary"
            >
              Browse Items
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <div key={`${item.type}-${item.id}-${index}`} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(item.status, item.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.title || item.itemTitle || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} #${item.id?.slice(-8)}`}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description || `Transaction completed on ${formatDate(item.createdAt)}`}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaUser className="mr-1" />
                          {item.type === 'swap' ? 'Exchange' : item.type === 'order' ? 'Purchase' : 'Delivery'}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {formatDate(item.createdAt)}
                        </span>
                        {item.netAmount !== undefined && (
                          <span className={`font-medium ${
                            item.netAmount > 0 ? 'text-red-600' : 
                            item.netAmount < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {item.netAmount === 0 ? 'Even Exchange' : 
                             item.netAmount > 0 ? `Pay ₹${item.netAmount}` : 
                             `Receive ₹${Math.abs(item.netAmount)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/product/${item.itemId || item.id}`)}
                      className="px-3 py-1 text-sm bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination or Load More */}
        {filteredHistory.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Showing {filteredHistory.length} of {history.length} transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
