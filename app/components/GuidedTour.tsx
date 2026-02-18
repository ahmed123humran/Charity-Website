'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface TourStep {
    target: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface GuidedTourProps {
    steps: TourStep[];
    onComplete?: () => void;
    tourKey: string;
}

export default function GuidedTour({ steps, onComplete, tourKey }: GuidedTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
        if (!hasSeenTour) {
            setTimeout(() => setIsVisible(true), 500);
        }
    }, [tourKey]);

    const updateCoords = useCallback(() => {
        if (!isVisible || steps.length === 0) return;

        const element = document.querySelector(steps[currentStep].target);
        if (element) {
            const rect = element.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isVisible, steps, currentStep]);

    useEffect(() => {
        updateCoords();
        window.addEventListener('resize', updateCoords);
        return () => window.removeEventListener('resize', updateCoords);
    }, [updateCoords]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem(`tour_${tourKey}`, 'true');
        onComplete?.();
    };

    if (!isVisible) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Background Overlay with Hole */}
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" style={{
                clipPath: `polygon(0% 0%, 0% 100%, ${coords.left}px 100%, ${coords.left}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top + coords.height}px, ${coords.left}px ${coords.top + coords.height}px, ${coords.left}px 100%, 100% 100%, 100% 0%)`
            }} onClick={handleComplete} />

            {/* Tooltip Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute pointer-events-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-xs md:max-w-sm border border-slate-200 overflow-hidden"
                    style={step.position === 'center' ? {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    } : {
                        top: coords.top + coords.height + 16,
                        left: Math.max(20, Math.min(window.innerWidth - 370, coords.left + coords.width / 2 - 170)),
                    }}
                >
                    {/* Header accent bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/50" />

                    <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <Sparkles className="text-primary" size={18} />
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 leading-tight">{step.title}</h3>
                            </div>
                            <button onClick={handleComplete} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed mb-5 pr-2">{step.content}</p>

                        <div className="flex items-center justify-between">
                            {/* Step dots */}
                            <div className="flex items-center gap-1.5">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-full transition-all duration-300 ${i === currentStep
                                            ? 'w-5 h-2 bg-primary'
                                            : i < currentStep
                                                ? 'w-2 h-2 bg-primary/40'
                                                : 'w-2 h-2 bg-slate-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-sm"
                                >
                                    {currentStep === steps.length - 1 ? 'تم ✓' : 'التالي'}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Highlight Border */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute border-2 border-primary rounded-xl transition-all duration-300 pointer-events-none"
                style={{
                    top: coords.top - 6,
                    left: coords.left - 6,
                    width: coords.width + 12,
                    height: coords.height + 12,
                    boxShadow: '0 0 0 4px rgba(var(--primary-color-rgb, 79, 70, 229), 0.15), 0 0 20px rgba(var(--primary-color-rgb, 79, 70, 229), 0.1)',
                }}
            />
        </div>
    );
}
