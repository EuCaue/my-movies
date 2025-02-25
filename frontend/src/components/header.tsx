"use client";
import ModeSwitch from "@/components/mode-switch";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AccountCircleRounded,
  MenuRounded,
  Home,
  Movie,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import {
  Link,
  Stack,
  ListItemIcon,
  Typography,
  ButtonBaseProps,
} from "@mui/material";

function HeaderItem({
  keyID,
  href,
  displayName,
  icon,
  menuItemProps,
}: {
  keyID: string;
  href?: string;
  displayName: string;
  icon: React.ReactNode;
  menuItemProps?: MenuItemProps & ButtonBaseProps;
}) {
  return (
    <MenuItem key={keyID} component={Link} href={href} {...menuItemProps}>
      <ListItemIcon>{icon}</ListItemIcon>
      <Typography variant="body1" color="textPrimary">
        {displayName}
      </Typography>
    </MenuItem>
  );
}

function AuthHeaderItems({ isAuth }: { isAuth: boolean }) {
  return isAuth
    ? [
        <HeaderItem
          key="movies"
          keyID="movies"
          href="/"
          displayName="Movies"
          icon={<Movie fontSize="small" />}
        />,
        <HeaderItem
          key="user-profile"
          keyID="user-profile"
          href="/user"
          displayName="User Profile"
          icon={<AccountCircleRounded fontSize="small" />}
        />,
        <HeaderItem
          key="logout"
          keyID="logout"
          displayName="Logout"
          icon={<LogoutIcon fontSize="small" />}
          menuItemProps={{
            onClick: () => {
              signOut({ redirectTo: "/landing-page" });
            },
          }}
        />,
      ]
    : [
        <HeaderItem
          key="signin"
          keyID="signin"
          href="/signin"
          displayName="Sign In"
          icon={<Login fontSize="small" />}
        />,
        <HeaderItem
          key="signup"
          keyID="signup"
          href="/signup"
          displayName="Sign Up"
          icon={<PersonAdd fontSize="small" />}
        />,
      ];
}

export default function Header() {
  const { data: session } = useSession();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  function handleMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setMenuAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setMenuAnchorEl(null);
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
          <ModeSwitch />
        </Stack>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <HeaderItem
            href="landing-page/"
            key="landing-page"
            keyID="landing-page"
            displayName="Home"
            icon={<Home fontSize="small" />}
          />
          <AuthHeaderItems isAuth={!!session} />
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
