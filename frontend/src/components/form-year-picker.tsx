import { DatePicker } from "@mui/x-date-pickers";
import { Control, Controller } from "react-hook-form";
import dayjs from "dayjs";
type FormYearPickerProps = {
  name: string;
  label: string;
  control: Control<any>;
};
export default function FormYearPicker({
  name,
  label,
  control,
}: FormYearPickerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          label={label}
          defaultValue={dayjs()}
          views={["year"]}
          onYearChange={(year) => {
            field.onChange(year.get("year"));
          }}
          minDate={dayjs("1888-10-14")}
        />
      )}
    />
  );
}
