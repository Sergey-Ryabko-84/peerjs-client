import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

export const ToggleMutedButton: React.FC<{ onClick: () => void; isMuted: boolean }> = ({
  onClick,
  isMuted,
}) => {
  return (
    <IconButton size="large" onClick={onClick}>
      {isMuted ? <MicOffIcon fontSize="large" /> : <MicIcon fontSize="large" />}
    </IconButton>
  );
};
