import { signIn } from "next-auth/react";
import { Google } from "@mui/icons-material";
import { Stack, Divider, Button } from "@mui/material";

type AuthButtonProps = {
  isValid: boolean;
  text: string;
};

export default function AuthButton({ isValid, text }: AuthButtonProps) {
  return (
    <Stack spacing={2} divider={<Divider>OR</Divider>}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isValid}
      >
        {text}
      </Button>
      <Button
        type="button"
        color="primary"
        variant="contained"
        onClick={async () => {
          await signIn("google", {callbackUrl: "/"});
        }}
        sx={{
          alignSelf: "center",
          width: "fit-content",
        }}
      >
        <Google sx={{ fontSize: 32 }} />
      </Button>
    </Stack>
  );
}
