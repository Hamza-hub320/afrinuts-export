import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { fadeIn } from '../../utils/animations';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

interface GalleryImage {
    src: string;
    alt: string;
    caption?: string;
    loading?: "eager" | "lazy";
}

interface ImageGalleryProps {
    images: GalleryImage[];
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle body overflow and keyboard events
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    closeImage();
                } else if (e.key === 'ArrowLeft') {
                    goToPrev();
                } else if (e.key === 'ArrowRight') {
                    goToNext();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = 'auto';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isModalOpen, currentIndex]);

    const openImage = (index: number) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeImage = () => {
        setIsModalOpen(false);
        // Delay resetting currentIndex to allow animation to complete
        setTimeout(() => setCurrentIndex(null), 300);
    };

    const goToPrev = () => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : (prev || 0) - 1));
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : (prev || 0) + 1));
    };

    return (
        <div className={`${className}`}>
            {/* Responsive gallery: grid on sm+, horizontal scroll on mobile */}
            <div
                className="
                  flex overflow-x-auto snap-x snap-mandatory gap-6 p-4
                  sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:snap-none sm:p-0
                  lg:grid-cols-3
                "
            >
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="
                          relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl
                          snap-start transform-gpu
                          w-80 min-w-[20rem] sm:w-auto sm:min-w-0
                        "
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        whileHover={{
                            scale: 1.05,
                            y: -8,
                            rotateY: 3,
                            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openImage(index)}
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500 z-0" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-0" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500 z-0" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20 z-0" />

                        {/* Expand icon */}
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <FaExpand className="text-white text-sm" />
                        </div>

                        <motion.img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-64 object-cover relative z-10"
                            loading={image.loading || "lazy"}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

                        {image.caption && (
                            <div className="absolute inset-0 flex items-end p-4 z-20">
                                <Typography variant="body" className="text-white font-medium">
                                    {image.caption}
                                </Typography>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isModalOpen && currentIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/95"
                            onClick={closeImage} // click on backdrop closes modal
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="relative max-w-6xl w-full max-h-[90vh] z-50 p-4"
                            onClick={(e) => e.stopPropagation()} // prevent backdrop click
                        >
                            <motion.button
                                onClick={closeImage}
                                className="absolute top-6 right-6 text-white text-2xl bg-black/30 backdrop-blur-sm rounded-full p-3 z-50"
                                aria-label="Close gallery"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes />
                            </motion.button>

                            <motion.img
                                src={images[currentIndex].src}
                                alt={images[currentIndex].alt}
                                className="max-h-[70vh] w-full object-contain rounded-xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                key={currentIndex}
                            />

                            {(images[currentIndex].caption || images.length > 1) && (
                                <motion.div
                                    className="mt-6 flex justify-between items-center bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {images[currentIndex].caption && (
                                        <Typography variant="body" className="text-white font-medium">
                                            {images[currentIndex].caption}
                                        </Typography>
                                    )}

                                    {images.length > 1 && (
                                        <div className="flex space-x-4 items-center">
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToPrev();
                                                }}
                                                className="text-white hover:text-accent transition-colors focus:outline-none bg-black/30 backdrop-blur-sm rounded-full p-3"
                                                aria-label="Previous image"
                                                whileHover={{ scale: 1.1, x: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaChevronLeft size={20} />
                                            </motion.button>
                                            <span className="text-white font-medium bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                                                {currentIndex + 1} / {images.length}
                                            </span>
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToNext();
                                                }}
                                                className="text-white hover:text-accent transition-colors focus:outline-none bg-black/30 backdrop-blur-sm rounded-full p-3"
                                                aria-label="Next image"
                                                whileHover={{ scale: 1.1, x: 2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaChevronRight size={20} />
                                            </motion.button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;