"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { TrashIcon, XIcon } from "lucide-react";
import { deleteLoop } from "@/lib/actions/loopAction";
import { useToast } from "@/components/providers/ToastProvider";

interface DeleteConfirmDialogProps {
  loopId: string;
  loopTitle: string;
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({
  loopId,
  loopTitle,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        setIsOpen(false);
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabKey);

    // Focus the close button when modal opens
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen, isDeleting]);

  const handleClose = () => {
    if (!isDeleting) {
      setIsOpen(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteLoop(loopId);
      addToast({
        type: "success",
        title: "Success",
        message: "Loop deleted successfully",
      });
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting loop:", error);
      addToast({
        type: "error",
        title: "Error",
        message: "Failed to delete loop. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <TrashIcon className="w-5 h-5 text-white" />
              </div>
              <h3
                id="delete-dialog-title"
                className="text-lg font-semibold text-white"
              >
                Delete Loop
              </h3>
            </div>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              disabled={isDeleting}
              aria-label="Close dialog"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="delete-dialog-description" className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">&quot;{loopTitle}&quot;</span>?
            This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <TrashIcon className="w-5 h-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  This will permanently delete:
                </h4>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li>The loop and all its places</li>
                  <li>All comments and likes</li>
                  <li>All associated data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              ref={deleteButtonRef}
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Forever
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Delete Button */}
      <Button
        variant="destructive"
        size="sm"
        className="px-3"
        onClick={() => setIsOpen(true)}
        aria-label={`Delete ${loopTitle}`}
      >
        <TrashIcon className="w-3 h-3" />
      </Button>

      {/* Modal */}
      {isOpen && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
