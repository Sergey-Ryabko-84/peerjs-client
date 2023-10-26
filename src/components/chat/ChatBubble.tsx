import { useContext } from "react";
import { Box } from "@mui/material";
import { RoomContext, UserContext } from "../../context";
import { IMessage } from "../../types/chat";

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
  const { peers } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  const author = message.author && (peers[message.author].userName || "unidentified");
  const userName = author || "Anonimus";
  const isSelf = message.author === userId;
  const time = new Date(message.timestamp).toLocaleTimeString();
  return (
    <Box sx={{ display: "flex", justifyContent: isSelf ? "flex-end" : "flex-start" }}>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ bgcolor: isSelf ? "#e1f5fe" : "#b3e5fc", borderRadius: 1, px: 2, py: 1 }}>
          {message.content}
          <Box sx={{ fontSize: 12, color: "#757575", textAlign: isSelf ? "right" : "left", mt: 1 }}>
            {time}
          </Box>
        </Box>
        <Box sx={{ fontSize: 14, color: "#424242", textAlign: isSelf ? "right" : "left", mt: 0.5 }}>
          {isSelf ? "You" : userName}
        </Box>
      </Box>
    </Box>
  );
};
