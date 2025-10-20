import { login } from "@/lib/globalActions";

export default function LoginPage() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold">Login Page</h1>
      <button onClick={login}>Login with GitHub</button>
    </div>
  );
}
