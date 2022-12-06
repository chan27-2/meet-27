import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../SocketContext";
import { useLocation } from "react-router-dom";
import NoMatch from "../no_match/NoMatch";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const CallJoinPage = () => {
  const { name, callUser, getCurrentStream, myVideo } =
    useContext(SocketContext);
  const [askedToJoin, setAskedToJoin] = useState(false);

  const location = useLocation();
  useEffect(() => {
    if (
      location.state === null ||
      location.state.id === null ||
      location.state.id === undefined ||
      location.state.id === ""
    ) {
    } else {
      // getCurrentStream();
    }
  }, []);

  if (
    location.state === null ||
    location.state.id === null ||
    location.state.id === undefined ||
    location.state.id === ""
  ) {
    return <NoMatch></NoMatch>;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#fff",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Grid
        container
        spacing={2}
        style={{
          justifyContent: "space-evenly",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xl={6}>
          <Typography
            style={{
              marginBottom: "10px",
              marginTop: "20px",
              fontFamily: "montserrat",
              fontSize: "30px",
              color: "#232924",
            }}
          >
            {name || ""}
          </Typography>
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{
              borderRadius: "18px",
              transform: "scaleX(-1)",
              zIndex: "0",
              aspectRatio: "16/9",
            }}
          />
        </Grid>

        <Grid
          item
          xl={6}
          style={{
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <div>
            <Typography component="h1" variant="h4">
              Lobby
            </Typography>

            <Typography
              style={{
                marginBottom: "10px",
                marginTop: "20px",
                fontFamily: "montserrat",
                fontSize: "20px",
                color: "#232924",
              }}
            >
              Click the button below to join the meet.
            </Typography>
            {askedToJoin && (
              <Typography
                component="h5"
                style={{
                  color: "green",
                  marginBottom: "10px",

                  fontFamily: "montserrat",
                  fontSize: "14px",
                }}
              >
                please wait until meet admin let's you in
              </Typography>
            )}
            <Button
              disabled={askedToJoin}
              variant="contained"
              color="secondary"
              onClick={() => {
                setAskedToJoin(true);
                callUser(location.state.id);
              }}
            >
              {askedToJoin ? "joining..." : "join meet"}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default CallJoinPage;
