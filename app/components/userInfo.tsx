import { auth } from "@/auth";

export default async function UserInfo() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div>No user currently logged in</div>;
  }

  return <div className="text-black font-bold">{session.user.email}</div>;
}
