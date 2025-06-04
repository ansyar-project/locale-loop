"use client";

import Image from "next/image";
import { useState } from "react";

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  size?: number;
  className?: string;
}

export function UserAvatar({
  user,
  size = 40,
  className = "",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Get initials from name or email
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Generate consistent color based on user
  const getAvatarColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];

    const identifier = user.email || user.name || "default";
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (user.image && !imageError) {
    return (
      <Image
        src={user.image}
        alt={user.name || "User"}
        width={size}
        height={size}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }} // Ensure exact dimensions
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 ${getAvatarColor()} ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        fontSize: size * 0.4,
      }}
    >
      {getInitials()}
    </div>
  );
}
