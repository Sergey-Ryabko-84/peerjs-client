import React, { createContext, useEffect, useState, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { ws } from "../ws";
import {
  peersReducer,
  PeerState,
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
} from "../reducers";

import { UserContext } from "./UserContext";
import { IPeer } from "../types/peer";
import iceServers from "../iceServers";

interface RoomValue {
  stream?: MediaStream;
  screenStream?: MediaStream;
  peers: PeerState;
  shareScreen: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  screenSharingId: string;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

interface Props {
  children: React.ReactNode;
}

export const RoomContext = createContext<RoomValue>({
  peers: {},
  shareScreen: () => {},
  setRoomId: (id) => {},
  screenSharingId: "",
  roomId: "",
  toggleVideo: () => {},
  toggleAudio: () => {},
  isVideoOn: true,
  isAudioOn: true,
});

if (!!window.Cypress) {
  window.Peer = Peer;
}

export const RoomProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [screenStream, setScreenStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);

  const enterRoom = ({ roomId }: { roomId: "string" }) => {
    navigate(`/room/${roomId}`);
  };
  const getUsers = ({ participants }: { participants: Record<string, IPeer> }) => {
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleAudio = () => setIsAudioOn(!isAudioOn);

  const switchStream = (stream: MediaStream) => {
    setScreenSharingId(me?.id || "");
    Object.values(me?.connections!).forEach((connection: any) => {
      const videoTrack: any = stream?.getTracks().find((track) => track.kind === "video");
      connection[0].peerConnection
        .getSenders()
        .find((sender: any) => sender.track.kind === "video")
        .replaceTrack(videoTrack)
        .catch((err: any) => console.error(err));
    });
  };

  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: isAudioOn }).then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        switchStream(stream);
        setScreenStream(stream);
      });
    }
  };

  const nameChangedHandler = ({ peerId, userName }: { peerId: string; userName: string }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    ws.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    const peer = new Peer(userId, {
      host: process.env.REACT_APP_PEER_SERVER_HOST,
      port: 443,
      path: "/",
      config: { iceServers: iceServers },
    });

    setMe(peer);

    try {
      navigator.mediaDevices.getUserMedia({ video: isVideoOn, audio: isAudioOn }).then((stream) => {
        setStream(stream);
      });
    } catch (error) {
      console.error(error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    ws.on("user-stopped-sharing", () => setScreenSharingId(""));
    ws.on("name-changed", nameChangedHandler);

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-sharing");
      ws.off("user-stopped-sharing");
      ws.off("user-joined");
      ws.off("name-changed");
      me?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoOn, isAudioOn]);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      ws.emit("stop-sharing");
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId, userName: name }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("user-joined");
    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        stream,
        screenStream,
        peers,
        shareScreen,
        roomId,
        setRoomId,
        screenSharingId,
        toggleVideo,
        toggleAudio,
        isVideoOn,
        isAudioOn,
      }}>
      {children}
    </RoomContext.Provider>
  );
};
