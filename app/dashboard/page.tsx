import { auth } from "@/auth";
import { login, logout, userLoggedInStatus } from "@/lib/globalActions";
import { log } from "console";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();
  const loggedIn = await userLoggedInStatus();

  if (loggedIn) {
    log("User is logged in");
  } else {
    log("User is not logged in");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
      <p>{loggedIn ? "You are logged in" : "You are not logged in"}</p>
      <p>{loggedIn && session ? session?.user?.name : ""}</p>
      <p>{loggedIn && session ? session?.user?.email : ""}</p>
      {loggedIn && session?.user?.image ? (
        <Image
          src={session?.user?.image}
          alt="User Image"
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
        />
      ) : null}
      <button onClick={login}>Login with GitHub</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
