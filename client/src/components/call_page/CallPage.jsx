import Grid from "@mui/material/Grid";
import React, { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "../../SocketContext";
import CallPageFooter from "./components/call_page_footer/CallPageFooter";
import CallPageHeader from "./components/call_page_header/CallPageHeader";
import MeetInfo from "./components/meet_info/MeetInfo";

import { useLocation } from "react-router-dom";
import "./CallPage.scss";
import AdmitUser from "./components/admit_user/AdmitUser";
import { Typography } from "@mui/material";

const CallPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMyVideoHidden, setIsMyVideoHidden] = useState(false);
  const {
    name,

    myVideo,
    peers,
    setPeers,
    peersRef,
    callAccepted,
    callEnded,
    me,
    leaveCall,
    getCurrentStream,
    userVideo,
    socketFunctions,
  } = useContext(SocketContext);
  const location = useLocation();
  const myVideoCaller = useRef();
  const myStream = useRef();

  useEffect(() => {
    setIsAdmin(location.state.isAdmin);

    socketFunctions()
      .then((result) => {
        myStream.current.srcObject = result;
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="callpage-container">
      {
        <video
          playsInline
          muted
          ref={myStream}
          autoPlay
          className={
            peers.length > 0
              ? "video-container-call-started"
              : "video-container"
          }
        />
      }
      {peers.length > 0 && <VideoGrid peers={peers} />}
      <CallPageFooter
        link={window.location.pathname.split("/")[1]}
        disconnectCall={leaveCall}
        st={myStream}
        isAdmin={isAdmin}
        isMyVideoHidden={isMyVideoHidden}
      />

      {isAdmin && <AdmitUser />}
    </div>
  );
};

function VideoGrid({ peers }) {
  const [gridSpacing, setGridSpacing] = useState(12);
  const { peersRef } = useContext(SocketContext);

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / peers.length), 6));
  }, [peers.length]);
  return (
    <Grid
      container
      spacing={2}
      style={{
        // backgroundColor: "red",
        maxHeight: "calc(100vh - 90px)",
        justify: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      {peers.map((peer, index) => {
        return (
          <Grid
            item
            key={peersRef.current.find((p) => p.peer === peer).peerID}
            xs={peers.length <= 2 ? 12 : 6}
            sm={peers.length <= 4 ? gridSpacing : 4}
            className="phone2"
            style={{
              position: "relative",
              // backgroundColor: "green",
              // marginLeft: "15px",
              width: `100%`,
              height: `${
                peers.length <= 2
                  ? "100%"
                  : `calc( ${100 / Math.min(peers.length, 2)}vh - 90px)`
              }`,
              maxHeight: "calc(100vh-90px)",
              padding: "2px",
            }}
          >
            <VideoEle peer={peer} number={peers.length}></VideoEle>
            <Typography
              variant="subtitle1"
              style={{
                color: "white",
                backgroundColor: "#2C394B",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
                // zIndex: "1",
                padding: "7px",
                position: "absolute",
                top: "0px",
              }}
            >
              {peersRef.current.find((p) => p.peer === peer).name}
            </Typography>
          </Grid>
        );
      })}
    </Grid>
  );
}

const VideoEle = (props) => {
  const ref = useRef();
  useEffect(() => {
    props.peer.on("track", (track, stream) => {
      ref.current.srcObject = stream;
    });
    props.peer.on("date", (date) => {
      console.log("date", date);
    });
  }, []);
  return (
    <video
      playsInline
      ref={ref}
      autoPlay
      style={{
        transform: `scaleX(-1)`,
        width: `100%`,
        height: "100%",
        // height: `${
        //   props.number <= 2
        //     ? "86vh"
        //     : `calc( ${100 / Math.min(props.number, 2)}vh - 90px)`
        // }`,
        // maxHeight: "calc(100vh-90px)",
        borderRadius: "20px",
        objectFit: "cover",
      }}
    />
  );
};

export default CallPage;
