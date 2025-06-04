"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-gray-600 hover:text-gray-800 border-gray-300"
    >
      <LogOutIcon className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
