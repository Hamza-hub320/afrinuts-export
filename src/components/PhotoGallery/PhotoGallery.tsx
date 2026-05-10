import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaImage, FaExpand, FaCamera } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';

interface Photo {
    id: number;
    filePath: string;
    caption?: string;
    takenAt: number;
    photoType: 'BLOCK' | 'EXPENSE' | 'TASK';
    blockId?: number;
    expenseId?: number;
    taskId?: number;
}

interface PhotoGalleryProps {
    photos: Photo[];
    title?: string;
    entityType: 'block' | 'expense' | 'task';
    entityId: number;
    entityName?: string;
    compact?: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
                                                       photos,
                                                       title = 'Photo Gallery',
                                                       entityType,
                                                       entityId,
                                                       entityName,
                                                       compact = false,
                                                   }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredPhotos = photos.filter(p => {
        if (entityType === 'block') return p.blockId === entityId;
        if (entityType === 'expense') return p.expenseId === entityId;
        if (entityType === 'task') return p.taskId === entityId;
        return false;
    });

    const handlePrevious = () => {
        const newIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setSelectedPhoto(filteredPhotos[newIndex]);
    };

    const handleNext = () => {
        const newIndex = currentIndex === filteredPhotos.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setSelectedPhoto(filteredPhotos[newIndex]);
    };

    if (filteredPhotos.length === 0) {
        return (
            <motion.div
                className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl p-6 text-center"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                whileHover={{ y: -4, scale: 1.01 }}
            >
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                <div className="relative z-10">
                    <FaCamera className="text-4xl text-gray-300 mx-auto mb-3" />
                    <Typography variant="small" className="text-gray-400">No photos yet</Typography>
                </div>
            </motion.div>
        );
    }

    if (compact) {
        return (
            <motion.div
                className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-4"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                whileHover={{ y: -4, scale: 1.01 }}
            >
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                <div className="relative z-10">
                    <Typography variant="small" className="font-medium text-primary mb-3 flex items-center gap-2">
                        <FaImage className="text-accent" />
                        {title} ({filteredPhotos.length})
                    </Typography>

                    <div className="grid grid-cols-3 gap-2">
                        {filteredPhotos.slice(0, 6).map((photo, idx) => (
                            <motion.div
                                key={photo.id}
                                className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group/photo border-2 border-white/30 shadow-md"
                                whileHover={{ scale: 1.05, y: -2 }}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setSelectedPhoto(photo);
                                }}
                            >
                                <img
                                    src={photo.filePath}
                                    alt={photo.caption || `Photo ${photo.id}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/photo:opacity-100 transition-all flex items-center justify-center">
                                    <FaExpand className="text-white text-lg" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredPhotos.length > 6 && (
                        <Typography variant="small" className="text-gray-400 text-center mt-2">
                            +{filteredPhotos.length - 6} more photos
                        </Typography>
                    )}
                </div>

                <PhotoLightbox />
            </motion.div>
        );
    }

    return (
        <motion.div
            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl p-6"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            whileHover={{ y: -6, scale: 1.01, rotateY: 1 }}
        >
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4" className="text-primary flex items-center gap-2">
                        <FaImage className="text-accent" />
                        {title}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
                    </Typography>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredPhotos.map((photo, idx) => (
                        <motion.div
                            key={photo.id}
                            className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group/photo border-2 border-white/30 shadow-md"
                            whileHover={{ scale: 1.03, y: -3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}
                            onClick={() => {
                                setCurrentIndex(idx);
                                setSelectedPhoto(photo);
                            }}
                        >
                            <img
                                src={photo.filePath}
                                alt={photo.caption || `Photo ${photo.id}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/photo:opacity-100 transition-all flex items-end p-3">
                                {photo.caption && (
                                    <span className="text-white text-xs truncate">{photo.caption}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <PhotoLightbox />
        </motion.div>
    );

    function PhotoLightbox() {
        return (
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.button
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                            onClick={() => setSelectedPhoto(null)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaTimes className="text-lg" />
                        </motion.button>

                        {filteredPhotos.length > 1 && (
                            <>
                                <motion.button
                                    className="absolute left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                                    onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaChevronLeft className="text-xl" />
                                </motion.button>
                                <motion.button
                                    className="absolute right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaChevronRight className="text-xl" />
                                </motion.button>
                            </>
                        )}

                        <motion.img
                            key={selectedPhoto.id}
                            src={selectedPhoto.filePath}
                            alt={selectedPhoto.caption || 'Photo'}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {selectedPhoto.caption && (
                            <motion.div
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {selectedPhoto.caption}
                            </motion.div>
                        )}

                        <div className="absolute bottom-6 right-6 text-white/40 text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            {currentIndex + 1} / {filteredPhotos.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }
};

export default PhotoGallery;