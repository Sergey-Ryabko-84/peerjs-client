import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Peer, { MediaConnection } from "peerjs";
import { socket } from "../../socket";
import { VideoCard, BottomBar, Chat } from "../../components";
import { Box } from "@mui/material";

export interface ExtendedPeer extends Peer {
  userName: string;
  peerID: string;
}

interface PeerInfo {
  peerID: string;
  peer: Peer;
  userName: string;
}

export const Room = () => {
  const currentUser = sessionStorage.getItem("user");
  const [peers, setPeers] = useState<ExtendedPeer[]>([]);
  const [mediaConnections, setMediaConnections] = useState<MediaConnection[]>([]);
  const [userVideoAudio, setUserVideoAudio] = useState<any>({
    localUser: { video: true, audio: true },
  });
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [displayChat, setDisplayChat] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [showVideoDevices, setShowVideoDevices] = useState(false);
  const peersRef = useRef<PeerInfo[]>([]);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const userStream = useRef<MediaStream | null>(null);

  const { roomId } = useParams();

  useEffect(() => {
    // Get Video Devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const filtered = devices.filter((device) => device.kind === "videoinput");
      setVideoDevices(filtered);
    });

    // Set Back Button Event
    window.addEventListener("popstate", goToBack);

    // Connect Camera & Mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      userStream.current = stream;

      socket.emit("BE-join-room", { roomId, userName: currentUser! });

      socket.on("FE-user-join", (users: any[]) => {
        const newPeers: ExtendedPeer[] = [];
        const newMediaConnections: MediaConnection[] = [];
        users.forEach(({ userId, info }) => {
          let { userName, video, audio } = info;

          if (userName !== currentUser) {
            const peer = createPeer(userId, socket.id, stream);

            if (peer) {
              peer.userName = userName;
              peer.peerID = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              newPeers.push(peer);
              // newMediaConnections.push(peer);
            }
          }
        });

        setPeers((users) => [...users, ...newPeers]);
        setMediaConnections((connections) => [...connections, ...newMediaConnections]);
      });

      socket.on("FE-receive-call", ({ signal, from, info }) => {
        let { userName, video, audio } = info;
        const peerIdx = findPeer(from);

        if (peerIdx) {
          const peer = addPeer(signal);

          if (peer) {
            peer.userName = userName;

            peersRef.current.push({
              peerID: from,
              peer: peer as Peer,
              userName: userName,
            });

            setPeers((users: any[]) => {
              return [...users, peer];
            });

            setUserVideoAudio((preList: any) => {
              return {
                ...preList,
                [userName]: { video, audio },
              };
            });
          }
        }
      });

      socket.on("FE-user-leave", ({ userId, userName }) => {
        const peerIdx = findPeer(userId);

        if (peerIdx && peerIdx.peer && typeof peerIdx.peer !== "string") {
          (peerIdx.peer as Peer).destroy();

          setPeers((users: any) => {
            return users.filter((user: any) => {
              if (
                typeof user === "object" &&
                user.peer &&
                user.peer.peer &&
                user.peer.peerID !== userId
              ) {
                return true;
              }
              return false;
            });
          });

          peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId);
        }
      });

      socket.on("FE-toggle-camera", ({ userId, switchTarget }) => {
        const peerIdx = findPeer(userId);

        setUserVideoAudio((preList: any) => {
          if (peerIdx) {
            let video = preList[peerIdx.userName].video;
            let audio = preList[peerIdx.userName].audio;

            if (switchTarget === "video") video = !video;
            else audio = !audio;

            return {
              ...preList,
              [peerIdx.userName]: { video, audio },
            };
          }
          return preList;
        });
      });

      return () => {
        socket.disconnect();
      };
    });
  }, []);

  function createPeer(userId: string, caller: string, stream: MediaStream) {
    const peer = new Peer() as ExtendedPeer; // Використовуємо тип ExtendedPeer

    // Додайте властивості userName і peerID
    peer.userName = "";
    peer.peerID = "";

    const dataConnection = peer.connect(userId);
    const mediaConnection = peer.call(userId, stream);

    mediaConnection.on("stream", (remoteStream) => {
      // Обробка отриманого відеопотоку remoteStream
    });

    // Ви можете використовувати dataConnection для обміну даними між користувачами

    return peer;
  }

  function addPeer(incomingSignal: any) {
    const peer = new Peer() as ExtendedPeer; // Використовуємо тип ExtendedPeer

    // Додайте властивості userName і peerID
    peer.userName = "";
    peer.peerID = "";

    return peer;
  }

  function findPeer(id: string) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer: ExtendedPeer, index: number, arr: ExtendedPeer[]) {
    const expandScreen = () => {
      // Реалізуйте логіку для розширення відео тут
    };

    return (
      <div
        className={`width-peer${arr.length > 8 ? "" : arr.length}`}
        onClick={expandScreen}
        key={index}>
        {writeUserName(peer.userName)}
        <i className="fas fa-expand" />
        <VideoCard key={index} peer={peer} number={arr.length} />
      </div>
    );
  }

  function writeUserName(userName: string | undefined, index?: number) {
    if (userName && userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <div key={userName}>{userName}</div>;
      }
    }
    return null;
  }

  // Open Chat
  const clickChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayChat(!displayChat);
  };

  // BackButton
  const goToBack = (e: PopStateEvent) => {
    e.preventDefault();
    socket.emit("BE-leave-room", { roomId, leaver: currentUser });
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const toggleCameraAudio = (e: React.MouseEvent) => {
    const target = e.currentTarget.getAttribute("data-switch");

    setUserVideoAudio((preList: any) => {
      let videoSwitch = preList["localUser"].video;
      let audioSwitch = preList["localUser"].audio;

      if (target === "video") {
        const userVideoTrack = userStream.current!.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack = userStream.current!.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current!.getAudioTracks()[0].enabled = audioSwitch;
        }

        socket.emit("BE-toggle-camera-audio", { roomId, switchTarget: target });
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });
  };

  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        const screenTrack = stream.getTracks()[0];

        peersRef.current.forEach(({ peer }) => {
          const mediaConnection = peer as any; // Отримуємо доступ до MediaConnection
          const peerConnection = mediaConnection.peerConnection;

          if (peerConnection) {
            const videoSender = peerConnection
              .getSenders()
              .find((s: RTCRtpSender) => s.track?.kind === "video");
            if (videoSender && videoSender.track) {
              videoSender.track.stop();
              videoSender.replaceTrack(screenTrack);
            }
          }
        });

        screenTrack.onended = () => {
          peersRef.current.forEach(({ peer }) => {
            const mediaConnection = peer as any;
            const peerConnection = mediaConnection.peerConnection;

            if (peerConnection) {
              const videoSender = peerConnection
                .getSenders()
                .find((s: RTCRtpSender) => s.track?.kind === "video");
              if (videoSender && videoSender.track) {
                videoSender.track.stop();
                videoSender.replaceTrack(screenTrack);
              }
            }
          });

          userVideoRef.current!.srcObject = userStream.current;
          setScreenShare(false);
        };

        userVideoRef.current!.srcObject = stream;
        screenTrackRef.current = screenTrack;
        setScreenShare(true);
      });
    } else {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        setScreenShare(false);
      }
    }
  };

  const expandScreen = (e: React.MouseEvent) => {
    const elem = e.target as HTMLElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const clickBackground = () => {
    if (!showVideoDevices) return;

    setShowVideoDevices(false);
  };

  // const clickCameraDevice = async (event: React.MouseEvent<HTMLElement>) => {
  //   const target = event.target as HTMLElement;

  //   if (target.dataset && target.dataset.value) {
  //     const deviceId = target.dataset.value;

  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId }, audio: true });

  //       const newStreamTrack = stream.getVideoTracks()[0];

  //       userStream.current!.getVideoTracks().forEach((track) => {
  //         track.stop();
  //         userStream.current!.removeTrack(track);
  //       });

  //       userStream.current!.addTrack(newStreamTrack);

  //       peersRef.current.forEach(({ peer }) => {
  //         const videoSender = peer.getSenders().find((s) => s.track?.kind === "video");

  //         if (videoSender) {
  //           videoSender.replaceTrack(newStreamTrack);
  //         }
  //       });

  //       userVideoRef.current!.srcObject = new MediaStream([newStreamTrack]);
  //     } catch (error) {
  //       console.error("Error accessing the camera:", error);
  //     }
  //   }
  // };

  return (
    <Box
      onClick={clickBackground}
      sx={{ width: "100%", maxHeight: "100vh", display: "flex", flexDirection: "row" }}>
      <Box sx={{ position: "relative", width: "100%", height: "100vh" }}>
        <Box
          sx={{
            maxWidth: "100%",
            height: "92%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            alignItems: "center",
            p: 2,
            boxSizing: "border-box",
            gap: 10,
          }}>
          {/* Current User Video */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            {userVideoAudio["localUser"].video ? null : writeUserName(currentUser || "")}
            <i className="fas fa-expand" />
            <video
              onClick={expandScreen}
              ref={userVideoRef}
              muted
              autoPlay
              playsInline
              style={{ top: 0, left: 0, width: "100%", height: "100%" }}
            />
          </Box>
          {/* Joined User Video */}
          {peers.map((peer, index) => createUserVideo(peer, index, peers))}
        </Box>
        <BottomBar
        // clickScreenSharing={clickScreenSharing}
        // clickChat={clickChat}
        // clickCameraDevice={clickCameraDevice}
        // goToBack={goToBack}
        // toggleCameraAudio={toggleCameraAudio}
        // userVideoAudio={userVideoAudio['localUser']}
        // screenShare={screenShare}
        // videoDevices={videoDevices}
        // showVideoDevices={showVideoDevices}
        // setShowVideoDevices={setShowVideoDevices}
        />
      </Box>
      <Chat
      // display={displayChat} roomId={roomId}
      />
    </Box>
  );
};
