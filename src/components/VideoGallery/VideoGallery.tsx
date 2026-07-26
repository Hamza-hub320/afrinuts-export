import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes, FaExpand, FaCompress } from 'react-icons/fa';

interface VideoItem {
    src: string;
    poster?: string;
    title: string;
    description?: string;
}

interface VideoGalleryProps {
    videos: VideoItem[];
    className?: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, className = '' }) => {
    const [activeVideo, setActiveVideo] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (activeVideo === null && videoRef.current) {
            videoRef.current.pause();
        }
    }, [activeVideo]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && activeVideo !== null) {
                setActiveVideo(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeVideo]);

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!isFullscreen) {
                videoRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    return (
        <div className={className}>
            {/* Video Thumbnails Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, idx) => (
                    <motion.div
                        key={idx}
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl overflow-hidden shadow-xl transform-gpu cursor-pointer"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                        whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}
                        onClick={() => setActiveVideo(idx)}
                    >
                        {/* 3D effects */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                        {/* Thumbnail / Poster */}
                        <div className="relative h-56 overflow-hidden">
                            {video.poster ? (
                                <img src={video.poster} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <FaPlay className="text-white/40 text-4xl" />
                                </div>
                            )}

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaPlay className="text-primary text-xl ml-1" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="p-4 relative z-10">
                            <h4 className="font-semibold text-primary text-sm mb-1">{video.title}</h4>
                            {video.description && (
                                <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {activeVideo !== null && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setActiveVideo(null)}
                    >
                        <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                            {/* Close Button */}
                            <motion.button
                                className="absolute -top-12 right-0 text-white/70 hover:text-white text-2xl z-10"
                                onClick={() => setActiveVideo(null)}
                                whileHover={{ scale: 1.1 }}
                            >
                                <FaTimes />
                            </motion.button>

                            {/* Fullscreen Toggle */}
                            <motion.button
                                className="absolute -top-12 right-10 text-white/70 hover:text-white text-lg z-10"
                                onClick={toggleFullscreen}
                                whileHover={{ scale: 1.1 }}
                            >
                                {isFullscreen ? <FaCompress /> : <FaExpand />}
                            </motion.button>

                            {/* Video Element */}
                            <motion.div
                                className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <video
                                    ref={videoRef}
                                    controls
                                    autoPlay
                                    className="w-full rounded-2xl"
                                    style={{ maxHeight: '80vh', background: '#000' }}
                                >
                                    <source src={videos[activeVideo].src} type="video/mp4" />
                                    Your browser does not support video playback.
                                </video>
                            </motion.div>

                            {/* Video Title */}
                            <motion.div
                                className="mt-4 text-center"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-white font-semibold text-lg">{videos[activeVideo].title}</h3>
                                {videos[activeVideo].description && (
                                    <p className="text-white/60 text-sm mt-1">{videos[activeVideo].description}</p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoGallery;