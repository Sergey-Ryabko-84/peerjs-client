import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { CallEndButton, ChatButton, ShareScreenButton, VideoPlayer } from "../components";
import { Chat } from "../components/chat";
import { PeerState } from "../reducers";
import { NameInput } from "../common";
import { ChatContext, RoomContext, UserContext } from "../context";
import { ws } from "../ws";

export const Room = () => {
  const { id } = useParams();
  const { stream, screenStream, peers, shareScreen, screenSharingId, setRoomId } =
    useContext(RoomContext);
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
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "90vh", gap: 2 }}>
      <Box sx={{ bgcolor: "#0277bd", color: "#fff", p: 2 }}>Room id: {id}</Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {screenSharingVideo && (
          <Box className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </Box>
        )}
        <Grid container spacing={2}>
          {screenSharingId !== userId && (
            <Grid item xs={6}>
              <VideoPlayer stream={stream} muted />
              <NameInput />
            </Grid>
          )}
          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer, index) => (
              <Grid item xs={6} key={index}>
                <VideoPlayer stream={peer.stream} />
                <div>{peer.userName}</div>
              </Grid>
            ))}
        </Grid>
        {chat.isChatOpen && (
          <div className="border-l-2 pb-28">
            <Chat />
          </div>
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
        }}
        className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
        <CallEndButton />
      </Box>
    </Box>
  );
};
