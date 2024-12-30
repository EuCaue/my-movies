"use client";
import ModeSwitch from "@/components/mode-switch";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AccountCircleRounded } from "@mui/icons-material";
import { Link, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event: unknown) {
    // @ts-expect-error no no
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function onLogout() {
    console.log("logged out");
    router.push("/signin");
    handleMenuClose();
  }

  const onLogin = () => {
    console.log("login");
  };

  const isLoggedIn = true;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link
          href="/"
          underline="none"
          variant="h6"
          sx={{ flexGrow: 1, color: "inherit" }}
        >
          My Movies
        </Link>
        <Stack direction={"row"} spacing={1}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircleRounded />
          </IconButton>
          <ModeSwitch />
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
