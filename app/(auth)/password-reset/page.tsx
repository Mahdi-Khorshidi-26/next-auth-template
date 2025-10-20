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
import Link from "next/link";
import { login as loginWithGithub } from "@/lib/globalActions";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function PasswordResetPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // const response = await registerUser(data);
    // if (response?.error) {
    //   form.setError("email", { message: response?.message });
    // }
    // console.log(data);
    // console.log(response);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
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
                <CardFooter className="flex-col gap-2 px-0">
                  <CardAction className="w-full">
                    <Button type="submit" className="cursor-pointer w-full">
                      Submit
                    </Button>
                  </CardAction>
                  <Button
                    type="button"
                    className="cursor-pointer w-full mt-2 mb-2"
                    onClick={loginWithGithub}
                  >
                    Signup/Signin with GitHub
                  </Button>
                  <div className="text-muted-foreground text-sm">
                    Remember your password?{" "}
                    <Link href="/login" className="underline">
                      Log in
                    </Link>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline">
                      Sign up
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
