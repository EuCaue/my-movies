"use client";
import ModeSwitch from "@/components/mode-switch";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  AccountCircleRounded,
  MenuRounded,
  Home,
  Movie,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import { Link, Stack, ListItemIcon, Typography } from "@mui/material";

type Page = {
  href: string;
  displayName: string;
  icon: React.ReactNode;
};

const PAGES: Array<Page> = [
  {
    href: "landing-page",
    displayName: "Home",
    icon: <Home fontSize="small" />,
  },
  { href: "/", displayName: "Movies", icon: <Movie fontSize="small" /> },
];

export default function Header() {
  const { data: session } = useSession();
  const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const isLoggedIn = !!session;

  function handleUserMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setUserAnchorEl(event.currentTarget);
  }

  function handleMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setMenuAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setMenuAnchorEl(null);
  }

  function handleUserMenuClose() {
    setUserAnchorEl(null);
  }

  function onLogout() {
    signOut({ redirectTo: "/landing-page" });
    handleUserMenuClose();
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          onClick={handleMenuOpen}
        >
          <MenuRounded />
        </IconButton>
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
            <IconButton color="inherit" onClick={handleUserMenuOpen}>
              <AccountCircleRounded />
            </IconButton>
          ) : null}
        </Stack>
        <Menu
          anchorEl={userAnchorEl}
          open={Boolean(userAnchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem>
            <ListItemIcon>
              <AccountCircleRounded fontSize="small" />
            </ListItemIcon>
            <Link
              href="/user/"
              variant="button"
              underline="none"
              color="textPrimary"
            >
              Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          {PAGES.map(({ href, displayName, icon }) => {
            return (
              <MenuItem key={href} onClick={handleMenuClose}>
                <ListItemIcon>{icon}</ListItemIcon>
                <Typography variant="body1" color="textPrimary">
                  <Link href={href} underline="none" color="textPrimary">
                    {displayName}
                  </Link>
                </Typography>
              </MenuItem>
            );
          })}
          {session ? (
            <MenuItem>
              <ListItemIcon>
                <AccountCircleRounded fontSize="small" />
              </ListItemIcon>
              <Link
                href={"/user"}
                underline="none"
                variant="button"
                color="textPrimary"
              >
                User Profile
              </Link>
            </MenuItem>
          ) : (
            <>
              <MenuItem>
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                <Link
                  href={"/signin"}
                  underline="none"
                  variant="button"
                  color="textPrimary"
                >
                  Sign In
                </Link>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                <Link
                  href={"/signup"}
                  underline="none"
                  variant="button"
                  color="textPrimary"
                >
                  Sign Up
                </Link>
              </MenuItem>
            </>
          )}
          <MenuItem>
            <ListItemIcon>
              <ModeSwitch />
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
