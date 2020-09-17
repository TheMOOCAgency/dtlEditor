import React from "react";
import ScopeEditor from "./components/editor/ScopeEditor";
import { ThemeProvider } from "@material-ui/styles";
import style from "./assets/styleHook.js";
import dtlTheme from "./assets/theme.js";
import { withStyles } from "@material-ui/styles";
import "./components/editor/editor.css";

function AccessRightsManager(props) {
  return (
    <ThemeProvider theme={dtlTheme}>
      {props.dtlinfo && props.usersinfo && props.structinfos ? (
        <ScopeEditor
          usersList={props.usersinfo}
          dtl={props.dtlinfo}
          struct_org={props.structinfos}
        />
      ) : (
        <center style={{ fontSize: "18px" }}>
          Error when retrieving the data, try to reload the page and contact an
          administrator
        </center>
      )}
    </ThemeProvider>
  );
}
export default withStyles(style)(AccessRightsManager);
