import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";
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
      </Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {screenSharingVideo ? (
          <Box sx={{ width: "100%" }}>
            <VideoPlayer stream={screenSharingVideo} />
          </Box>
        ) : (
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
                <Grid item xs key={index}>
                  <VideoPlayer stream={peer.stream} />
                  <div>{peer.userName}</div>
                </Grid>
              ))}
          </Grid>
        )}
        {chat.isChatOpen && (
          <Box sx={{ maxWidth: "20vw", borderLeft: "1px solid #ddd", pl: 1 }}>
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
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
        <CallEndButton />
      </Box>
    </Box>
  );
};
