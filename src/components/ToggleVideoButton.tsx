import { IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

export const ToggleVideoButton: React.FC<{ onClick: () => void; isCameraOn?: boolean }> = ({
  onClick,
  isCameraOn,
}) => {
  return (
    <IconButton size="large" onClick={onClick}>
      {isCameraOn ? <VideocamIcon fontSize="large" /> : <VideocamOffIcon fontSize="large" />}
    </IconButton>
  );
};
