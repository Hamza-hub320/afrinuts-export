import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { fadeIn } from '../../utils/animations';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface GalleryImage {
    src: string;
    alt: string;
    caption?: string;
}

interface ImageGalleryProps {
    images: GalleryImage[];
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const openImage = (index: number) => {
        setCurrentIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeImage = () => {
        setCurrentIndex(null);
        document.body.style.overflow = 'auto';
    };

    const goToPrev = () => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : (prev || 0) - 1));
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : (prev || 0) + 1));
    };

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                        whileHover={{ scale: 1.02 }}
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
            {currentIndex !== null && (
                <motion.div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button
                        onClick={closeImage}
                        className="absolute top-6 right-6 text-white text-2xl hover:text-afri-secondary transition-colors"
                        aria-label="Close gallery"
                    >
                        <FaTimes />
                    </button>

                    <div className="relative max-w-4xl w-full">
                        <img
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt}
                            className="max-h-[80vh] w-full object-contain"
                        />

                        {(images[currentIndex].caption || images.length > 1) && (
                            <div className="mt-4 flex justify-between items-center">
                                {images[currentIndex].caption && (
                                    <Typography variant="body" className="text-white">
                                        {images[currentIndex].caption}
                                    </Typography>
                                )}

                                {images.length > 1 && (
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToPrev();
                                            }}
                                            className="text-white hover:text-afri-secondary transition-colors"
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
                                            className="text-white hover:text-afri-secondary transition-colors"
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
        </div>
    );
};

export default ImageGallery;