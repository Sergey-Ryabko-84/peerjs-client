import { useEffect, useRef } from "react";
import { Box, CardMedia } from "@mui/material";

export const VideoPlayer: React.FC<{
  stream?: MediaStream;
  muted?: boolean;
  userName?: string;
}> = ({ stream, muted = false, userName = "" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <Box sx={{ position: "relative", width: "100%", paddingTop: "75%" }}>
      <Box sx={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}>
        <CardMedia
          component="video"
          ref={videoRef}
          autoPlay
          muted={muted}
          sx={{ height: "100%" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            p: 2,
            color: "#212121",
          }}>
          {userName}
        </Box>
      </Box>
    </Box>
  );
};
