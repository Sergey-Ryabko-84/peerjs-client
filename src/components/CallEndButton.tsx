import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";

export const CallEndButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IconButton size="large" onClick={() => navigate("/")}>
      <CallEndIcon fontSize="large" />
    </IconButton>
  );
};
