import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

export const ToggleAudioButton: React.FC<{ onClick: () => void; isAudioOn: boolean }> = ({
  onClick,
  isAudioOn,
}) => {
  return (
    <IconButton size="large" onClick={onClick}>
      {isAudioOn ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
    </IconButton>
  );
};
