"use client";
import AuthButton from "@/components/auth-button";
import { PasswordField } from "@/components/password-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const signInFormSchema = z.object({
  email: z
    .string()
    .nonempty("Please specify an email")
    .email("Please specify a valid email"),
  password: z.string().nonempty("Please specify an password"),
});

type SignInFormFields = z.infer<typeof signInFormSchema>;

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({
    email,
    password,
  }: z.infer<typeof signInFormSchema>) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        callbackUrl: "/",
        username: email,
        password,
      });
      console.debug(res);
    } catch (err) {
      console.log(err);
    } finally {
    setIsLoading(false);
    }
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
      >
        <Stack spacing={2}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                id="email"
                label="Email"
                placeholder="Enter your email"
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PasswordField
                {...field}
                required
                id="password"
                label="Password"
                placeholder="Enter your password"
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
          <AuthButton
            isValid={isValid || isLoading}
            text={isLoading ? "Signing In..." : "Sign In"}
          />
          <Stack spacing={1} direction={"row"}>
            <Button
              type="button"
              color="info"
              variant="text"
              href="/signup"
              fullWidth={false}
              sx={{ textAlign: "center" }}
            >
              Don&apos;t have an account?
            </Button>
            <Button
              type="button"
              sx={{ textAlign: "center" }}
              color="inherit"
              variant="text"
              fullWidth={false}
              href="/recovery-password"
            >
              Forget your password?
            </Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
}
