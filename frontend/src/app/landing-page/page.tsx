"use client";
import React from "react";
import { Container, Typography, Button, Stack, Link } from "@mui/material";

export default function LandingPage() {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to My Movies
        </Typography>
        <Typography variant="h6" gutterBottom>
          Manage your favorite movies simply and efficiently.
        </Typography>
        <Stack spacing={1} direction={"row"}>
          <Link color="primary" href="/signup">
            <Button variant="contained" color="primary" size="medium">
              Sign Up
            </Button>
          </Link>

          <Link color="primary" href="/signin">
            <Button variant="outlined" color="primary" size="medium">
              Sign In
            </Button>
          </Link>
        </Stack>
      </Container>
    </>
  );
}
