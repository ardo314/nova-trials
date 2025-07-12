import { Box } from "@mui/material";

export function HUD() {
  return (
    <Box
      display={"flex"}
      width={"100%"}
      height={"100%"}
      justifyContent="center"
      alignItems="center"
    >
      <Box width={10} height={10} borderRadius="50%" bgcolor="white" />
    </Box>
  );
}
