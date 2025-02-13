"use client";
import ModeSwitch from "@/components/mode-switch";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AccountCircleRounded } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import { Link, Stack } from "@mui/material";

export default function Header() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isLoggedIn = !!session;

  function handleMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function onLogout() {
    signOut({ redirectTo: "/landing-page" });
    handleMenuClose();
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link
          href={session ? "/" : "/landing-page"}
          underline="none"
          variant="h6"
          sx={{ flexGrow: 1, color: "inherit" }}
        >
          My Movies
        </Link>
        <Stack direction={"row"} spacing={1}>
          {isLoggedIn ? (
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircleRounded />
            </IconButton>
          ) : null}
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
