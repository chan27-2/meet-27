import React from "react";
import "./MeetInfo.scss";

const MeetInfo = () => {
  return (
    <div className="meeting-info-block">
      <div className="meeting-header">
        <h3>Meeting is Ready</h3>
        <h4 className="icon"> close</h4>
      </div>
      <p className="info-text">
        share this link with others you want to join the meet
      </p>
      <div className="meet-link">
        <span> url</span>
        <h4 className="icon"> copy</h4>
      </div>
    </div>
  );
};

export default MeetInfo;
