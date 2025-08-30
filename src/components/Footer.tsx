
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const paymentMethods = [
    'M-PESA', 'airtel', 'KCB', 'Ecobank', 'Credit Bank', 'LipaPay', 'VISA', 'MasterCard', 'UnionPay', 'iPay'
  ];

  const securityBadges = [
    'McAfee SECURE', 'TrustedSite', 'SSL Secure Connection'
  ];

  const brands = [
    'VITRON', 'Artel', 'Eurochef', 'VON', 'Nice&Lovely', 'Tecno', 'Honor', 'TC', 'Rashnik',
    'Lyons', 'ECOMAX', 'RASHNIK', 'SmartPro', 'Versman', 'OPPO', 'vivo', 'JAZA KEJA', 'Edenberg',
    'Volsmart', 'SONAR', 'EOGO', 'Rebune', 'Nivea', 'Apple', 'Oraimo', 'Jamespot', 'Mimi Home',
    'IPCONE', 'RAMTONS', 'TCL', 'Garnier', 'USN', 'Infinix', 'Lenovo', 'SUNDABESTS', 'Superfoam'
  ];

  return (
    <footer className="bg-white border-t">
      {/* Payment Methods */}
      <div className="py-6 border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {securityBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 text-center">
            {brands.map((brand, index) => (
              <div key={index} className="text-sm text-gray-600 hover:text-orange-600 cursor-pointer transition-colors">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media & Links */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Connected:</h3>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                <Twitter className="w-6 h-6 text-gray-600 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-gray-600 hover:text-pink-600 cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-700 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* App Download */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download App:</h3>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-sm">📱 Google Play</span>
                </div>
                <div className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-sm">🍎 App Store</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="space-y-2">
                <div className="text-center">
                  <span className="text-sm text-gray-600">MALL | SELLER | MOBILE APP</span>
                </div>
                <div className="text-center">
                  <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    Admin
                  </Link>
                </div>
                <div className="text-center text-xs text-gray-500">
                  Copyright© 2024 Kilimall Kenya Limited
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
