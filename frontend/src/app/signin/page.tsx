"use client";
import AuthButton from "@/components/auth-button";
import { PasswordField } from "@/components/password-field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Container,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openLoginStatus, setOpenLoginStatus] = useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState<{
    message: string;
    severity: "error" | "success";
  }>({ message: "", severity: "error" });

  function handleClose() {
    setOpenLoginStatus(false);
  }

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
        email,
        password,
        redirect: false,
      });
      setOpenLoginStatus(true);

      if (res?.error) {
        setLoginStatus({
          message: "Invalid credentials. Please try again.",
          severity: "error",
        });
        return;
      }

      setLoginStatus({
        message: "Login successful. Welcome back!",
        severity: "success",
      });
      router.push("/");
    } catch (err) {
      console.log("error on signIN", err);
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
      <Snackbar
        open={openLoginStatus}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        key={"bottomcenter"}
      >
        <Alert
          onClose={handleClose}
          severity={loginStatus.severity}
          variant="filled"
          sx={{ width: "100%", fontSize: "1.125rem" }}
        >
          {loginStatus.message}
        </Alert>
      </Snackbar>
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
