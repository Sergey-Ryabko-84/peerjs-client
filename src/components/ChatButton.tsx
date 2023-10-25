import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

export const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <IconButton size="large" onClick={onClick}>
      <ChatIcon fontSize="large" />
    </IconButton>
  );
};
