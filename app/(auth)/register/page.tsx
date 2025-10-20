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
import passwordMatchValidationSchema from "@/validation/passwordMatchValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import registerUser from "./actions";
import Link from "next/link";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .and(passwordMatchValidationSchema);

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await registerUser(data);
    if (response?.error) {
      form.setError("email", { message: response?.message });
    }
    console.log(data);
    console.log(response);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Registration Successful</CardTitle>
            <CardDescription>
              You can now log in with your new account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link">
              <Link href="/login">Log in</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register for a new account</CardDescription>
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirm Password"
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
                      <Button type="submit" className="cursor-pointer w-full">
                        Register
                      </Button>
                    </CardAction>
                    <div className="text-muted-foreground text-sm">
                      Already have an account?{" "}
                      <Link href="/login" className="underline">
                        Log in
                      </Link>
                    </div>
                  </CardFooter>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
