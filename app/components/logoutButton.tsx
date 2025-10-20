"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/globalActions";

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await logout();
      }}
    >
      Logout
    </Button>
  );
}
