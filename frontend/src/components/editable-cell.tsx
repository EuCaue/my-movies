import React from "react";
import Rating from "@mui/material/Rating";
import ToggleButton from "@mui/material/ToggleButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import dayjs from "dayjs";

export type CellValue = string | number | boolean | undefined;

type EditableCellProps<T = CellValue> = {
  type: string;
  value: T;
  onChange: (newValue: T) => void;
};

type CellComponentProps<T = CellValue> = {
  value: T;
  onChange: (newValue: T) => void;
};

function YearPickerCell({ value, onChange }: CellComponentProps<number>) {
  return (
    <DatePicker
      name="date"
      views={["year"]}
      defaultValue={dayjs().year(value)}
      onYearChange={(year) => onChange(year.get("year"))}
      minDate={dayjs("1888-10-14")}
    />
  );
}

function RatingCell({ value, onChange }: CellComponentProps<number | null>) {
  return (
    <Rating
      precision={1}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
    />
  );
}

function ToggleButtonCell({ value, onChange }: CellComponentProps<boolean>) {
  return (
    <ToggleButton
      value="favorite"
      sx={{ background: "none" }}
      selected={value}
      onClick={() => onChange(!value)}
    >
      {value ? <Favorite /> : <FavoriteBorder />}
    </ToggleButton>
  );
}

function SelectCell({ value, onChange }: CellComponentProps<string>) {
  return (
    <Select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: "100%" }}
    >
      <MenuItem value="Not Watched" sx={{ width: "100%" }}>
        Not Watched
      </MenuItem>
      <MenuItem value="Watching" sx={{ width: "100%" }}>
        Watching
      </MenuItem>
      <MenuItem value="Watched" sx={{ width: "100%" }}>
        Watched
      </MenuItem>
    </Select>
  );
}

const CellComponents: Record<
  string,
  React.ComponentType<CellComponentProps<any>>
> = {
  year: YearPickerCell,
  rating: RatingCell,
  toggle: ToggleButtonCell,
  select: SelectCell,
};

export default function EditableCell<T extends CellValue>({
  type,
  value,
  onChange,
}: EditableCellProps<T>) {
  const CellComponent = CellComponents[type.toLowerCase()];

  return CellComponent ? (
    <CellComponent value={value} onChange={onChange} />
  ) : (
    <span style={{ color: "red" }}>Invalid Cell Type</span>
  );
}
