"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Alert,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BoxCenter from "@/components/box-center";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useSession } from "next-auth/react";
import { PasswordField } from "@/components/password-field";
import PopUp from "@/components/popup";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const combinedSchema = profileSchema.and(
  z
    .object({
      currentPassword: z.string().optional(),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const hasPasswordFields =
        data.currentPassword || data.newPassword || data.confirmPassword;
      if (hasPasswordFields) {
        const result = passwordSchema.safeParse(data);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue(issue);
          });
        }
      }
    }),
);

type FormData = z.infer<typeof combinedSchema>;
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      width: "120px",
      height: "120px",
      bgcolor: stringToColor(name),
      fontSize: "48px",
    },
    children: name.at(0)?.toUpperCase() ?? "",
  };
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default function ProfilePage() {
  const { data: session } = useSession();
  const [openUserDataPopup, setOpenUserDataPopup] = useState<boolean>(false);
  const [userDataChangedStatus, setUserDataChangedStatus] = useState<{
    message: string;
    severity: "error" | "success";
  }>({ message: "", severity: "error" });

  function handleClose() {
    setOpenUserDataPopup(false);
  }

  function handleUpdateError(error: any) {
    let errorMessage = "Expected error occurred.";

    if (error.details) {
      const firstKey = Object.keys(error.details)[0];
      errorMessage = error.details[firstKey]?.[0] || errorMessage;
    }

    setUserDataChangedStatus({
      message: `${errorMessage.substring(0, 1).toUpperCase()}${errorMessage.substring(1)}`,
      severity: "error",
    });

    setOpenUserDataPopup(true);
    reset({});
    console.error("ERROR on updating >", errorMessage);
  }

  const { control, handleSubmit, formState, reset, getValues } =
    useForm<FormData>({
      resolver: zodResolver(combinedSchema),
      mode: "onChange",
      defaultValues: {
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const { query, updateMutation: updateMutationUser } = useAuthQuery(
    "auth/user",
    session?.accessToken,
    {
      updateOptions: {
        onSuccess: () => {
          const currentValues = getValues();
          reset({
            ...currentValues,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setUserDataChangedStatus({
            message: "User profile data updated!",
            severity: "success",
          });
          setOpenUserDataPopup(true);
        },
        onError(error) {
          handleUpdateError(error);
        },
      },
    },
  );

  useEffect(() => {
    if (query?.data) {
      reset({
        username: query.data.username,
        email: query.data.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [query.data, reset]);

  const { postMutation } = useAuthQuery(
    "auth/password/change",
    session?.accessToken,
    {
      queryOptions: { enabled: false },
      postOptions: {
        onSuccess() {
          const currentValues = getValues();
          reset({
            ...currentValues,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setUserDataChangedStatus({
            message: "User profile data updated!",
            severity: "success",
          });
          setOpenUserDataPopup(true);
        },
        onError(error) {
          handleUpdateError(error);
        },
      },
    },
  );

  const backendError = useMemo(() => {
    // Combina os erros de ambas as mutations
    const rawError = {
      ...(postMutation.error?.details ?? {}),
      ...(updateMutationUser.error?.details ?? {}),
    };

    return Object.fromEntries(
      Object.entries(rawError).map(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return [key, capitalizeFirstLetter(value[0])];
        }
        if (typeof value === "string") {
          return [key, capitalizeFirstLetter(value)];
        }
        return [key, value];
      }),
    );
  }, [postMutation.error, updateMutationUser.error]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const dirty = formState.dirtyFields;

    if (dirty.username || dirty.email) {
      const payloadUserData = {
        username: data.username,
        email: data.email,
      };
      updateMutationUser.mutate(payloadUserData, Number(session?.user?.id));
    }

    if (dirty.currentPassword || dirty.newPassword || dirty.confirmPassword) {
      const payloadPasswordData = {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirm: data.confirmPassword,
      };
      postMutation.mutate(payloadPasswordData);
    }
  };

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <PopUp
        message={userDataChangedStatus.message}
        severity={userDataChangedStatus.severity}
        handleClose={handleClose}
        open={openUserDataPopup}
      />
      <Container maxWidth="md" sx={{ py: 4, mt: 6 }}>
        {backendError?.non_field_errors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {backendError.non_field_errors}
          </Alert>
        )}
        <Card elevation={3}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
              }}
            >
              <Avatar {...stringAvatar(session?.user?.username ?? "")} />
            </Box>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, (errors) =>
                console.error(errors),
              )}
            >
              <Grid2 container spacing={4}>
                <Grid2>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Username"
                        margin="normal"
                        error={Boolean(error) || backendError["username"]}
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
                        fullWidth
                        label="Email"
                        margin="normal"
                        error={Boolean(error) || backendError["email"]}
                        helperText={error?.message || backendError["email"]}
                      />
                    )}
                  />
                </Grid2>

                <Grid2>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <PasswordField
                        {...field}
                        required
                        fullWidth
                        type="password"
                        label="Current Password"
                        placeholder="Current Password"
                        margin="normal"
                        error={
                          Boolean(error) || backendError["current_password"]
                        }
                        helperText={
                          error?.message || backendError["current_password"]
                        }
                      />
                    )}
                  />
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <PasswordField
                        {...field}
                        required
                        fullWidth
                        label="New Password"
                        type="password"
                        placeholder="New Password"
                        margin="normal"
                        error={
                          Boolean(error) ||
                          Boolean(backendError["new_password1"])
                        }
                        helperText={
                          error?.message || backendError["new_password1"]
                        }
                      />
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <PasswordField
                        {...field}
                        fullWidth
                        required
                        type="password"
                        label="Confirm New Password"
                        placeholder="Confirm New Password"
                        margin="normal"
                        error={Boolean(error) || backendError["new_password2"]}
                        helperText={
                          error?.message || backendError["new_password2"]
                        }
                      />
                    )}
                  />
                </Grid2>
              </Grid2>

              <Divider sx={{ my: 4 }} />

              <BoxCenter>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!formState.isValid || !formState.isDirty}
                  sx={{ minWidth: 120 }}
                >
                  Save Changes
                </Button>
              </BoxCenter>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
