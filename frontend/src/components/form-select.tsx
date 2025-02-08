import { InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type Option = { value: string; displayName: string };
type FormSelectProps = {
  name: string;
  label: string;
  control: Control<any>;
  options: Array<Option>;
};

export default function FormSelect({
  name,
  label,
  control,
  options,
}: FormSelectProps) {
  return (
    <Stack spacing={2} direction="column">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <InputLabel id="watch-status-id">{label}</InputLabel>
            <Select
              labelId="select-watch-status"
              id="select-watch-status"
              value={field.value || ""}
              label="Watch Status"
              onChange={(event) => field.onChange(event.target.value)}
              defaultValue={options[0]}
            >
              {options.map(({ value, displayName }) => (
                <MenuItem key={value} value={value}>
                  {displayName}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      />
    </Stack>
  );
}
