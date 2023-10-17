import { useEffect, useState } from "react";
import { socket } from "../../socket";

export const Main = () => {
  const [status, setStatus] = useState("No connection");

  useEffect(() => {
    socket.on("connect", () => {
      setStatus("Connected to the server!");
      console.log("Connected to the server!");
    });

    console.log("socket", socket);

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <div>
      <h1>MAIN PAGE</h1>
      <h2>{status}</h2>
    </div>
  );
};
