import { useTogglePasswordVisibility } from "@/hooks/useTogglePasswordVisibility";
import {
  TextField,
  IconButton,
  InputAdornment,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type PasswordFieldProps = TextFieldProps;
export function PasswordField({ ...props }: PasswordFieldProps) {
  const { isVisible, toggleVisibility, inputType } =
    useTogglePasswordVisibility();

  return (
    <TextField
      {...props}
      type={inputType}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Toggle password visibility">
                <IconButton onClick={toggleVisibility} edge="end">
                  {isVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
