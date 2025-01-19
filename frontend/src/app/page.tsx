"use client";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/form-text-field";
import FormHoverRating from "@/components/form-hover-rating";
import FormFavorite from "@/components/form-favorite";
import FormSelect from "@/components/form-select";
const movieSchema = z.object({
  title: z
    .string()
    .nonempty()
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .nonempty()
    .max(255, "Description must be less than 255 characters"),
  releaseYear: z.number().default(2025),
  rating: z
    .number()
    .max(5, "Max Rating should be 5")
    .min(0, "Min Value should be 0"),
  favorite: z.boolean().default(false),
  watchStatus: z.enum(["Not Watched", "Watching", "Watched"]),
});

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormYearPicker from "@/components/form-year-picker";

type MovieFormFields = z.infer<typeof movieSchema>;

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const {
    control,
    formState: { isValid, defaultValues },
    handleSubmit,
  } = useForm<MovieFormFields>({
    resolver: zodResolver(movieSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      releaseYear: 2025,
      rating: 2.5,
      favorite: false,
      watchStatus: "Watched",
    },
  });
  const rows: GridRowsProp = [];
  async function onSubmit(data: z.infer<typeof movieSchema>) {
    console.log(data);
  }
  const handleClickOpen = () => {
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Title", width: 150 },
    { field: "col2", headerName: "Description", width: 150 },
    { field: "col3", headerName: "Release Year", width: 150 },
    { field: "col4", headerName: "Rating", width: 150 },
    { field: "col5", headerName: "Favorite", width: 150 },
    { field: "col6", headerName: "Watch Status", width: 150 },
  ];
  if (status == "loading") {
    return <CircularProgress />;
  }

  if (!session) {
    //  TODO: adding a popup showing message here
    router.push("/landing-page");
    return;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <DataGrid rows={rows} columns={columns} />
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            <Add />
          </Button>
          <Dialog
            open={openPopup}
            onClose={handleClose}
            PaperProps={{
              component: "form",
              onSubmit: handleSubmit(onSubmit, (errors) =>
                console.error(errors),
              ),
            }}
          >
            <DialogTitle>Add a movie</DialogTitle>
            <DialogContent>
              <DialogContentText>Fill up the form</DialogContentText>
              <FormTextField
                name="title"
                control={control}
                label="Title"
                placeholder="Title"
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
              <FormHoverRating
                name="rating"
                control={control}
                label={"Rating"}
              />
              <FormFavorite
                name="favorite"
                control={control}
                label={"Favorite"}
              />
              <FormSelect
                name="watchStatus"
                label={"Watch Status"}
                control={control}
                options={[
                  { value: "Not Watched", displayName: "Not Watched" },
                  { value: "Watching", displayName: "Watching" },
                  { value: "Watched", displayName: "Watched" },
                ]}
              />
            </DialogContent>
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
          </Dialog>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
