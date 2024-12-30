"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { DarkMode, LightMode, Monitor } from "@mui/icons-material";

type ColorSchemes = "system" | "light" | "dark";
function CurrentColorSchemeIcon({
  colorscheme,
}: {
  colorscheme: ColorSchemes;
}) {
  if (colorscheme === "system") return <Monitor />;
  return colorscheme === "light" ? <LightMode /> : <DarkMode />;
}

export default function ModeSwitch() {
  const colorSchemes: Array<ColorSchemes> = ["system", "light", "dark"];
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const changeColorScheme = (colorScheme: ColorSchemes) => {
    const currentColorSchemeIndex = colorSchemes.indexOf(colorScheme);
    setMode(colorSchemes[currentColorSchemeIndex + 1] ?? "system");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mt: 1,
        p: 1,
      }}
    >
      <IconButton onClick={() => changeColorScheme(mode)} color="inherit">
        <CurrentColorSchemeIcon colorscheme={mode} />
      </IconButton>
      {/* <FormControl> */}
      {/*   <InputLabel id="mode-select-label">Theme</InputLabel> */}
      {/**/}
      {/*   <Select */}
      {/*     labelId="mode-select-label" */}
      {/*     id="mode-select" */}
      {/*     value={mode} */}
      {/*     onChange={(event) => setMode(event.target.value as typeof mode)} */}
      {/*     label="Theme" */}
      {/*   > */}
      {/*     <MenuItem value="system">System</MenuItem> */}
      {/*     <MenuItem value="light">Light</MenuItem> */}
      {/*     <MenuItem value="dark">Dark</MenuItem> */}
      {/*   </Select> */}
      {/* </FormControl> */}
    </Box>
  );
}
