import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";
import {
  CallEndButton,
  ChatButton,
  ShareScreenButton,
  ToggleAudioButton,
  ToggleVideoButton,
  VideoPlayer,
} from "../components";
import { Chat } from "../components/chat";
import { PeerState } from "../reducers";
import { ChatContext, RoomContext, UserContext } from "../context";
import { ws } from "../ws";

export const Room = () => {
  const { id } = useParams();
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    handleCameraToggle,
    handleAudioToggle,
    isCameraOn,
    isAudioOn,
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);

  useEffect(() => {
    if (stream) ws.emit("join-room", { roomId: id, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;
  console.log("peersToShow:", peersToShow);

  useEffect(() => {
    setNumberOfParticipants(
      Object.values(peersToShow as PeerState).filter((peer) => !!peer.stream)?.length + 1
    );
  }, [peersToShow]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "90vh", gap: 2 }}>
      <Box
        sx={{
          bgcolor: "#0277bd",
          color: "#fff",
          p: 1,
          display: "flex",
          alignItems: "center  ",
          gap: 4,
        }}>
        Room id: {id}
        <Box>
          <Button
            onClick={() => navigator.clipboard.writeText(`${id}`)}
            sx={{ color: "#fff", fontWeight: 700 }}>
            Copy ID
          </Button>
        </Box>
        Number of participants: {numberOfParticipants}
      </Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {screenSharingVideo ? (
          <Box sx={{ width: "100%" }}>
            <VideoPlayer stream={screenSharingVideo} />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {screenSharingId !== userId && (
              <Grid
                item
                xs={numberOfParticipants < 3 ? 6 : numberOfParticipants < 9 ? 3 : 2}
                sx={{ position: "relative" }}>
                <VideoPlayer stream={stream} muted userName={userName} />
              </Grid>
            )}
            {Object.values(peersToShow as PeerState)
              .filter((peer) => !!peer.stream)
              .map((peer, index) => (
                <Grid
                  item
                  key={index}
                  xs={numberOfParticipants < 3 ? 6 : numberOfParticipants < 9 ? 3 : 2}>
                  <VideoPlayer stream={peer.stream} userName={peer.userName} />
                </Grid>
              ))}
          </Grid>
        )}
        {chat.isChatOpen && (
          <Box sx={{ maxWidth: "20vw", pl: 1, zIndex: 2 }}>
            <Chat />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
          bgcolor: "#fff",
          borderTop: "2px solid #ddd",
        }}>
        <ToggleVideoButton onClick={handleCameraToggle} isCameraOn={isCameraOn} />
        <ToggleAudioButton onClick={handleAudioToggle} isAudioOn={isAudioOn} />
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
        <CallEndButton />
      </Box>
    </Box>
  );
};
