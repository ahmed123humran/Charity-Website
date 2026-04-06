'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { closeModal } from '@/app/store/slices/dynamicModalSlice';
import DynamicSwiper from './DynamicSwiper';
import { X } from 'lucide-react';

const DynamicDetailModal = () => {
    const dispatch = useAppDispatch();
    const { isOpen, dynamicId, snippet } = useAppSelector((state) => state.dynamicModal);

    if (!isOpen || !dynamicId || !snippet) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="absolute inset-0"
                onClick={() => dispatch(closeModal())}
            />

            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Floating Close Button */}
                <button
                    onClick={() => dispatch(closeModal())}
                    className="absolute top-4 end-4 z-50 w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white backdrop-blur-md border border-white/50 rounded-full shadow-lg transition-all text-slate-700 hover:text-slate-900"
                >
                    <X size={20} />
                </button>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                    <DynamicSwiper
                        snippet={{
                            ...snippet,
                            htmlContent: snippet.swiperConfig?.modalHtml ? snippet.swiperConfig.modalHtml : snippet.htmlContent,
                            swiperConfig: {
                                ...snippet.swiperConfig,
                                isDetailView: true // Always force detail view mode inside this modal
                            }
                        }}
                        dynamicId={dynamicId}
                    />
                </div>
            </div>
        </div>
    );
};

export default DynamicDetailModal;
