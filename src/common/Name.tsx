import { TextField } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context";

export const NameInput: React.FC = () => {
  const { userName, setUserName } = useContext(UserContext);
  return (
    <TextField
      label="Enter your name"
      onChange={(e) => setUserName(e.target.value)}
      value={userName}
      size="small"
      fullWidth
    />
  );
};
