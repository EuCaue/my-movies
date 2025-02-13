"use client";
import React from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Link,
  Box,
  BoxProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Reusable Hero component
type HeroProps = BoxProps & {
  children: React.ReactNode;
};

function Hero({ children, sx, ...props }: HeroProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <CallToActionSection />
      <FooterSection />
    </main>
  );
}

function HeroSection() {
  const theme = useTheme();
  return (
    <Hero component="section" sx={{}}>
      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          bgcolor:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.9)"
              : "rgba(0,0,0,0.8)",
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h2" gutterBottom color="primary" fontWeight="bold">
          Manage Your Movie Collection 🎬
        </Typography>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Rate your movies, track your progress, and organize your favorites
          effortlessly.
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
          <Link href="/signup" underline="none">
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                textTransform: "none",
                transition: "all 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/signin" underline="none">
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                textTransform: "none",
                transition: "all 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              Sign In
            </Button>
          </Link>
        </Stack>
      </Container>
    </Hero>
  );
}

function FeaturesSection() {
  const theme = useTheme();
  return (
    <Hero
      component="section"
      sx={{
        py: 8,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Key Features
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="center"
          mt={4}
        >
          <FeatureCard
            title="Rate Your Movies"
            description="Assign star ratings to your movies and express your opinions clearly."
          />
          <FeatureCard
            title="Track Your Movie Journey"
            description="Keep an organized record of what you've watched, what you're watching, and what's next on your list."
          />
          <FeatureCard
            title="Personalize Your Collection"
            description="Add detailed information like release dates, descriptions, and favorite tags for seamless organization."
          />
        </Stack>
      </Container>
    </Hero>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        textAlign: "center",
        flex: 1,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}

function AboutSection() {
  return (
    <Hero component="section" sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          About the Platform
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          mt={2}
        >
          This platform helps you manage your movie collection effortlessly.
          Whether it's rating, tracking, or organizing, we've got you covered.
        </Typography>
      </Container>
    </Hero>
  );
}

function CallToActionSection() {
  const theme = useTheme();
  return (
    <Hero
      component="section"
      sx={{
        py: 8,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#e0f7fa"
            : theme.palette.primary.dark,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          color={
            theme.palette.mode === "light" ? "text.primary" : "common.white"
          }
        >
          Start Building Your Collection Today
        </Typography>
        <Typography
          variant="body1"
          mb={4}
          color={theme.palette.mode === "light" ? "text.secondary" : "grey.300"}
        >
          Join now to track, rate, and organize your favorite movies with ease.
        </Typography>
        <Link href="/signup" underline="none">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              textTransform: "none",
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Get Started
          </Button>
        </Link>
      </Container>
    </Hero>
  );
}

function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{ py: 4, backgroundColor: "#333", color: "white" }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Movie Collection. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
