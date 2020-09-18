import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import ScopeEditor from "./containers/ScopeEditor";
import { ThemeProvider } from "@material-ui/styles";
import dtlTheme from "./assets/theme.js";

ReactDOM.render(
  <ThemeProvider theme={dtlTheme}>
    <div id="wrapper">
      {window.props.dtlinfo &&
      window.props.usersinfo &&
      window.props.structinfos ? (
        <ScopeEditor
          usersList={window.props.usersinfo}
          dtl={window.props.dtlinfo}
          struct_org={window.props.structinfos}
        />
      ) : (
        <center style={{ fontSize: "18px" }}>
          Error when retrieving the data, try to reload the page and contact an
          administrator
        </center>
      )}
    </div>
  </ThemeProvider>,
  document.getElementById("root")
);
