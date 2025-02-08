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
import { Add, Delete, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
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
function transformData(data: any[]): any[] {
  return data.map(
    ({
      created_at,
      owner,
      id,
      title,
      description,
      release_year,
      movie_rating,
      favorite,
      watch_status,
    }) => ({
      id,
      col1: title,
      col2: description,
      col3: release_year,
      col4: movie_rating,
      col5: favorite,
      col6: watch_status,
    }),
  );
}

function transformToSnakeCase(obj: any): any {
  return {
    id: obj.id,
    title: obj.col1,
    description: obj.col2,
    release_year: obj.col3,
    movie_rating: obj.col4,
    favorite: obj.col5,
    watch_status: obj.col6,
  };
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>(() => {});
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const { query, postMutation, updateMutation, deleteMutation } = useAuthQuery(
    "movies",
    session?.accessToken,
  );

  function handleClosePopup() {
    setShowDeletePopup(false);
    setIdToDelete(null);
  }

  useEffect(() => {
    if (query.data) {
      const newRows = transformData(query.data);
      setRows(newRows);
    }
  }, [query.data]);

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
      //  TODO: maybe use useMemo()
      const currentRow = rows.find((row) => row.id === updatedRow.id); 

      if (!currentRow) {
        return updatedRow;
      }
      const rowInSnakeCase = transformToSnakeCase(updatedRow);
      updateMutation.mutate(rowInSnakeCase);
      return updatedRow;
    },
    [rows, updateMutation],
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
    //  TODO: adding a snackar message here
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
        <Stack direction="column" spacing={2} alignItems={"center"}>
          <DataGrid
            rows={rows}
            columns={columns}
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
