import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, colors } from "@mui/material";
import { NameInput } from "../common";
import { Button } from "./common";
import { ws } from "../ws";

export const Join: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const navigate = useNavigate();

  const createRoom = () => {
    ws.emit("create-room");
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/room/${roomId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        width: 380,
        mx: "auto",
        mt: "35vh",
      }}>
      <NameInput />
      <Button onClick={createRoom}>Start new meeting</Button>
      <Typography color={colors.grey[500]}>or</Typography>
      <form
        style={{ width: "100%", display: "flex", columnGap: "10px", alignItems: "center" }}
        onSubmit={(e) => joinRoom(e)}>
        <TextField
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="room ID"
          size="small"
          sx={{ width: 1000 }}
        />
        <Button>Join</Button>
      </form>
    </Box>
  );
};
