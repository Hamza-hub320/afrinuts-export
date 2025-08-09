import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AccessibilityToolbar from '../AccessibilityToolbar/AccessibilityToolbar';
import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from '../Chatbot/Chatbot';
import { FaUserTie } from 'react-icons/fa';

const Layout: FC = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [hasNewMessages, setHasNewMessages] = useState(false);

    // Preload critical images
    useEffect(() => {
        const images = [
            // Add your critical image paths here
            // '/src/assets/images/hero.webp',
            // '/src/assets/images/farm.webp'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.loading = 'eager';
        });
    }, []);

    return (
        <>
            <AccessibilityToolbar />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer className="mt-auto text-white" />

            {/* Enhanced Chatbot Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={showChatbot ? 'Close chatbot' : 'Open chatbot'}
                title={showChatbot ? 'Close chatbot' : 'Open chatbot'}
                className="
                    fixed
                    bottom-6
                    right-6
                    z-50
                    w-16
                    h-16
                    rounded-full
                    bg-primary
                    flex
                    items-center
                    justify-center
                    text-background
                    hover:shadow-xl
                    hover:shadow-primary/40
                    focus:outline-none
                    focus:ring-4
                    focus:ring-primary/30
                    transition-all
                    duration-300
                    ease-in-out
                    group
                "
                onClick={() => setShowChatbot(!showChatbot)}
            >
                <div className="relative w-7 h-7">
                    {/* Chat icon (visible when closed) */}
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: showChatbot ? 0 : 1,
                            y: showChatbot ? 10 : 0,
                            rotate: showChatbot ? 90 : 0
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <FaUserTie className="w-full h-full" />
                    </motion.div>

                    {/* Close icon (visible when open) */}
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: showChatbot ? 1 : 0,
                            y: showChatbot ? 0 : -10,
                            rotate: showChatbot ? 0 : -90
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Notification dot */}
                {hasNewMessages && !showChatbot && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="
                            absolute
                            top-0
                            right-0
                            w-4
                            h-4
                            bg-red-500
                            rounded-full
                            border-2
                            border-white
                        "
                    />
                )}
            </motion.button>
            {/* Chatbot Container with AnimatePresence */}
            <AnimatePresence>
                {showChatbot && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            type: "tween",
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        className="fixed bottom-24 right-6 w-full max-w-[calc(100vw-3rem)] sm:max-w-[540px] h-[600px] max-h-[calc(100vh-10rem)] overflow-hidden flex flex-col z-[9999]"
                    >
                        <Chatbot
                            onNewMessage={(hasMessages) =>
                                setHasNewMessages(hasMessages && !showChatbot)
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Layout;