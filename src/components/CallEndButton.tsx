import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";

export const CallEndButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      size="large"
      onClick={() => {
        navigate("/");
        window.location.reload();
      }}>
      <CallEndIcon fontSize="large" />
    </IconButton>
  );
};
