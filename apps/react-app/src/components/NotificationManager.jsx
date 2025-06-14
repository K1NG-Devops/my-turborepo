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
    console.log('🔔 NotificationManager mounted - setting up global API');
    
    // Make notification functions available globally
    window.youngEaglesNotifications = {
      add: addNotification,
      demo: simulateNotifications,
      test: () => {
        console.log('🧪 Testing notification system...');
        addNotification({
          type: 'homework',
          title: 'Test Notification',
          message: 'This is a test notification to verify the system is working!',
          actions: [
            { label: 'Great!', type: 'dismiss', primary: true }
          ]
        });
      },
      status: () => {
        console.log('📊 Notification System Status:');
        console.log('- API Available:', !!window.youngEaglesNotifications);
        console.log('- Active Notifications:', notifications.length);
        console.log('- Add Function:', typeof addNotification);
        console.log('- Demo Function:', typeof simulateNotifications);
        return {
          available: true,
          activeNotifications: notifications.length,
          functions: ['add', 'demo', 'test', 'status']
        };
      }
    };

    console.log('✅ Global notification API ready!');
    console.log('💡 Try: window.youngEaglesNotifications.test()');
    console.log('💡 Try: window.youngEaglesNotifications.demo()');
    console.log('💡 Try: window.youngEaglesNotifications.status()');

    // Listen for custom notification events
    const handleCustomNotification = (event) => {
      console.log('📨 Custom notification event received:', event.detail);
      addNotification(event.detail);
    };

    window.addEventListener('young-eagles-notification', handleCustomNotification);

    return () => {
      console.log('🔕 NotificationManager unmounting - cleaning up global API');
      window.removeEventListener('young-eagles-notification', handleCustomNotification);
      delete window.youngEaglesNotifications;
    };
  }, [addNotification, simulateNotifications, notifications.length]);

  return (
    <div 
      className="fixed top-0 right-0 p-4 space-y-4 pointer-events-none"
      style={{ zIndex: 10000 }}
    >
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 10000 - index
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

