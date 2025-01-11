"use client";
import { PasswordField } from "@/components/password-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Container, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

const signUpFormSchema = z
  .object({
    username: z
      .string()
      .nonempty("Name is required")
      .max(255, "Name must be less than 100 characters"),
    email: z
      .string()
      .nonempty("Please specify an email")
      .email("Please specify a valid email"),
    password1: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must include at least one special character.",
      }),
    password2: z.string().nonempty("Please confirm your password."),
  })
  .refine((data) => data.password1 === data.password2, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

type SignUpFormFields = z.infer<typeof signUpFormSchema>;

const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (credentials: SignUpFormFields) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      return response.json();
    },
  });
};

export default function SignUp() {
  const { mutate, isPending, error } = useRegisterUser();

  const backendError = error ? JSON.parse(error.message)?.details : {};

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password1: "",
      password2: "",
      email: "",
    },
  });

  async function onSubmit(credentials: z.infer<typeof signUpFormSchema>) {
    mutate(credentials, {
      onError: (error) => {
        console.error("Backend error:", error);
      },
      onSuccess: async () => {
        try {
          await signIn("credentials", {
            email: credentials.email,
            password: credentials.password1,
            callbackUrl: "/",
          });
        } catch (error) {
          console.error("Error during signIn:", error);
        }
      },
    });
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
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
        {backendError?.non_field_errors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {backendError.non_field_errors}
          </Alert>
        )}
        <Stack direction={"column"} spacing={2}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                id="username"
                label="Name"
                placeholder="Enter your name"
                error={Boolean(error || backendError["username"])}
                helperText={error?.message || backendError["username"]}
              />
            )}
          />

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
                error={Boolean(error || backendError["email"])}
                helperText={error?.message || backendError["email"]}
              />
            )}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Controller
              name="password1"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <PasswordField
                  {...field}
                  required
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  error={Boolean(error || backendError["password1"])}
                  helperText={error?.message || backendError["password1"]}
                />
              )}
            />
            <Controller
              name="password2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <PasswordField
                  {...field}
                  required
                  id="passwordConfirm"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={Boolean(error || backendError["password2"])}
                  helperText={error?.message || backendError["password2"]}
                />
              )}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button
            type="button"
            color="info"
            variant="text"
            size="small"
            fullWidth={false}
            href="/signin"
          >
            Already have an account?
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
