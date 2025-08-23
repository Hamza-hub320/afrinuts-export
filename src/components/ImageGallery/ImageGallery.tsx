import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { fadeIn } from '../../utils/animations';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

    // Close when clicking on backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeImage();
        }
    };

    return (
        <div className={`${className}`}>
            {/* Responsive gallery: grid on sm+, horizontal scroll on mobile */}
            <div
                className="
                  flex overflow-x-auto snap-x snap-mandatory gap-4
                  sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:snap-none
                  lg:grid-cols-3
                "
            >
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="
                          relative group cursor-pointer overflow-hidden rounded-lg shadow-md
                          snap-start
                          w-72 min-w-[18rem] sm:w-auto sm:min-w-0
                        "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openImage(index)}
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            loading={image.loading || "lazy"}
                        />
                        {image.caption && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                                <Typography variant="body" className="text-white">
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
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleBackdropClick}
                    >
                        <button
                            onClick={closeImage}
                            className="absolute top-6 right-6 text-white text-2xl hover:text-afri-secondary transition-colors focus:outline-none"
                            aria-label="Close gallery"
                        >
                            <FaTimes />
                        </button>

                        <div className="relative max-w-4xl w-full max-h-[90vh]">
                            <motion.img
                                src={images[currentIndex].src}
                                alt={images[currentIndex].alt}
                                className="max-h-[80vh] w-full object-contain"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key={currentIndex}
                            />

                            {(images[currentIndex].caption || images.length > 1) && (
                                <div className="mt-4 flex justify-between items-center">
                                    {images[currentIndex].caption && (
                                        <Typography variant="body" className="text-white">
                                            {images[currentIndex].caption}
                                        </Typography>
                                    )}

                                    {images.length > 1 && (
                                        <div className="flex space-x-4 items-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToPrev();
                                                }}
                                                className="text-white hover:text-afri-secondary transition-colors focus:outline-none"
                                                aria-label="Previous image"
                                            >
                                                <FaChevronLeft size={24} />
                                            </button>
                                            <span className="text-white">
                        {currentIndex + 1} / {images.length}
                      </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToNext();
                                                }}
                                                className="text-white hover:text-afri-secondary transition-colors focus:outline-none"
                                                aria-label="Next image"
                                            >
                                                <FaChevronRight size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;