import React from "react";
import { Controller, Control } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface FormTextFieldProps extends Omit<TextFieldProps, "name" | "control"> {
  name: string;
  control: Control<any>;
  backendError?: Record<string, string | undefined>;
}

export default function FormTextField({
  name,
  control,
  backendError = {},
  ...rest
}: FormTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          error={Boolean(error || backendError[name])}
          helperText={error?.message || backendError[name]}
          {...rest}
        />
      )}
    />
  );
}

