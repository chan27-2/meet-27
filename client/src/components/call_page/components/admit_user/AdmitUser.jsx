import React, { useContext, useEffect, useState } from "react";
import "./AdmitUser.scss";

import { SocketContext } from "../../../../SocketContext";

const AdmitUser = () => {
  const { answerCall, call } = useContext(SocketContext);
  const [pendingRequest, setPendingRequest] = useState([]);
  useEffect(() => {
    if ("roomId" in call) {
      setPendingRequest((l) => [...l, call]);
    }
  }, [call]);
  return (
    <>
      {pendingRequest.length > 0 && (
        <div className="admit-block">
          <div className="meeting-header">
            <h3>Admit Request</h3>
            <h4
              className="icon"
              onClick={() => {
                setPendingRequest([]);
              }}
            >
              close
            </h4>
          </div>
          {/* <p className="info-text">
        You have been invited to join a meeting. Please click the button below
      </p> */}
          {pendingRequest.map((item) => {
            return (
              <div className="meet-link" key={item.socketId}>
                <span> {item.name}</span>
                <h4
                  className="icon"
                  onClick={() => {
                    setPendingRequest(
                      pendingRequest.filter((i) => i.socketId !== item.socketId)
                    );
                    answerCall(item);
                  }}
                >
                  ADMIT
                </h4>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdmitUser;
