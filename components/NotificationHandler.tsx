'use client';
import { useEffect } from 'react';

export default function NotificationHandler() {
    useEffect(() => {
        const requestNotificationPermission = async () => {
            try {
                // Check if the browser supports notifications
                if (!('Notification' in window)) {
                    console.log('This browser does not support notifications');
                    return;
                }

                // Check if we already have permission
                if (Notification.permission === 'granted') {
                    setupHourlyNotifications();
                    return;
                }

                // Request permission
                if (Notification.permission !== 'denied') {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setupHourlyNotifications();
                    }
                }
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        const setupHourlyNotifications = async () => {
            if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    // Register periodic sync with 1-hour interval
                    await registration.periodicSync.register('hourly-notification', {
                        minInterval: 60 * 60 * 1000, // 1 hour in milliseconds
                    });
                } catch (error) {
                    console.error('Error setting up periodic sync:', error);
                    // Fallback to regular interval if periodic sync is not available
                    setInterval(() => {
                        if (Notification.permission === 'granted') {
                            new Notification('Bloom Skincare', {
                                body: "Don't forget to check out our latest skincare products!",
                                icon: '/BloomLogo2.png',
                            });
                        }
                    }, 60 * 60 * 1000); // 1 hour
                }
            }
        };

        requestNotificationPermission();
    }, []);

    return null;
} 