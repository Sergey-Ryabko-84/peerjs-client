import React, { useEffect, useRef } from "react";
import { ExtendedPeer } from "../Room";

interface VideoCardProps {
  peer: ExtendedPeer;
  number?: number;
}

export const VideoCard: React.FC<VideoCardProps> = ({ peer }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Встановлюємо потік з піра в відеоелемент
    peer.on("call", (call) => {
      call.on("stream", (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
      });
    });

    // Можливо, вам також потрібно обробляти 'track' події, якщо ви плануєте використовувати окремі аудіо та відео треки.

    return () => {
      // Для уникнення витоку ресурсів при знищенні компонента зупиняємо відтворення потоку та чистимо відеоелемент
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, [peer]);

  return <video ref={videoRef} playsInline autoPlay />;
};
