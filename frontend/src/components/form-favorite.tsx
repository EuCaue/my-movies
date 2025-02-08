import { Favorite, FavoriteBorder } from "@mui/icons-material";
import ToggleButton from "@mui/material/ToggleButton";
import { InputLabel, Stack } from "@mui/material";
import { Control, Controller } from "react-hook-form";
type FormFavoriteProps = {
  name: string;
  label: string;
  control: Control<any>;
};
export default function FormFavorite({
  name,
  label,
  control,
}: FormFavoriteProps) {
  return (
    <Stack direction="column">
      {label && <InputLabel>{label}</InputLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <ToggleButton
              value="check"
              selected={field.value}
              color="error"
              onChange={() => field.onChange(!field.value)}
              sx={{ border: "none", backgroundColor: "none" }}
              aria-label="toggle favorite"
            >
              {field.value ? <Favorite /> : <FavoriteBorder />}
            </ToggleButton>
          </>
        )}
      />
    </Stack>
  );
}
