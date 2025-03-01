"use client";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRenderCellParams,
  GridPreProcessEditCellProps,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Add,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { useCallback, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "@/theme";
import EditableCell, { type CellValue } from "@/components/editable-cell";
import MovieForm, {
  movieSchema,
  type MovieFormFields,
} from "@/components/forms/movie-form";
import BoxCenter from "@/components/box-center";
import Snackbar from "@mui/material/Snackbar";
import { useAuthQuery } from "@/hooks/useAuthQuery";

const dataGridSchema = movieSchema.pick({ title: true, description: true });

type RenderEditCellProps = {
  params: GridRenderCellParams<GridRowModel, CellValue>;
  type: string;
};

function RenderEditCell({ params, type }: RenderEditCellProps) {
  const handleChange = (newValue: CellValue) => {
    params.api.setEditCellValue({
      id: params.id,
      field: params.field,
      value: newValue,
    });
  };

  return (
    <EditableCell type={type} value={params.value} onChange={handleChange} />
  );
}

const renderEditCell = (
  params: GridRenderCellParams<GridRowModel, CellValue>,
  type: string,
) => {
  return (
    <EditableCell
      type={type}
      value={params.value}
      onChange={(newValue) =>
        params.api.setEditCellValue({
          id: params.id,
          field: params.field,
          value: newValue,
        })
      }
    />
  );
};
function transformSnakeCaseToRow(data: GridRowSnakeCase[]): GridRow[] {
  return data.map((item) => {
    const {
      id,
      title,
      description,
      release_year,
      movie_rating,
      favorite,
      watch_status,
      ...rest
    } = item;

    return {
      id,
      col1: title,
      col2: description,
      col3: release_year,
      col4: movie_rating,
      col5: favorite,
      col6: watch_status,
      ...rest,
    };
  });
}

function transformRowToSnakeCase(obj: GridRow): GridRowSnakeCase {
  const {
    id,
    col1: title,
    col2: description,
    col3: release_year,
    col4: movie_rating,
    col5: favorite,
    col6: watch_status,
    ...rest
  } = obj;

  return {
    id,
    title,
    description,
    release_year,
    movie_rating,
    favorite,
    watch_status,
    ...rest,
  };
}

type GridRowSnakeCase = {
  id: number;
  title: string;
  description: string;
  release_year: number;
  movie_rating: string;
  favorite: boolean;
  watch_status: string;
  [key: string]: any;
};

type GridRow = {
  id: number;
  col1: string;
  col2: string;
  col3: number;
  col4: string;
  col5: boolean;
  col6: string;
  [key: string]: any;
};

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const { query, postMutation, updateMutation, deleteMutation } = useAuthQuery(
    "movies",
    session?.accessToken,
    {
      queryOptions: {
        select: (data) => transformSnakeCaseToRow(data),
      },
    },
  );

  function handleClosePopup() {
    setShowDeletePopup(false);
    setIdToDelete(null);
  }

  async function onSubmit({
    title,
    description,
    releaseYear,
    rating,
    favorite,
    watchStatus,
  }: MovieFormFields) {
    handleClose();
    postMutation.mutate({
      title,
      description,
      release_year: releaseYear,
      movie_rating: rating,
      favorite,
      watch_status: watchStatus,
    });
  }
  function handleClickOpen() {
    setOpenPopup(true);
  }

  function handleClose() {
    setOpenPopup(false);
  }

  const processRowUpdate = useCallback(
    (updatedRow: GridRowModel) => {
      const currentRow = query.data.find(
        (row: GridRow) => row.id === updatedRow.id,
      );

      if (!currentRow) {
        return updatedRow;
      }
      const rowInSnakeCase = transformRowToSnakeCase(updatedRow as GridRow);
      updateMutation.mutate(rowInSnakeCase);
      return updatedRow;
    },
    [query.data, updateMutation],
  );

  async function preProcessEditCellProps(
    params: GridPreProcessEditCellProps,
    field: "title" | "description",
  ) {
    const { props } = params;
    const { value } = props;

    const fieldSchema = dataGridSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid value";
      setShowPopup(true);
      setErrorMessage(errorMessage);
      return { ...props, error: errorMessage };
    }
    setErrorMessage(null);
    setShowPopup(false);
    return { ...props, error: undefined };
  }

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "Title",
      editable: true,
      width: 150,
      preProcessEditCellProps: (params) =>
        preProcessEditCellProps(params, "title"),
    },
    {
      field: "col2",
      headerName: "Description",
      editable: true,
      width: 150,
      preProcessEditCellProps: (params) =>
        preProcessEditCellProps(params, "description"),
    },
    {
      field: "col3",
      headerName: "Year",
      editable: true,
      renderEditCell: (params) => renderEditCell(params, "year"),
      width: 150,
    },
    {
      field: "col4",
      type: "number",
      headerName: "Rating",
      editable: true,
      renderCell: (params) => {
        return (
          <BoxCenter sx={{ marginTop: "6px" }}>
            <Rating readOnly precision={1} value={params.value} />
          </BoxCenter>
        );
      },
      renderEditCell: (params) => {
        return (
          <BoxCenter>
            <RenderEditCell params={params} type="rating" />
          </BoxCenter>
        );
      },
      width: 150,
    },
    {
      field: "col5",
      headerName: "Favorite",
      renderCell: (params) => {
        return (
          <BoxCenter sx={{ marginTop: "6px", textAlign: "center" }}>
            {params.value ? <Favorite /> : <FavoriteBorder />}
          </BoxCenter>
        );
      },
      editable: true,
      renderEditCell: (params) => {
        return (
          <BoxCenter>
            <RenderEditCell params={params} type="toggle" />
          </BoxCenter>
        );
      },
      width: 150,
    },
    {
      field: "col6",
      headerName: "Status",
      editable: true,
      renderEditCell: (params) => {
        return (
          <BoxCenter>
            <RenderEditCell params={params} type="select" />
          </BoxCenter>
        );
      },
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<Delete />}
            label="Delete"
            onClick={() => {
              setIdToDelete(id.toString());
              setShowDeletePopup(true);
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  if (status == "loading") {
    return <CircularProgress />;
  }

  if (!session) {
    router.push("/landing-page");
    return;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={showDeletePopup} onClose={handleClosePopup}>
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are sure you to delete this movie?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClosePopup}
            variant="outlined"
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            type="button"
            onClick={() => {
              deleteMutation.mutate({ id: idToDelete! });
              handleClosePopup();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showPopup}
        autoHideDuration={3000}
        onClose={() => setShowPopup(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
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
        <Stack direction="column" spacing={4} alignItems={"center"}>
          <Typography variant="h4" gutterBottom color="info">
            Your Movies
          </Typography>
          <DataGrid
            rows={query.data}
            columns={columns}
            loading={
              query.isPending ||
              postMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending
            }
            processRowUpdate={processRowUpdate}
            sx={{ width: fullScreen ? "90vw" : "auto" }}
          />
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            onClick={handleClickOpen}
          >
            <Add />
          </Fab>
        </Stack>
        <MovieForm onSubmit={onSubmit} onClose={handleClose} open={openPopup} />
      </Container>
    </LocalizationProvider>
  );
}
