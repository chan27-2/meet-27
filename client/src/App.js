import React from "react";

import CallPage from "./components/call_page/CallPage";
import { Routes, Route } from "react-router-dom";
import Main from "./components/main_page/MainPage";
import CallJoinPage from "./components/call_join_page/CallJoinPage";

const App = () => {
  return (
    // <div>
    //   <h1>Bookkeeper</h1>
    //   <nav
    //     style={{
    //       borderBottom: "solid 1px",
    //       paddingBottom: "1rem",
    //     }}
    //   >
    //     <Link to="/invoices">Invoices</Link> |{" "}
    //     <Link to="/expenses">Expenses</Link>
    //   </nav>
    // </div>
    <Routes>
      <Route exact path="/join" element={<CallJoinPage />} />
      <Route exact path="/:id" element={<CallPage />} />
      <Route exact path="/" element={<Main />} />
      {/* <Route exact path="/=*" element={<NoPage />} /> */}
    </Routes>

    // <div className={classes.wrapper}>
    //   <AppBar className={classes.appBar} position="static" color="inherit">
    //     <Typography variant="h2" align="center">
    //       Kadarla Meet
    //     </Typography>
    //   </AppBar>

    //   <VideoPlayer />
    //   <Options>
    //     <Notifications />
    //   </Options>
    // </div>
  );
};

export default App;
