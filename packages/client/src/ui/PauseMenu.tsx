import { Box, Button, Paper, Stack } from "@mui/material";

type Props = {
  onResumeClick: () => void;
  onOptionsClick: () => void;
  onToggleInspectorClick: () => void;
};

export function PauseMenu({
  onResumeClick,
  onOptionsClick,
  onToggleInspectorClick,
}: Props) {
  return (
    <Box
      display={"flex"}
      width={"100%"}
      height={"100%"}
      justifyContent="center"
      alignItems="center"
    >
      <Paper sx={{ pointerEvents: "auto" }}>
        <Stack gap={2} padding={2}>
          <Button variant="contained" onClick={onResumeClick}>
            Resume
          </Button>
          <Button variant="contained" onClick={onOptionsClick}>
            Options
          </Button>
          <Button variant="contained" onClick={onToggleInspectorClick}>
            Toggle Inspector
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
