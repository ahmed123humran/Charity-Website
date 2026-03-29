"use client";

import { useState, useEffect } from "react";
import { Pipette } from "lucide-react";

interface ColorInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
    id?: string;
    name?: string;
    presets?: string[];
}

export default function ColorInput({
    value,
    onChange,
    label,
    className = "",
    id,
    name,
    presets = [],
}: ColorInputProps) {
    const [isSupported, setIsSupported] = useState(false);
    const [localValue, setLocalValue] = useState(value || "");

    useEffect(() => {
        // Sync localValue with prop when prop changes
        if (value !== undefined) {
            setLocalValue(value);
        }
    }, [value]);

    useEffect(() => {
        // Check if EyeDropper is supported in the current browser
        setIsSupported(typeof window !== "undefined" && "EyeDropper" in window);
    }, []);

    const handleValueChange = (val: string) => {
        setLocalValue(val);
        onChange(val);
    };

    const handleEyeDropper = async () => {
        if (!isSupported) return;
        try {
            const eyeDropper = new (window as any).EyeDropper();
            const result = await eyeDropper.open();
            if (result && result.sRGBHex) {
                handleValueChange(result.sRGBHex);
            }
        } catch (e) {
            // User cancelled or error occurred
            console.log("EyeDropper interaction ended:", e);
        }
    };

    const sanitizeHex = (hex: string) => {
        if (!hex) return "#000000";
        if (!hex.startsWith("#")) hex = "#" + hex;
        // If it's #RRGGBBAA (9 chars) or more, trim to #RRGGBB (7 chars)
        if (hex.length > 7) return hex.substring(0, 7);
        return hex;
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-2">
                <div className="relative group flex-shrink-0">
                    <input
                        type="color"
                        id={id}
                        name={name}
                        value={sanitizeHex(localValue)}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="w-12 h-10 p-1 rounded-xl border border-slate-200 cursor-pointer bg-white transition-all hover:border-primary/50 ring-primary/10 hover:ring-4"
                    />
                </div>
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={localValue || ""}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono transition-all lowercase"
                        placeholder="#000000"
                    />
                </div>
                {isSupported && (
                    <button
                        type="button"
                        onClick={() => handleEyeDropper()}
                        className="flex-shrink-0 p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary-surface transition-all shadow-sm active:scale-90"
                        title="Pick color from screen"
                    >
                        <Pipette size={18} />
                    </button>
                )}
            </div>

            {presets && presets.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 px-0.5">
                    {presets.map((color, index) => (
                        <button
                            key={`${color}-${index}`}
                            type="button"
                            onClick={() => handleValueChange(color)}
                            className={`w-5 h-5 rounded-full border border-slate-200 shadow-sm hover:scale-110 transition-transform cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary/40 flex items-center justify-center relative overflow-hidden`}
                            style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
                            title={color}
                        >
                            {color === 'transparent' && (
                                <div className="absolute w-full h-[1px] bg-red-400 rotate-45" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
