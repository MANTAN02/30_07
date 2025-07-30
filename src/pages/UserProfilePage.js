import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, callBackendFunction } from '../AuthContext';
import { useToast } from '../ToastContext';
import { FaUser, FaEdit, FaCog, FaHeart, FaExchangeAlt, FaStar, FaTrophy, FaShieldAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaChartLine, FaQuestionCircle, FaHeadset, FaBook, FaVideo, FaDownload, FaShare, FaCopy, FaQrcode } from 'react-icons/fa';
import '../styles.css';

const UserProfilePage = () => {
  const { user: authUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalItems: 0,
    totalSwaps: 0,
    totalViews: 0,
    totalLikes: 0,
    rating: 0,
    totalReviews: 0,
    memberSince: null,
    lastActive: null
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpTopic, setHelpTopic] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [authUser]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (authUser) {
        // Fetch user profile
        const profileData = await callBackendFunction('getUserProfile', 'GET');
        setProfile(profileData);

        // Fetch user statistics
        const statsData = await callBackendFunction('getUserStats', 'GET');
        setUserStats(statsData);

        // Fetch recent activity
        const activityData = await callBackendFunction('getUserActivity', 'GET');
        setRecentActivity(activityData);
      }
    } catch (e) {
      setError('Failed to load profile data');
      showToast('Failed to load profile data', 'error');
    }
    setLoading(false);
  };

  const handleEditProfile = () => {
    navigate('/settings');
  };

  const handleShareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${authUser.uid}`;
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.displayName || 'User'}'s Profile`,
          text: `Check out ${profile?.displayName || 'this user'}'s profile on Swapin!`,
          url: profileUrl
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        showToast('Profile link copied to clipboard!', 'success');
      }
    } catch (error) {
      showToast('Failed to share profile', 'error');
    }
  };

  const handleGenerateQR = () => {
    const profileUrl = `${window.location.origin}/profile/${authUser.uid}`;
    // In a real app, you'd generate a QR code here
    showToast('QR Code feature coming soon!', 'info');
  };

  const handleDownloadProfile = () => {
    const profileData = {
      name: profile?.displayName,
      email: profile?.email,
      phone: profile?.phoneNumber,
      location: profile?.address,
      stats: userStats,
      memberSince: userStats.memberSince
    };
    
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile?.displayName || 'user'}-profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Profile data downloaded!', 'success');
  };

  const handleGetHelp = (topic) => {
    setHelpTopic(topic);
    setShowHelpModal(true);
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Swapin Support Request');
    const body = encodeURIComponent(`Hi Swapin Support,\n\nI need help with my account.\n\nUser ID: ${authUser?.uid}\nEmail: ${authUser?.email}\n\nIssue: `);
    window.open(`mailto:support@swapin.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleViewTutorial = () => {
    showToast('Tutorial videos coming soon!', 'info');
  };

  const handleReadFAQ = () => {
    navigate('/faq');
  };

  const getVerificationBadge = () => {
    if (profile?.isVerified) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FaShieldAlt className="mr-1" />
        Verified
      </span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      <FaUser className="mr-1" />
      Unverified
    </span>;
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-violet-600 font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="card text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Profile Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={fetchUserData}
            className="button primary"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            👤 User Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile and track your Swapin activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <img
                    src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || profile?.email}&background=random&size=150`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-violet-200 shadow-lg"
                  />
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-2 right-2 bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                    title="Edit Profile"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>

                {/* Profile Info */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {profile?.displayName || 'User'}
                </h2>
                <p className="text-gray-600 mb-3">{profile?.email}</p>
                {getVerificationBadge()}

                {/* Contact Info */}
                {profile?.phoneNumber && (
                  <div className="flex items-center justify-center mt-4 text-gray-600">
                    <FaPhone className="mr-2" />
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}

                {profile?.address && (
                  <div className="flex items-center justify-center mt-2 text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{profile.address.city}, {profile.address.state}</span>
                  </div>
                )}

                {/* Member Since */}
                {userStats.memberSince && (
                  <div className="flex items-center justify-center mt-2 text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>Member since {new Date(userStats.memberSince).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Trust Score */}
                <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Trust Score</h3>
                  <div className={`text-3xl font-bold ${getTrustScoreColor(profile?.trustScore || 0)}`}>
                    {profile?.trustScore || 0}/100
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile?.trustScore || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleEditProfile}
                    className="w-full button primary flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={handleShareProfile}
                    className="w-full button secondary flex items-center justify-center"
                  >
                    <FaShare className="mr-2" />
                    Share Profile
                  </button>
                  
                  <button
                    onClick={handleGenerateQR}
                    className="w-full button accent flex items-center justify-center"
                  >
                    <FaQrcode className="mr-2" />
                    QR Code
                  </button>
                  
                  <button
                    onClick={handleDownloadProfile}
                    className="w-full button secondary flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" />
                    Download Data
                  </button>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="card mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaQuestionCircle className="mr-2 text-violet-600" />
                Need Help?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleGetHelp('profile')}
                  className="w-full text-left p-3 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors flex items-center"
                >
                  <FaUser className="mr-2 text-violet-600" />
                  Profile Help
                </button>
                
                <button
                  onClick={() => handleGetHelp('swapping')}
                  className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center"
                >
                  <FaExchangeAlt className="mr-2 text-blue-600" />
                  How to Swap
                </button>
                
                <button
                  onClick={() => handleGetHelp('safety')}
                  className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors flex items-center"
                >
                  <FaShieldAlt className="mr-2 text-green-600" />
                  Safety Tips
                </button>
                
                <button
                  onClick={handleContactSupport}
                  className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors flex items-center"
                >
                  <FaHeadset className="mr-2 text-orange-600" />
                  Contact Support
                </button>
                
                <button
                  onClick={handleViewTutorial}
                  className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors flex items-center"
                >
                  <FaVideo className="mr-2 text-purple-600" />
                  Watch Tutorials
                </button>
                
                <button
                  onClick={handleReadFAQ}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <FaBook className="mr-2 text-gray-600" />
                  Read FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-2xl font-bold text-violet-600">{userStats.totalItems}</div>
                <div className="text-sm text-gray-600">Items Listed</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-bold text-blue-600">{userStats.totalSwaps}</div>
                <div className="text-sm text-gray-600">Successful Swaps</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-2">👁️</div>
                <div className="text-2xl font-bold text-green-600">{userStats.totalViews}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-orange-600">{userStats.rating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', name: 'Overview', icon: FaChartLine },
                    { id: 'activity', name: 'Recent Activity', icon: FaCalendarAlt },
                    { id: 'reviews', name: 'Reviews', icon: FaStar },
                    { id: 'achievements', name: 'Achievements', icon: FaTrophy }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                          activeTab === tab.id
                            ? 'border-violet-500 text-violet-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="mr-2" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-64">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Quick Stats</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Likes Received:</span>
                            <span className="font-semibold">{userStats.totalLikes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Reviews:</span>
                            <span className="font-semibold">{userStats.totalReviews}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Active:</span>
                            <span className="font-semibold">
                              {userStats.lastActive ? new Date(userStats.lastActive).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Profile Completion</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profile Photo:</span>
                            <span className={profile?.photoURL ? 'text-green-600' : 'text-red-600'}>
                              {profile?.photoURL ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone Number:</span>
                            <span className={profile?.phoneNumber ? 'text-green-600' : 'text-red-600'}>
                              {profile?.phoneNumber ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Address:</span>
                            <span className={profile?.address ? 'text-green-600' : 'text-red-600'}>
                              {profile?.address ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Verification:</span>
                            <span className={profile?.isVerified ? 'text-green-600' : 'text-red-600'}>
                              {profile?.isVerified ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    {recentActivity.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📝</div>
                        <p className="text-gray-500">No recent activity to show</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                              <span className="text-violet-600 text-sm font-semibold">
                                {activity.type === 'swap' ? '🔄' : activity.type === 'like' ? '❤️' : '👁️'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">User Reviews</h3>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">⭐</div>
                      <p className="text-gray-500">Reviews feature coming soon!</p>
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements & Badges</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-200">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="font-semibold text-gray-800">First Swap</div>
                        <div className="text-sm text-gray-600">Complete your first swap</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                        <div className="text-3xl mb-2">🌟</div>
                        <div className="font-semibold text-gray-800">Top Rated</div>
                        <div className="text-sm text-gray-600">Maintain 4.5+ rating</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-green-200">
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="font-semibold text-gray-800">Swapper Pro</div>
                        <div className="text-sm text-gray-600">Complete 10+ swaps</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {helpTopic === 'profile' && 'Profile Help'}
                {helpTopic === 'swapping' && 'How to Swap'}
                {helpTopic === 'safety' && 'Safety Tips'}
              </h3>
              
              <div className="text-gray-600 mb-6">
                {helpTopic === 'profile' && (
                  <div>
                    <p className="mb-3">• Complete your profile to build trust with other users</p>
                    <p className="mb-3">• Add a profile photo and verify your account</p>
                    <p className="mb-3">• Keep your contact information up to date</p>
                    <p>• Share your profile to connect with more swappers</p>
                  </div>
                )}
                
                {helpTopic === 'swapping' && (
                  <div>
                    <p className="mb-3">• Browse items and find something you like</p>
                    <p className="mb-3">• Click "Exchange" to propose a swap</p>
                    <p className="mb-3">• Select an item from your collection to offer</p>
                    <p>• Wait for the other user to accept or decline</p>
                  </div>
                )}
                
                {helpTopic === 'safety' && (
                  <div>
                    <p className="mb-3">• Always meet in public places</p>
                    <p className="mb-3">• Verify items before completing swaps</p>
                    <p className="mb-3">• Use our secure messaging system</p>
                    <p>• Report any suspicious activity immediately</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="flex-1 button secondary"
                >
                  Got it!
                </button>
                <button
                  onClick={handleContactSupport}
                  className="flex-1 button primary"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage; 