import { SnackbarProps, AlertProps, Alert, Snackbar } from "@mui/material";

type PopUpProps = {
  open: boolean;
  handleClose: () => void;
  message: string;
  severity: AlertProps["severity"];
  alertProps?: Partial<AlertProps>;
  snackbarProps?: Partial<SnackbarProps>;
};

export default function PopUp({
  open,
  handleClose,
  message,
  severity,
  alertProps,
  snackbarProps,
}: PopUpProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      key="bottomcenter"
      {...snackbarProps} 
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", fontSize: "1.125rem" }}
        {...alertProps}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
