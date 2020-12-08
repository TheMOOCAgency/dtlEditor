import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import PsaAccessRightsManager from "./PsaAccessRightsManager";

ReactDOM.render(
  <div id="wrapper">
    <PsaAccessRightsManager
      usersinfo={window.props.usersinfo}
      dtlinfo={window.props.dtlinfo}
      structinfos={window.props.structinfos}
      accessInfo={window.props.invited_user_file.map((el) => el["Uid"])}
    />
  </div>,
  document.getElementById("root")
);
