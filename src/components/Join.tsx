import { NameInput } from "../common/Name";
import { Button } from "./common/Button";
import { ws } from "../ws";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className=" flex flex-col">
      <NameInput />
      <Button onClick={createRoom} className="py-2 px-8 text-xl">
        Start new meeting
      </Button>
      <form
        style={{ display: "flex", columnGap: "10px", alignItems: "center" }}
        onSubmit={(e) => joinRoom(e)}>
        <input
          onChange={(e) => setRoomId(e.target.value)}
          className="border rounded-md p-2 h-10 my-2 w-full"
          type="text"
        />
        <Button className="py-1 px-8 h-10 text-xl">Join</Button>
      </form>
    </div>
  );
};
