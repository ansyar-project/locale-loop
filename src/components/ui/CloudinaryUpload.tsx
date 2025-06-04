"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadIcon, XIcon } from "lucide-react";

interface CloudinaryUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

interface CloudinaryWindow extends Window {
  cloudinary?: {
    createUploadWidget: (
      config: CloudinaryConfig,
      callback: CloudinaryCallback
    ) => CloudinaryWidget;
  };
}

interface CloudinaryConfig {
  cloudName: string | undefined;
  uploadPreset: string;
  folder: string;
  maxFiles: number;
  resourceType: string;
  clientAllowedFormats: string[];
  maxFileSize: number;
  sources: string[];
  cropping: boolean;
  multiple: boolean;
  eager: Array<{
    width: number;
    height: number;
    crop: string;
    quality: string;
  }>;
}

interface CloudinaryResult {
  event: string;
  info?: {
    secure_url: string;
  };
}

interface CloudinaryWidget {
  open: () => void;
}

type CloudinaryCallback = (
  error: Error | null,
  result: CloudinaryResult
) => void;

export function CloudinaryUpload({
  value,
  onChange,
  folder = "locale-loop",
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);

    if (typeof window !== "undefined" && (window as CloudinaryWindow).cloudinary) {
      const widget = (window as CloudinaryWindow).cloudinary!.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "locale-loop-preset", // Make sure this matches your preset name
          folder,
          maxFiles: 1,
          resourceType: "auto",
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          maxFileSize: 10000000, // 10MB
          sources: ["local", "url", "camera"], // Upload sources
          cropping: false, // Set to true if you want cropping
          multiple: false,
          // Transformation applied on upload
          eager: [{ width: 1200, height: 800, crop: "fill", quality: "auto" }],
        },
        (error: Error | null, result: CloudinaryResult) => {
          if (error) {
            console.error("Upload error:", error);
            setIsUploading(false);
            return;
          }

          if (result.event === "success") {
            onChange(result.info!.secure_url);
            setIsUploading(false);
          }

          if (result.event === "abort" || result.event === "close") {
            setIsUploading(false);
          }
        }
      );

      widget.open();
    } else {
      console.error("Cloudinary widget not loaded");
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
          <UploadIcon className="mx-auto h-12 w-12 text-white/60 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Upload an image
          </h3>
          <p className="text-white/60 mb-4">
            Click to upload or drag and drop
          </p>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? "Uploading..." : "Choose File"}
          </button>
        </div>
      )}
    </div>
  );
}
