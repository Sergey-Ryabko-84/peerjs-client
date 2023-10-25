import { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ChatContext, RoomContext, UserContext } from "../../context";

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);
  const { userId } = useContext(UserContext);
  const { roomId } = useContext(RoomContext);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message, roomId, userId);
          setMessage("");
        }}>
        <div className="flex ">
          <textarea
            className="border rounded"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <IconButton
            type="submit"
            className="bg-rose-400 p-4 mx-2 rounded-lg text-xl hover:bg-rose-600 text-white">
            <SendIcon />
          </IconButton>
        </div>
      </form>
    </div>
  );
};
