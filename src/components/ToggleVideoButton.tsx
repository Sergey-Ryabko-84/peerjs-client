import { IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

export const ToggleVideoButton: React.FC<{ onClick: () => void; isVideoOn: boolean }> = ({
  onClick,
  isVideoOn,
}) => {
  return (
    <IconButton size="large" onClick={onClick}>
      {isVideoOn ? <VideocamIcon fontSize="large" /> : <VideocamOffIcon fontSize="large" />}
    </IconButton>
  );
};
