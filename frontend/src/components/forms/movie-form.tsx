"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormTextField from "@/components/form-text-field";
import FormHoverRating from "@/components/form-hover-rating";
import FormFavorite from "@/components/form-favorite";
import FormSelect from "@/components/form-select";
import FormYearPicker from "@/components/form-year-picker";
import theme from "@/theme";

export const movieSchema = z.object({
  title: z
    .string()
    .nonempty()
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .nonempty()
    .max(450, "Description must be less than 450 characters"),
  releaseYear: z.number().default(2025),
  rating: z
    .number()
    .max(5, "Max Rating should be 5")
    .min(0, "Min Value should be 0"),
  favorite: z.boolean().default(false),
  watchStatus: z.enum(["Not Watched", "Watching", "Watched"]),
});

export type MovieFormFields = z.infer<typeof movieSchema>;

type MovieFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MovieFormFields) => Promise<void>;
};

export default function MovieForm({ open, onClose, onSubmit }: MovieFormProps) {
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<MovieFormFields>({
    mode: "onChange",
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseYear: 2025,
      rating: 2.5,
      favorite: false,
      watchStatus: "Watched",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        style: {
          margin: 0,
          height: "auto",
          width: fullScreen ? "90%" : "auto",
        },
        onSubmit: handleSubmit(
          (data) => {
            handleClose();
            onSubmit(data);
          },
          (errors) => console.error(errors),
        ),
      }}
    >
      <DialogTitle>Create Movie</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} direction="column" sx={{ width: 400 }}>
          <FormTextField
            name="title"
            control={control}
            label="Title"
            placeholder="Enter the movie title"
          />
          <FormTextField
            name="description"
            control={control}
            label="Description"
            placeholder="Enter the movie description"
          />
          <FormYearPicker
            name="releaseYear"
            control={control}
            label="Release Year"
          />
          <FormSelect
            name="watchStatus"
            label="Watch Status"
            control={control}
            options={[
              { value: "Not Watched", displayName: "Not Watched" },
              { value: "Watching", displayName: "Watching" },
              { value: "Watched", displayName: "Watched" },
            ]}
          />
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <FormFavorite name="favorite" control={control} label="Favorite" />
            <FormHoverRating name="rating" control={control} label="Rating" />
          </Stack>
        </Stack>
        <DialogActions>
          <Button
            type="button"
            color="error"
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
