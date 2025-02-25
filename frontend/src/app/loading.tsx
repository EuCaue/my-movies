import BoxCenter from "@/components/box-center";
import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

export default function Loading() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          minWidth: 300,
          textAlign: "center",
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <BoxCenter sx={{ mb: 2 }}>
            <CircularProgress size={50} color="primary" />
          </BoxCenter>
          <Typography variant="body1" color="textSecondary">
            Loading, please be patient! 😊
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
