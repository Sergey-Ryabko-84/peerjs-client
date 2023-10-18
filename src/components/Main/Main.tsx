import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { socket } from "../../socket";

export const Main = () => {
  const navigate = useNavigate();
  const roomRef = useRef<HTMLInputElement | null>(null);
  const userRef = useRef<HTMLInputElement | null>(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    socket.on("FE-error-user-exist", ({ error }: { error: boolean }) => {
      if (!error) {
        const roomName = roomRef.current?.value;
        const userName = userRef.current?.value;

        if (roomName && userName) {
          sessionStorage.setItem("user", userName);
          navigate(`/room/${roomName}`);
        } else {
          setErrMsg("Enter Room Name or User Name");
        }
      } else {
        setErrMsg("User name already exists");
      }
    });
  }, [navigate]);

  const clickJoin = () => {
    const roomName = roomRef.current?.value;
    const userName = userRef.current?.value;

    if (!roomName || !userName) {
      setErrMsg("Enter Room Name or User Name");
    } else {
      socket.emit("BE-check-user", { roomId: roomName, userName });
    }
  };

  return (
    <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box
        sx={{
          width: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}>
        <TextField label="Room Name" type="text" id="roomName" inputRef={roomRef} fullWidth />
        <TextField label="User Name" type="text" id="userName" inputRef={userRef} fullWidth />

        <Button variant="contained" fullWidth onClick={clickJoin} sx={{ height: 56, fontSize: 18 }}>
          Join
        </Button>
        {errMsg ? <div>{errMsg}</div> : null}
      </Box>
    </Box>
  );
};
