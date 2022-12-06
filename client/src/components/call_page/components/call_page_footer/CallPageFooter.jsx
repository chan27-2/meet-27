import "./CallPageFooter.scss";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import React, { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "../../../../SocketContext";

//icons
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import { Typography } from "@mui/material";

const CallPageFooter = ({
  isPresenting,
  stopScreenShare,
  screenShare,
  isAudio,
  toggleAudio,
  disconnectCall,
  link,
  st,
  isAdmin,
  isMyVideoHidden,
}) => {
  const { stream, peers, leaveCall, muteAudio } = useContext(SocketContext);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  if (!isAdmin) {
    return (
      <Box className="footer-item" sx={{ "& > :not(style)": { m: 1 } }}>
        {peers.length > 0 && (
          <Fab
            variant="extended"
            onClick={() => {
              navigator.clipboard.writeText(link);
            }}
          >
            <ContentCopyRoundedIcon sx={{ mr: 1 }} />
            {link}
          </Fab>
        )}
        {peers.length > 0 && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              leaveCall(link);
            }}
            style={{ color: "white", backgroundColor: "#EC255A" }}
          >
            <CallEndRoundedIcon />
          </Fab>
        )}
        <Fab
          color="secondary"
          aria-label="edit"
          onClick={() => {
            st.current.srcObject.getTracks().forEach((track) => {
              if (track.kind === "video") {
                track.enabled = !track.enabled;
                setIsVideoEnabled(track.enabled);
              }
            });
          }}
          style={{
            color: "white",
            backgroundColor: isVideoEnabled ? "#292C6D" : "#4b4e80",
          }}
        >
          {isVideoEnabled ? (
            <VideocamRoundedIcon />
          ) : (
            <VideocamOffRoundedIcon />
          )}
        </Fab>
        <Fab
          color="secondary"
          aria-label="edit"
          onClick={() => {
            st.current.srcObject.getTracks().forEach((track) => {
              if (track.kind === "audio") {
                track.enabled = !track.enabled;
                setIsMicEnabled(track.enabled);
                if (peers.length > 0) {
                  muteAudio();
                }
              }
            });
          }}
          style={{
            color: "white",
            backgroundColor: isMicEnabled ? "#F0A500" : "#bf9436",
          }}
        >
          {isMicEnabled ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
        </Fab>
        {peers.length === 0 && (
          <Typography variant="h6" style={{ color: "white" }}>
            please wait until admin lets you in...
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box className="footer-item" sx={{ "& > :not(style)": { m: 1 } }}>
      {peers.length === 0 && (
        <Typography variant="h6" style={{ color: "white" }}>
          {"Share the code and invite your friends ->"}
        </Typography>
      )}
      <Fab
        variant="extended"
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
      >
        <ContentCopyRoundedIcon sx={{ mr: 1 }} />
        {link}
      </Fab>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          leaveCall(link);
        }}
        style={{ color: "white", backgroundColor: "#EC255A" }}
      >
        <CallEndRoundedIcon />
      </Fab>
      <Fab
        color="secondary"
        aria-label="edit"
        onClick={() => {
          st.current.srcObject.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.enabled = !track.enabled;
              setIsVideoEnabled(track.enabled);
            }
          });
        }}
        style={{
          color: "white",
          backgroundColor: isVideoEnabled ? "#292C6D" : "#4b4e80",
        }}
      >
        {isVideoEnabled ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
      </Fab>
      <Fab
        color="secondary"
        aria-label="edit"
        onClick={() => {
          st.current.srcObject.getTracks().forEach((track) => {
            if (track.kind === "audio") {
              track.enabled = !track.enabled;
              setIsMicEnabled(track.enabled);
              if (peers.length > 0) {
                muteAudio();
              }
            }
          });
        }}
        style={{
          color: "white",
          backgroundColor: isMicEnabled ? "#F0A500" : "#bf9436",
        }}
      >
        {isMicEnabled ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
      </Fab>
    </Box>
  );
};

export default CallPageFooter;
