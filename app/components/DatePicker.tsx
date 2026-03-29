"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Calendar, ChevronRight, ChevronLeft, X } from "lucide-react";

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    locale?: string;
    icon?: React.ReactNode;
    minDate?: string;
    maxDate?: string;
    name?: string;
    id?: string;
    required?: boolean;
}

const MONTHS_AR = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const MONTHS_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS_AR = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

export default function DatePicker({
    label,
    value,
    onChange,
    error,
    placeholder,
    locale = "ar",
    icon,
    minDate,
    maxDate,
    name,
    id,
    required,
}: DatePickerProps) {
    const isAr = locale === "ar";
    const months = isAr ? MONTHS_AR : MONTHS_EN;
    const dayLabels = isAr ? DAYS_AR : DAYS_EN;

    const today = new Date();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"days" | "months" | "years">("days");
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [yearRangeStart, setYearRangeStart] = useState(Math.floor(today.getFullYear() / 20) * 20);
    const [openUp, setOpenUp] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse selected value
    const selectedDate = value ? new Date(value) : null;

    useEffect(() => {
        if (selectedDate) {
            setViewYear(selectedDate.getFullYear());
            setViewMonth(selectedDate.getMonth());
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setView("days");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on escape
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setIsOpen(false);
                setView("days");
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleOpenToggle = () => {
        if (!isOpen) {
            // Check space before opening
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setOpenUp(spaceBelow < 400); // 400px is roughly the height of the calendar + safety margin
            }
        }
        setIsOpen(!isOpen);
    };

    const handleSelectDay = useCallback((day: number) => {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        onChange(dateStr);
        setIsOpen(false);
        setView("days");
    }, [viewYear, viewMonth, onChange]);

    const handleSelectMonth = useCallback((month: number) => {
        setViewMonth(month);
        setView("days");
    }, []);

    const handleSelectYear = useCallback((year: number) => {
        setViewYear(year);
        setView("months");
    }, []);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else { setViewMonth(viewMonth - 1); }
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else { setViewMonth(viewMonth + 1); }
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    const formatDisplayDate = () => {
        if (!selectedDate) return "";
        const day = selectedDate.getDate();
        const month = months[selectedDate.getMonth()];
        const year = selectedDate.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const isDateDisabled = (day: number) => {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (minDate && dateStr < minDate) return true;
        if (maxDate && dateStr > maxDate) return true;
        return false;
    };

    const isToday = (day: number) =>
        viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

    const isSelected = (day: number) =>
        selectedDate &&
        viewYear === selectedDate.getFullYear() &&
        viewMonth === selectedDate.getMonth() &&
        day === selectedDate.getDate();

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    // Build calendar grid
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    // Year range for year picker
    const years: number[] = [];
    for (let y = yearRangeStart; y < yearRangeStart + 20; y++) years.push(y);

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                {label}
                {required && <span className="text-rose-500 ms-1">*</span>}
            </label>
            {/* Input */}
            <div
                onClick={handleOpenToggle}
                className={`
                    relative flex items-center w-full px-4 py-2 bg-white
                    border border-slate-200 rounded-xl text-sm cursor-pointer text-slate-900
                    transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-primary/20
                    ${error
                        ? "border-red-400 ring-2 ring-red-100"
                        : ""
                    }
                `}
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-expanded={isOpen}
            >
                <span className="me-2 pointer-events-none">
                    {icon || <Calendar size={18} />}
                </span>
                <span className={`flex-1 ${value ? "text-slate-900" : "text-slate-400"}`}>
                    {value ? formatDisplayDate() : (placeholder || label)}
                </span>
                {value && (
                    <button
                        type="button"
                        onClick={clear}
                        className="ms-2 p-1 rounded-md hover:text-red-500 transition-all"
                        aria-label="Clear date"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500 dark:text-red-400 font-medium mt-0.5 block">
                    {error}
                </span>
            )}

            {/* Dropdown Calendar */}
            {isOpen && (
                <div
                    className={`
                        absolute z-50 w-[320px]
                        bg-white dark:bg-gray-800 rounded-2xl
                        shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                        border border-slate-100 dark:border-gray-700
                        animate-in fade-in zoom-in-95 duration-200 overflow-hidden
                        ${openUp ? "bottom-full mb-3 origin-bottom" : "top-full mt-2 origin-top"}
                        ${isAr ? "end-0" : "start-0"}
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
                        <button
                            type="button"
                            onClick={() => {
                                if (view === "days") prevMonth();
                                else if (view === "years") setYearRangeStart(yearRangeStart - 20);
                            }}
                            className="p-1.5 rounded-xl hover:bg-white/20 transition-all active:scale-95"
                        >
                            {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (view === "days") setView("months");
                                else if (view === "months") setView("years");
                                else setView("days");
                            }}
                            className="font-black text-sm hover:bg-white/20 px-4 py-1.5 rounded-xl transition-all active:scale-95 tracking-tight uppercase"
                        >
                            {view === "days" && `${months[viewMonth]} ${viewYear}`}
                            {view === "months" && `${viewYear}`}
                            {view === "years" && `${yearRangeStart} - ${yearRangeStart + 19}`}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (view === "days") nextMonth();
                                else if (view === "years") setYearRangeStart(yearRangeStart + 20);
                            }}
                            className="p-1.5 rounded-xl hover:bg-white/20 transition-all active:scale-95"
                        >
                            {isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>
                    </div>

                    {/* Calendar body */}
                    <div className="p-3">
                        {/* Days view */}
                        {view === "days" && (
                            <>
                                <div className="grid grid-cols-7 gap-0.5 mb-1">
                                    {dayLabels.map((d) => (
                                        <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1.5">
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-0.5">
                                    {calendarDays.map((day, idx) =>
                                        day === null ? (
                                            <div key={`empty-${idx}`} />
                                        ) : (
                                            <button
                                                key={day}
                                                type="button"
                                                disabled={isDateDisabled(day)}
                                                onClick={() => handleSelectDay(day)}
                                                className={`
                                                    w-full aspect-square flex items-center justify-center
                                                    text-sm rounded-xl font-bold transition-all duration-200
                                                    ${isSelected(day)
                                                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                                        : isToday(day)
                                                            ? "bg-primary-surface text-primary font-black ring-1 ring-primary/20"
                                                            : isDateDisabled(day)
                                                                ? "text-slate-200 dark:text-gray-700 cursor-not-allowed"
                                                                : "text-slate-600 dark:text-gray-300 hover:bg-primary-surface hover:text-primary"
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        )
                                    )}
                                </div>
                            </>
                        )}

                        {/* Months view */}
                        {view === "months" && (
                            <div className="grid grid-cols-3 gap-2">
                                {months.map((m, idx) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => handleSelectMonth(idx)}
                                        className={`
                                            py-3 px-2 rounded-xl text-sm font-medium transition-all
                                            ${viewMonth === idx
                                                ? "bg-primary text-white shadow-md"
                                                : "text-slate-700 hover:bg-primary/5"
                                            }
                                        `}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Years view */}
                        {view === "years" && (
                            <div className="grid grid-cols-4 gap-2">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        type="button"
                                        onClick={() => handleSelectYear(y)}
                                        className={`
                                            py-2.5 rounded-xl text-sm font-bold transition-all
                                            ${viewYear === y
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : y === today.getFullYear()
                                                    ? "text-primary font-black bg-primary-surface"
                                                    : "text-slate-600 dark:text-gray-300 hover:bg-primary-surface hover:text-primary"
                                            }
                                        `}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer - Today button */}
                    <div className="px-3 pb-3">
                        <button
                            type="button"
                            onClick={() => {
                                setViewYear(today.getFullYear());
                                setViewMonth(today.getMonth());
                                handleSelectDay(today.getDate());
                            }}
                            className="w-full py-2.5 text-xs font-black text-primary hover:bg-primary-surface rounded-xl transition-all uppercase tracking-widest"
                        >
                            {isAr ? "اليوم" : "Today"}
                        </button>
                    </div>
                </div>
            )}
            {/* Form Hidden Input */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    id={id || name}
                    value={value || ""}
                />
            )}
        </div>
    );
}
