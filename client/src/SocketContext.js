import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { Link, useNavigate } from "react-router-dom";
import { PercentSharp } from "@mui/icons-material";

const SocketContext = createContext();

const socket = io("https://kadarla-video-call.herokuapp.com/");
// const socket = io("http://localhost:8000");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [peers, setPeers] = useState([]);
  const [pendingRequest, setPendingRequests] = useState([]);

  const peersRef = useRef([]);
  const myVideo = useRef();
  const userVideo = useRef();
  const navigate = useNavigate();

  const startCall = () => {
    socket.emit("create_room", name);
    // if (me !== "") navigate(`/${me}`, { state: { isAdmin: true } });
  };

  const getCurrentStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
  };

  useEffect(() => {
    socket.on("room_created", (roomId) => {
      navigate(`/${roomId}`, { state: { isAdmin: true } });
    });
    socket.on("user_left", ({ peerID }) => {
      const item = peersRef.current.find((p) => p.peerID === peerID);
      item.peer.destroy();

      setPeers((peers) => {
        return peers.filter((p) => p !== item.peer);
      });
    });
  }, []);

  async function socketFunctions() {
    const _stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // setStream(_stream);
    socket.on("join_room_request", ({ roomId, userDetails }) => {
      setCall({ ...userDetails, roomId });

      setPendingRequests([...pendingRequest, userDetails]);
    });
    socket.on("receiving_signal", ({ signal, from, name }) => {
      // navigator.mediaDevices
      //   .getUserMedia({ video: true, audio: true })
      //   .then((currentStream) => {
      //     myVideo.current.srcObject = currentStream;
      //     setStream(currentStream);
      const peer = addPeer(signal, from, _stream);
      peersRef.current.push({
        peer,
        peerID: from,
        name: name,
        micOff: false,
        camOff: false,
      });
      setPeers((prevPeers) => [...prevPeers, peer]);
      // });
    });
    socket.on("receiving_returned_signal", ({ signal, id }) => {
      const item = peersRef.current.find((p) => p.peerID === id);
      item.peer.signal(signal);
    });
    socket.on("request_accepted", ({ roomId, userDetails, users }) => {
      const peers = [];
      users.forEach((user) => {
        const peer = createPeer(user.id, _stream);
        peersRef.current.push({
          peerID: user.id,
          name: user.name,
          peer,
        });
        peers.push(peer);
      });
      setPeers(peers);
    });

    socket.on("disconnect", () => {
      peers.forEach((peer) => peer.destroy());
      _stream.getTracks().forEach((track) => track.stop());
      navigate("/");
    });

    return _stream;
  }
  const answerCall = (item) => {
    socket.emit("join_room_accept", {
      roomId: item.roomId,
      userDetails: {
        name: item.name,
        socketId: item.socketId,
      },
    });
  };

  // calles when a user tries to join the call
  const callUser = async (id) => {
    socket.emit("send_room_request_admins", {
      roomId: id,
      userDetails: {
        name,
        socketId: socket.id,
      },
    });
    navigate(`/${id}`, { state: { isAdmin: false } });
    return;
  };

  function createPeer(userToStream, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("sending_signal", {
        to: userToStream,
        signal: data,
        from: socket.id,
        name: name,
      });
    });

    return peer;
  }

  function addPeer(signal, from, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("returning_signal", {
        to: from,
        signal: data,
        from: socket.id,
      });
    });

    peer.signal(signal);

    return peer;
  }

  function muteAudio() {
    peers.forEach((peer) => {
      peer.write("mute_audio");
    });
  }

  const leaveCall = (roomId) => {
    socket.emit("leave_room", roomId);

    socket.disconnect();
  };

  return (
    <SocketContext.Provider
      value={{
        call,

        myVideo,
        userVideo,
        stream,
        name,
        setName,
        me,
        peers,
        peersRef,
        pendingRequest,
        muteAudio,
        setPeers,
        callUser,
        leaveCall,
        answerCall,
        startCall,
        getCurrentStream,
        socketFunctions,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
