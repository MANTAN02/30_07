import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaQuestionCircle, FaChevronDown, FaChevronUp, FaHeadset, FaEnvelope, FaPhone, FaComments } from 'react-icons/fa';
import '../styles.css';

const FAQPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      category: 'Getting Started',
      icon: '🚀',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner. You can sign up using your email address or Google account. Follow the simple registration process and verify your email to get started.'
        },
        {
          question: 'How do I list an item for swap?',
          answer: 'Click "List Item" in the navigation menu. Fill out the form with your item details including photos, description, and condition. Choose your preferred swap categories and set your item as active.'
        },
        {
          question: 'What types of items can I swap?',
          answer: 'You can swap almost anything! Electronics, books, clothing, sports equipment, home goods, collectibles, and more. Just make sure your items are in good condition and accurately described.'
        },
        {
          question: 'Is Swapin free to use?',
          answer: 'Yes! Swapin is completely free to use. You can list items, browse other users\' items, and complete swaps without any fees. We may introduce premium features in the future, but the core swapping functionality will remain free.'
        }
      ]
    },
    {
      category: 'Swapping Process',
      icon: '🔄',
      items: [
        {
          question: 'How does the swapping process work?',
          answer: '1. Browse items and find something you like\n2. Click "Exchange" on the item\n3. Select an item from your collection to offer\n4. Wait for the other user to accept or decline\n5. If accepted, arrange a safe meeting place\n6. Complete the swap and rate each other'
        },
        {
          question: 'What if someone offers me a swap I don\'t want?',
          answer: 'You can decline any swap offer you\'re not interested in. Simply click "Decline" and optionally provide feedback. The other user will be notified, and you can continue browsing for better matches.'
        },
        {
          question: 'Can I cancel a swap after it\'s been accepted?',
          answer: 'Yes, you can cancel an accepted swap before meeting, but please communicate with the other user first. Frequent cancellations may affect your rating. Once you\'ve met and exchanged items, the swap is considered complete.'
        },
        {
          question: 'How do I rate another user after a swap?',
          answer: 'After completing a swap, you\'ll receive a notification to rate the other user. Rate them from 1-5 stars and leave a comment about your experience. This helps build trust in the community.'
        }
      ]
    },
    {
      category: 'Safety & Security',
      icon: '🛡️',
      items: [
        {
          question: 'How do I stay safe when meeting for swaps?',
          answer: 'Always meet in public places like coffee shops, libraries, or shopping centers. Bring a friend if possible, meet during daylight hours, and trust your instincts. Never meet at your home or in isolated locations.'
        },
        {
          question: 'What should I do if I receive a suspicious message?',
          answer: 'Report any suspicious activity immediately using the "Report" button. Don\'t share personal information like your address or phone number in messages. Our support team will investigate and take appropriate action.'
        },
        {
          question: 'How do I verify an item before swapping?',
          answer: 'Examine the item thoroughly before completing the swap. Check for damage, test electronics, and ensure it matches the description. If something seems wrong, you can decline the swap or ask for more information.'
        },
        {
          question: 'What if I receive a damaged or misrepresented item?',
          answer: 'Contact our support team immediately with photos and details. We\'ll help mediate the situation. In the meantime, don\'t complete the swap if the item doesn\'t match the description.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      icon: '👤',
      items: [
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your Profile page and click "Edit Profile" or visit Settings. You can update your display name, profile photo, contact information, and preferences. Keeping your profile complete helps build trust with other users.'
        },
        {
          question: 'How do I change my password?',
          answer: 'Go to Settings > Security and click "Change Password". Enter your current password and choose a new one. Make sure to use a strong password with a mix of letters, numbers, and symbols.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account in Settings > Account. This will permanently remove all your data including listings, swap history, and messages. This action cannot be undone.'
        },
        {
          question: 'How do I verify my account?',
          answer: 'Account verification helps build trust. You can verify your account by providing additional information like a phone number or government ID. Verified users get a badge on their profile.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      icon: '🔧',
      items: [
        {
          question: 'The app is not loading properly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the problem persists, try using a different browser or device. Contact support if the issue continues.'
        },
        {
          question: 'I can\'t upload photos. What\'s wrong?',
          answer: 'Make sure your photos are in JPG, PNG, or GIF format and under 5MB each. Check your internet connection and try again. If the problem persists, contact support.'
        },
        {
          question: 'I\'m not receiving notifications. How do I fix this?',
          answer: 'Check your notification settings in your profile. Make sure you\'ve allowed notifications in your browser settings. You can also check your email for important updates.'
        },
        {
          question: 'How do I report a bug or technical issue?',
          answer: 'Contact our support team with details about the issue including what you were doing when it occurred, your device/browser information, and any error messages you saw.'
        }
      ]
    },
    {
      category: 'Payment & Delivery',
      icon: '💰',
      items: [
        {
          question: 'Do you offer delivery services?',
          answer: 'Currently, we focus on local in-person swaps for safety and trust. We\'re working on secure delivery options for the future. For now, arrange to meet in public places.'
        },
        {
          question: 'Are there any fees for using Swapin?',
          answer: 'No, Swapin is completely free to use. You can list items, browse, and complete swaps without any fees. We may introduce optional premium features in the future.'
        },
        {
          question: 'What if I want to sell an item instead of swapping?',
          answer: 'Swapin is designed for item exchanges, not sales. However, you can list items and specify what you\'re looking for in return. This maintains the community spirit of swapping.'
        },
        {
          question: 'How do I handle shipping costs for long-distance swaps?',
          answer: 'Currently, we recommend local swaps for safety and convenience. If you arrange a long-distance swap, discuss shipping costs and methods with the other user before proceeding.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Swapin Support Request');
    const body = encodeURIComponent(`Hi Swapin Support,\n\nI need help with the following issue:\n\n`);
    window.open(`mailto:support@swapin.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            ❓ Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about using Swapin
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div key={categoryIndex} className="card">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">{category.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">{category.category}</h2>
              </div>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const key = `${categoryIndex}-${itemIndex}`;
                  const isExpanded = expandedItems.has(key);
                  
                  return (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <FaQuestionCircle className="text-violet-600 mr-3 flex-shrink-0" />
                          <span className="font-semibold text-gray-800">{item.question}</span>
                        </div>
                        {isExpanded ? (
                          <FaChevronUp className="text-gray-400 flex-shrink-0" />
                        ) : (
                          <FaChevronDown className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-4">
                          <div className="pl-8 border-l-2 border-violet-200">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQ.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              Try searching with different keywords or contact our support team.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="button primary"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-16 card">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Get a response within 24 hours
                </p>
                <button
                  onClick={handleContactSupport}
                  className="button primary text-sm"
                >
                  <FaEnvelope className="mr-2" />
                  Send Email
                </button>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Chat with our support team
                </p>
                <button
                  onClick={() => showToast('Live chat coming soon!', 'info')}
                  className="button secondary text-sm"
                >
                  <FaComments className="mr-2" />
                  Start Chat
                </button>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Call us during business hours
                </p>
                <button
                  onClick={() => window.open('tel:+1-800-SWAPIN', '_blank')}
                  className="button accent text-sm"
                >
                  <FaPhone className="mr-2" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/about')}
              className="text-violet-600 hover:text-violet-700 text-sm"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="text-violet-600 hover:text-violet-700 text-sm"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="text-violet-600 hover:text-violet-700 text-sm"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-violet-600 hover:text-violet-700 text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 