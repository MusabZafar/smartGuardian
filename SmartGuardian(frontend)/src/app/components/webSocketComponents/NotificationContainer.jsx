import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, LogIn, LogOut, MapPin, Calendar } from "lucide-react";

const NotificationCard = ({ notification, onDismiss }) => {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Check if it's a security alert
  const isSecurityAlert = notification.type === 'security_alert';
  
  // Use red theme for security alerts, original colors for geofence
  const headerColor = isSecurityAlert ? 'bg-red-600' : 
                     notification.type === 'entry' ? 'bg-blue-500' : 'bg-green-500';
  const iconColor = isSecurityAlert ? 'text-red-600' : 
                   notification.type === 'entry' ? 'text-blue-500' : 'text-green-500';

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-96 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden mb-4 relative group"
    >
      {/* Notification Header */}
      <div className={`${headerColor} text-white p-4 flex items-center space-x-3`}>
        {isSecurityAlert ? (
          <AlertCircle className="w-6 h-6" />
        ) : (
          notification.type === 'entry' ? <LogIn className="w-6 h-6" /> : <LogOut className="w-6 h-6" />
        )}
        <h3 className="font-bold text-lg">
          {isSecurityAlert ? 'Unauthorized User' : 
           `GeoFence ${notification.type === 'entry' ? 'Entry' : 'Exit'} Notification`}
        </h3>
        <button 
          onClick={onDismiss} 
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Notification Content */}
      <div className="p-4 space-y-3">
        {isSecurityAlert ? (
          // Security Alert Content
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">
              Detection Time: {new Date(notification.entryTime).toLocaleString()}
            </p>
          </div>
        ) : (
          // Regular Geofence Content
          <>
            <div className="flex items-center space-x-3">
              <MapPin className={`w-5 h-5 ${iconColor}`} />
              <div>
                <p className="font-semibold text-gray-700">
                  Geofence: <span className={iconColor}>{notification.geoFenceName}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Location: {notification.latitude}, {notification.longitude}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className={`w-5 h-5 ${iconColor}`} />
              <p className="text-sm text-gray-600">
                {notification.type === 'entry' 
                  ? `Entered: ${new Date(notification.entryTime).toLocaleString()}`
                  : `Exited: ${new Date(notification.exitTime).toLocaleString()}`
                }
              </p>
            </div>

            {notification.timeSpentMinutes && notification.type !== 'entry' && (
              <div className="text-sm text-gray-600">
                Time Spent: {notification.timeSpentMinutes} minutes
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`absolute bottom-0 left-0 h-1 ${headerColor} animate-shrink-progress-bar`}></div>
    </motion.div>
  );
};

export default function NotificationContainer({
  notifications,
  removeNotification,
}) {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none max-w-md w-full">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <NotificationCard
            key={index}
            notification={notification}
            onDismiss={() => removeNotification(index)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}