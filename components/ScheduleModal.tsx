"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaClock, FaCheck } from "react-icons/fa";

interface TimeSlot {
  time: Date;
  label: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduledTime: Date) => void;
  recipientType: {
    isRecruiter: boolean;
    isAlum: boolean;
  };
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  recipientType,
}: ScheduleModalProps) {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [customDateTime, setCustomDateTime] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [timeSuggestions, setTimeSuggestions] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (isOpen) {
      generateTimeSuggestions();
    }
  }, [isOpen]);

  const generateTimeSuggestions = () => {
    const now = new Date();
    const suggestions: TimeSlot[] = [];
    const currentHour = now.getHours();

    const addBusinessDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      let addedDays = 0;
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        const dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          addedDays++;
        }
      }
      return result;
    };

    const setTime = (date: Date, hour: number, minute: number = 0): Date => {
      const result = new Date(date);
      result.setHours(hour, minute, 0, 0);
      return result;
    };

    if (currentHour < 9) {
      const today = setTime(new Date(), 10, 0);
      suggestions.push({ time: today, label: "Today at 10:00 AM" });
      suggestions.push({
        time: setTime(new Date(), 14, 0),
        label: "Today at 2:00 PM",
      });
    } else if (currentHour < 16) {
      const laterToday = setTime(new Date(), currentHour + 2, 0);
      if (laterToday.getHours() < 18) {
        suggestions.push({ time: laterToday, label: "Later Today" });
      }
      const tomorrow = addBusinessDays(now, 1);
      suggestions.push({
        time: setTime(tomorrow, 10, 0),
        label: "Tomorrow Morning",
      });
    } else {
      const tomorrow = addBusinessDays(now, 1);
      suggestions.push({
        time: setTime(tomorrow, 10, 0),
        label: "Tomorrow Morning",
      });
      suggestions.push({
        time: setTime(tomorrow, 14, 0),
        label: "Tomorrow Afternoon",
      });
    }

    const nextWeek = addBusinessDays(now, 3);
    suggestions.push({ time: setTime(nextWeek, 10, 0), label: "Next Week" });

    setTimeSuggestions(suggestions);
    if (suggestions.length > 0) {
      setSelectedTime(suggestions[0].time);
    }
  };

  const handleSchedule = () => {
    const timeToSchedule =
      showCustom && customDateTime ? new Date(customDateTime) : selectedTime;

    if (!timeToSchedule) return;

    if (timeToSchedule <= new Date()) {
      alert("Please select a future time");
      return;
    }

    onSchedule(timeToSchedule);
    onClose();
  };

  const formatDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const getMinDateTime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-indigo-600" />
            <h2 className="text-xl font-semibold">Schedule Email</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaClock className="text-indigo-600" />
              Quick Options
            </h3>
            {timeSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedTime(suggestion.time);
                  setShowCustom(false);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedTime?.getTime() === suggestion.time.getTime() &&
                  !showCustom
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">
                      {suggestion.label}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateTime(suggestion.time)}
                    </p>
                  </div>
                  {selectedTime?.getTime() === suggestion.time.getTime() &&
                    !showCustom && (
                      <FaCheck className="text-indigo-600 flex-shrink-0 ml-2" />
                    )}
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {showCustom
                ? "← Back to quick options"
                : "Or choose custom date & time"}
            </button>

            {showCustom && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  min={getMinDateTime()}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={!selectedTime && !customDateTime}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
              selectedTime || customDateTime
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Schedule Email
          </button>
        </div>
      </div>
    </div>
  );
}
