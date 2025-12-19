
import React from "react";
import {
    format,
    eachDayOfInterval,
    isSameDay,
    startOfMonth,
    endOfMonth,
    getDay,
    isToday,
    addMonths,
    subMonths,
} from "date-fns";

type StayRecord = {
    start: Date;
    end?: Date;
};

type StayCalendarProps = {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    stayHistory: StayRecord[];
    isAtBoarding: boolean;
    lastArrival: Date | null;
};

const StayCalendar = ({
    currentDate,
    onDateChange,
    stayHistory,
    isAtBoarding,
    lastArrival,
}: StayCalendarProps) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = getDay(monthStart); // 0 = Sunday

    const isStayedDate = (date: Date) => {
        return (
            stayHistory.some((interval) => {
                if (!interval.end) return isSameDay(date, interval.start); // ongoing
                return date >= interval.start && date <= interval.end;
            }) ||
            (isAtBoarding && lastArrival && date >= lastArrival && date <= new Date())
        );
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Stay Calendar
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onDateChange(subMonths(currentDate, 1))}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                        ←
                    </button>
                    <span className="text-sm font-medium">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button
                        onClick={() => onDateChange(addMonths(currentDate, 1))}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                        {" "}
                        →{" "}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`${d}-${i}`}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {daysInMonth.map((date) => {
                    const isStayed = isStayedDate(date);
                    const isTodayDate = isToday(date);

                    return (
                        <div
                            key={date.toString()}
                            className={`
                aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                ${isStayed
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                                }
                ${isTodayDate && !isStayed
                                    ? "border-2 border-indigo-600 font-bold"
                                    : ""
                                }
            `}
                        >
                            {format(date, "d")}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                <span>Stayed Dates</span>
            </div>
        </div>
    );
};

export default StayCalendar;
