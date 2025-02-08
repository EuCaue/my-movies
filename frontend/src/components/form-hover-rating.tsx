import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import StarIcon from "@mui/icons-material/Star";
import { Box, InputLabel, Typography } from "@mui/material";

const labels: { [index: string]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

type FormHoverRatingProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function FormHoverRating({
  name,
  label,
  control,
}: FormHoverRatingProps) {
  const [hover, setHover] = useState<number>(-1);

  return (
    <Box>
      {label && <InputLabel>{label}</InputLabel>}
    <Stack direction={"column"}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Rating
              {...field}
              value={field.value}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(_, newValue) => field.onChange(newValue)}
              onChangeActive={(_, newHover) => setHover(newHover)}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            {field.value !== null && (
              <Box sx={{ ml: 2, alignSelf: "center", textAlign: "center" }}>
                {labels[hover !== -1 ? hover : field.value]}
              </Box>
            )}
          </>
        )}
      />
    </Stack>
  </Box>
  );
}
