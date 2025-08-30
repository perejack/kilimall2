import React from 'react';

const WhatsAppChat = () => {
  const phoneNumber = "254750226297";
  const whatsAppUrl = `https://wa.me/${phoneNumber}`;
  const displayPhoneNumber = "+254 750 226297";
  const iconUrl = "https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg";

  return (
    <a
      href={whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 group"
    >
      <img src={iconUrl} alt="WhatsApp" className="w-8 h-8 mr-2 transition-transform duration-300 group-hover:scale-110" />
      <div className="flex flex-col items-start">
        <span className="font-semibold text-sm">Chat & Order</span>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
          <span className="text-xs font-medium">Online</span>
        </div>
        {/* <span className="text-xs">{displayPhoneNumber}</span> */}
      </div>
    </a>
  );
};

export default WhatsAppChat;
