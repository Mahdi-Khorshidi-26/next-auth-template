import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import UserInfo from "./userInfo";
import LogoutButton from "./logoutButton";

export default async function Header() {
  const session = await auth();
  
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <nav>
        <ul className="flex items-center space-x-4 font-bold">
          <li>
            <Link href="/my-account">My Account</Link>
          </li>
          <li>
            <Link href="/change-password">Change Password</Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center space-x-4">
        <UserInfo />
        {!!session?.user?.id ? (
          <LogoutButton />
        ) : (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
