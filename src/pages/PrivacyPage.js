import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaEye, FaDatabase, FaLock, FaUserCheck, FaTrash, FaDownload, FaInfoCircle } from 'react-icons/fa';
import '../styles.css';

const PrivacyPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const privacyData = [
    {
      id: 'overview',
      title: 'Overview',
      icon: FaInfoCircle,
      content: [
        {
          title: 'Our Commitment',
          text: 'At Swapin, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.'
        },
        {
          title: 'Scope',
          text: 'This policy applies to all users of Swapin, including visitors, registered users, and anyone who interacts with our platform, mobile applications, and services.'
        },
        {
          title: 'Updates',
          text: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last Updated" date.'
        }
      ]
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: FaDatabase,
      content: [
        {
          title: 'Personal Information',
          text: 'We collect information you provide directly to us, such as your name, email address, phone number, profile picture, and address when you create an account or complete your profile.'
        },
        {
          title: 'Transaction Data',
          text: 'We collect information about your transactions, including items you list, buy, or exchange, payment information, delivery addresses, and communication with other users.'
        },
        {
          title: 'Usage Information',
          text: 'We automatically collect information about how you use our platform, including your browsing history, search queries, items viewed, and interactions with other users.'
        },
        {
          title: 'Device Information',
          text: 'We collect information about your device, including your IP address, browser type, operating system, and mobile device identifiers.'
        }
      ]
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: FaEye,
      content: [
        {
          title: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our services, including processing transactions, facilitating exchanges, and managing your account.'
        },
        {
          title: 'Communication',
          text: 'We use your contact information to send you important updates, notifications about transactions, security alerts, and customer support messages.'
        },
        {
          title: 'Personalization',
          text: 'We use your data to personalize your experience, including showing relevant items, recommendations, and targeted content based on your preferences and behavior.'
        },
        {
          title: 'Safety & Security',
          text: 'We use your information to detect and prevent fraud, abuse, and other harmful activities, and to ensure the safety and security of our platform.'
        }
      ]
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: FaUserCheck,
      content: [
        {
          title: 'With Other Users',
          text: 'When you list an item or engage in a transaction, we share relevant information with other users, such as your name, profile picture, and item details.'
        },
        {
          title: 'Service Providers',
          text: 'We share information with trusted third-party service providers who help us operate our platform, including payment processors, delivery services, and analytics providers.'
        },
        {
          title: 'Legal Requirements',
          text: 'We may share your information when required by law, such as in response to legal requests, court orders, or to protect our rights and safety.'
        },
        {
          title: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: FaLock,
      content: [
        {
          title: 'Security Measures',
          text: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          title: 'Data Encryption',
          text: 'We use industry-standard encryption to protect sensitive information, including payment data and personal communications.'
        },
        {
          title: 'Access Controls',
          text: 'We limit access to your personal information to employees and contractors who need it to perform their job functions.'
        },
        {
          title: 'Regular Audits',
          text: 'We regularly review and update our security practices to ensure they meet industry standards and protect against emerging threats.'
        }
      ]
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: FaShieldAlt,
      content: [
        {
          title: 'Access & Correction',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us.'
        },
        {
          title: 'Data Portability',
          text: 'You can request a copy of your personal data in a structured, machine-readable format that you can transfer to another service provider.'
        },
        {
          title: 'Deletion',
          text: 'You can request deletion of your personal information, subject to certain legal and contractual obligations that may require us to retain some data.'
        },
        {
          title: 'Opt-Out',
          text: 'You can opt out of certain communications, such as marketing emails, while still receiving important service-related notifications.'
        }
      ]
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: FaTrash,
      content: [
        {
          title: 'Retention Period',
          text: 'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.'
        },
        {
          title: 'Account Deletion',
          text: 'When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or business purposes.'
        },
        {
          title: 'Backup Data',
          text: 'Some information may remain in our backup systems for a limited period, but will not be actively used or accessible.'
        },
        {
          title: 'Legal Requirements',
          text: 'We may retain certain information longer if required by law, such as transaction records for tax purposes or fraud prevention.'
        }
      ]
    }
  ];

  const currentSection = privacyData.find(section => section.id === activeSection);

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
            🔒 Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
                {privacyData.map((section) => {
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

            {/* Data Request Section */}
            <div className="card mt-6 bg-gradient-to-r from-blue-50 to-violet-50 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Exercise Your Privacy Rights</h3>
              <p className="text-gray-600 mb-4">
                You can exercise your privacy rights by contacting us or using the tools below:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition-colors"
                >
                  <FaDownload className="mr-2 text-violet-600" />
                  <span className="font-medium text-gray-800">Download My Data</span>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition-colors"
                >
                  <FaTrash className="mr-2 text-red-600" />
                  <span className="font-medium text-gray-800">Delete My Account</span>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card mt-6 bg-gradient-to-r from-violet-50 to-blue-50 border-2 border-violet-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Questions?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Privacy Officer</h4>
                  <p className="text-violet-600">privacy@swapin.com</p>
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
              onClick={() => navigate('/terms')}
              className="button secondary"
            >
              Terms of Service
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

export default PrivacyPage; 