import { useContext } from "react";
import { Box } from "@mui/material";
import { ChatContext } from "../../context";
import { IMessage } from "../../types/chat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat: React.FC = () => {
  const { chat } = useContext(ChatContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        bgcolor: "#fff",
      }}
      data-testid="chat">
      <div>
        {chat.messages.map((message: IMessage) => (
          <ChatBubble
            message={message}
            key={message.timestamp + (message?.author || "anonymous")}
          />
        ))}
      </div>
      <ChatInput />
    </Box>
  );
};
