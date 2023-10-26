import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream; muted?: boolean }> = ({
  stream,
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <Box sx={{ position: "relative", width: "100%", paddingTop: "75%" }}>
      <Box sx={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}>
        <video
          data-testid="peer-video"
          style={{ width: "100%" }}
          ref={videoRef}
          autoPlay
          muted={muted}
        />
      </Box>
    </Box>
  );
};
