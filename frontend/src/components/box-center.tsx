import { Box, BoxProps } from "@mui/material";

type BoxCenterProps = {
  children: React.ReactNode;
} & BoxProps;

export default function BoxCenter({ children, ...props }: BoxCenterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        alignSelf: "center"
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
