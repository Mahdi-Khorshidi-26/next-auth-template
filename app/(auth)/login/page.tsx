"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { login } from "./actions";
import passwordValidationSchema from "@/validation/passwordValidation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login as loginWithGithub } from "@/lib/globalActions";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordValidationSchema,
});

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  const email = form.watch("email");
  

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await login(data);
    if (response?.error) {
      form.setError("root", { message: response?.message });
    } else {
      router.push("/my-account");
    }
    console.log(data);
    console.log(response);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset
                className="space-y-4"
                disabled={form.formState.isSubmitting}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <CardFooter className="flex-col gap-2 px-0">
                  <CardAction className="w-full">
                    {!!form.formState.errors.root?.message && (
                      <FormMessage>
                        {form.formState.errors.root.message}
                      </FormMessage>
                    )}
                    <Button type="submit" className="cursor-pointer w-full">
                      Login
                    </Button>
                  </CardAction>
                  <Button
                    type="button"
                    className="cursor-pointer w-full mt-2 mb-2"
                    onClick={loginWithGithub}
                  >
                    Login with GitHub
                  </Button>
                  <div className="text-muted-foreground text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline">
                      Register
                    </Link>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Forgot your password?{" "}
                    <Link
                      href={`/password-reset${
                        email ? `?email=${encodeURIComponent(email)}` : ""
                      }`}
                      className="underline"
                    >
                      Reset my password
                    </Link>
                  </div>
                </CardFooter>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
