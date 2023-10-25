import { IconButton } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";

export const ShareScreenButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <IconButton size="large" onClick={onClick}>
      <PresentToAllIcon fontSize="large" />
    </IconButton>
  );
};
