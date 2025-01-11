"use client"
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status == "loading") {
    return <CircularProgress />;
  }

  if (!session) {
    //  TODO: adding a popup showing message here 
    router.push("/landing-page");
    return;
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Main content
        </Typography>
      </Box>
    </Container>
  );
}
