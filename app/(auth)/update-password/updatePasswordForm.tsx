"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
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
import { toast } from "sonner";
import { updatePassword } from "./actions";
import Link from "next/link";

const formSchema = passwordMatchValidationSchema;

export default function UpdatePasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await updatePassword({
      password: data.password,
      confirmPassword: data.confirmPassword,
      token,
      email,
    });

    if (response?.tokenIsValid) {
      window.location.reload();
    }

    if (response?.error) {
      form.setError("root", { message: response?.message });
    }
    form.reset();
    toast.success("Password has been changed successfully");
    console.log(data);
    console.log(response);
  };

  return (
    <>
      {form.formState.isSubmitSuccessful ? (
        <div>
          Your password has been changed successfully
          <Link href="/login" className="underline">
            Go to login
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset
              className="space-y-4"
              disabled={form.formState.isSubmitting}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New Password"
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm New Password"
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
                  {!!form.formState.errors.root && (
                    <FormMessage className="text-center mb-2">
                      {form.formState.errors.root.message}
                    </FormMessage>
                  )}
                  <Button type="submit" className="cursor-pointer w-full">
                    Update Password
                  </Button>
                </CardAction>
              </CardFooter>
            </fieldset>
          </form>
        </Form>
      )}
    </>
  );
}
