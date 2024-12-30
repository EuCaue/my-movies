"use client";
import { PasswordField } from "@/components/password-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
    password: z
      .string()
      .min(4, { message: "Password must be at least 4 characters." })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must include at least one special character.",
      }),
    passwordConfirm: z.string().nonempty("Please confirm your password."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

type SignUpFormFields = z.infer<typeof signUpFormSchema>;

//  TODO: add errors from backend
export default function SignUp() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
      email: "",
    },
  });

  //  TODO: reset form when somethiing went wrong with the backend
  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    console.log(values);
    router.push("/");
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
                error={Boolean(error)}
                helperText={error?.message}
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
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
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
            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <PasswordField
                  {...field}
                  required
                  id="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          </Stack>

          {/*  TODO: adding loading state when fetching the API  */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid}
          >
            Sign Up
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
