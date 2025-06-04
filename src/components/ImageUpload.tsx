"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImageIcon, Trash2, Upload } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "locale-loop",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center bg-white/5">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-white/60 mx-auto mb-2" />
            <p className="text-white/60 text-sm">No image uploaded</p>
          </div>
        </div>
      )}

      <CldUploadWidget
        uploadPreset="locale-loop-upload" // Create this in Cloudinary dashboard
        options={{
          folder,
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxImageFileSize: 2000000, // 2MB
        }}
        onSuccess={(result) => {
          if (typeof result.info === "object" && "secure_url" in result.info) {
            onChange(result.info.secure_url);
          }
          setIsUploading(false);
        }}
        onQueuesEnd={() => setIsUploading(false)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => {
              setIsUploading(true);
              open();
            }}
            disabled={isUploading}
            className="w-full flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading
              ? "Uploading..."
              : value
              ? "Change Image"
              : "Upload Image"}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
