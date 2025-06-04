"use client";

import React, { useEffect, useState } from "react";
import { ToastMessage } from "@/components/providers/ToastProvider";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />;
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
      case "info":
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTitleColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
      default:
        return "text-blue-800";
    }
  };

  const getMessageColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      case "warning":
        return "text-yellow-700";
      case "info":
      default:
        return "text-blue-700";
    }
  };

  return (
    <div
      className={`
        min-w-96 max-w-lg w-full shadow-lg rounded-lg pointer-events-auto border transition-all duration-300 ease-in-out transform
        ${getBackgroundColor()}
        ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        ${isExiting ? "translate-x-full opacity-0" : ""}
      `}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium ${getTitleColor()} truncate`}>
                {toast.title}
              </p>
              {toast.message && (
                <>
                  <span className={`text-sm ${getMessageColor()}`}>•</span>
                  <p className={`text-sm ${getMessageColor()} truncate`}>
                    {toast.message}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex-shrink-0">
            <button
              className={`
                inline-flex rounded-md p-1.5 transition-colors
                ${
                  toast.type === "success"
                    ? "text-green-500 hover:bg-green-100"
                    : ""
                }
                ${toast.type === "error" ? "text-red-500 hover:bg-red-100" : ""}
                ${
                  toast.type === "warning"
                    ? "text-yellow-500 hover:bg-yellow-100"
                    : ""
                }
                ${
                  toast.type === "info" ? "text-blue-500 hover:bg-blue-100" : ""
                }
              `}
              onClick={handleClose}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
