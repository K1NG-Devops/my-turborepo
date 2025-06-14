import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationToast from './NotificationToast';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Function to add a new notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...notification
    };
    
    setNotifications(prev => {
      // Limit to 3 notifications at once
      const updated = [newNotification, ...prev.slice(0, 2)];
      return updated;
    });
  }, []);

  // Function to remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Handle notification actions
  const handleNotificationAction = useCallback((action) => {
    if (action.type === 'navigate') {
      navigate(action.path);
    } else if (action.type === 'url') {
      window.open(action.url, '_blank');
    } else if (action.type === 'callback' && action.callback) {
      action.callback();
    }
  }, [navigate]);

  // Demo function to simulate notifications (for testing)
  const simulateNotifications = useCallback(() => {
    const demoNotifications = [
      {
        type: 'homework',
        title: 'New Homework Posted',
        message: 'Math homework has been posted for Grade 3. Due date: Tomorrow at 2 PM.',
        actions: [
          { label: 'View', type: 'navigate', path: '/student/homework', primary: true },
          { label: 'Dismiss', type: 'dismiss' }
        ]
      },
      {
        type: 'submission',
        title: 'Homework Submitted',
        message: 'Your child\'s English homework has been successfully submitted.',
        actions: [
          { label: 'View Progress', type: 'navigate', path: '/dashboard', primary: true }
        ]
      },
      {
        type: 'user',
        title: 'Teacher Message',
        message: 'Ms. Sarah left a comment on your child\'s art project.',
        avatar: '/api/placeholder/32/32',
        actions: [
          { label: 'Read Message', type: 'navigate', path: '/notifications', primary: true },
          { label: 'Later', type: 'dismiss' }
        ]
      },
      {
        type: 'urgent',
        title: 'Urgent: School Closure',
        message: 'Due to weather conditions, school will be closed tomorrow.',
        actions: [
          { label: 'Read Full Notice', type: 'navigate', path: '/notifications', primary: true }
        ]
      }
    ];

    // Add notifications with delays
    demoNotifications.forEach((notif, index) => {
      setTimeout(() => {
        addNotification(notif);
      }, index * 1500);
    });
  }, [addNotification]);

  // Expose the notification system globally
  useEffect(() => {
    // Make notification functions available globally
    window.youngEaglesNotifications = {
      add: addNotification,
      demo: simulateNotifications
    };

    // Listen for custom notification events
    const handleCustomNotification = (event) => {
      addNotification(event.detail);
    };

    window.addEventListener('young-eagles-notification', handleCustomNotification);

    return () => {
      window.removeEventListener('young-eagles-notification', handleCustomNotification);
      delete window.youngEaglesNotifications;
    };
  }, [addNotification, simulateNotifications]);

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index
          }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            onAction={handleNotificationAction}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;

