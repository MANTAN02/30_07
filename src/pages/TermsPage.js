import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaGavel, FaUserShield, FaHandshake, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import '../styles.css';

const TermsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('general');

  const termsData = [
    {
      id: 'general',
      title: 'General Terms',
      icon: FaInfoCircle,
      content: [
        {
          title: 'Acceptance of Terms',
          text: 'By accessing and using Swapin, you accept and agree to be bound by the terms and provision of this agreement.'
        },
        {
          title: 'Service Description',
          text: 'Swapin is a platform that facilitates the exchange, sale, and purchase of items between users. We provide a secure environment for transactions and user interactions.'
        },
        {
          title: 'User Eligibility',
          text: 'You must be at least 18 years old to use Swapin. By using our service, you represent that you meet this age requirement.'
        },
        {
          title: 'Account Responsibility',
          text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
        }
      ]
    },
    {
      id: 'transactions',
      title: 'Transactions & Payments',
      icon: FaHandshake,
      content: [
        {
          title: 'Transaction Process',
          text: 'All transactions are facilitated through our platform. Users agree to complete transactions in good faith and provide accurate information about items.'
        },
        {
          title: 'Payment Terms',
          text: 'Payments are processed securely through our payment partners. All prices are listed in Indian Rupees (₹) unless otherwise specified.'
        },
        {
          title: 'Refund Policy',
          text: 'Refunds are processed according to our refund policy. Users may request refunds within 7 days of transaction completion if items do not match descriptions.'
        },
        {
          title: 'Dispute Resolution',
          text: 'In case of disputes, Swapin will mediate between parties. Users agree to cooperate with our dispute resolution process.'
        }
      ]
    },
    {
      id: 'prohibited',
      title: 'Prohibited Items & Activities',
      icon: FaExclamationTriangle,
      content: [
        {
          title: 'Illegal Items',
          text: 'Users may not list, sell, or exchange illegal items, including but not limited to drugs, weapons, counterfeit goods, or stolen property.'
        },
        {
          title: 'Inappropriate Content',
          text: 'Users may not post inappropriate, offensive, or harmful content. This includes hate speech, harassment, or content that violates others\' rights.'
        },
        {
          title: 'Fraudulent Activities',
          text: 'Any form of fraud, including misrepresentation of items, fake listings, or payment fraud, is strictly prohibited and will result in account termination.'
        },
        {
          title: 'Spam & Manipulation',
          text: 'Users may not engage in spam activities, manipulate search results, or artificially inflate item values or ratings.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: FaUserShield,
      content: [
        {
          title: 'Data Collection',
          text: 'We collect and process personal data as described in our Privacy Policy. By using Swapin, you consent to our data collection and processing practices.'
        },
        {
          title: 'Data Security',
          text: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.'
        },
        {
          title: 'Data Sharing',
          text: 'We may share your information with third-party service providers, law enforcement when required, or with your explicit consent.'
        },
        {
          title: 'Data Retention',
          text: 'We retain your data for as long as necessary to provide our services and comply with legal obligations.'
        }
      ]
    },
    {
      id: 'liability',
      title: 'Liability & Disclaimers',
      icon: FaGavel,
      content: [
        {
          title: 'Service Availability',
          text: 'We strive to maintain service availability but do not guarantee uninterrupted access. We are not liable for service interruptions or technical issues.'
        },
        {
          title: 'User Transactions',
          text: 'Swapin acts as a facilitator for transactions. We are not responsible for the quality, safety, or legality of items exchanged between users.'
        },
        {
          title: 'Limitation of Liability',
          text: 'Our liability is limited to the amount paid for our services. We are not liable for indirect, incidental, or consequential damages.'
        },
        {
          title: 'Indemnification',
          text: 'Users agree to indemnify and hold Swapin harmless from any claims arising from their use of the platform or violation of these terms.'
        }
      ]
    },
    {
      id: 'termination',
      title: 'Account Termination',
      icon: FaShieldAlt,
      content: [
        {
          title: 'Termination by User',
          text: 'Users may terminate their account at any time by contacting our support team. Upon termination, your data will be handled according to our data retention policy.'
        },
        {
          title: 'Termination by Swapin',
          text: 'We may terminate or suspend accounts for violations of these terms, fraudulent activities, or other reasons at our sole discretion.'
        },
        {
          title: 'Effect of Termination',
          text: 'Upon termination, you will lose access to your account and any remaining balance. Pending transactions will be handled according to our policies.'
        },
        {
          title: 'Appeal Process',
          text: 'Users may appeal account terminations by contacting our support team with relevant information and documentation.'
        }
      ]
    }
  ];

  const currentSection = termsData.find(section => section.id === activeSection);

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
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            📋 Terms of Service
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Please read these terms carefully before using Swapin. By using our platform, 
            you agree to be bound by these terms and conditions.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
              <nav className="space-y-2">
                {termsData.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-violet-100 text-violet-700 border-l-4 border-violet-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 text-lg" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card">
              {currentSection && (
                <>
                  <div className="flex items-center mb-6">
                    <currentSection.icon className="text-violet-600 mr-3 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">{currentSection.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {currentSection.content.map((item, index) => (
                      <div key={index} className="border-l-4 border-violet-200 pl-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Contact Information */}
            <div className="card mt-6 bg-gradient-to-r from-violet-50 to-blue-50 border-2 border-violet-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions About These Terms?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Email Support</h4>
                  <p className="text-violet-600">legal@swapin.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">General Support</h4>
                  <p className="text-violet-600">support@swapin.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/privacy')}
              className="button secondary"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="button secondary"
            >
              FAQ
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="button primary"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 