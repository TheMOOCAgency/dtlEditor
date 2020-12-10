import React, { useState, useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ScopeEditor from "./components/scopes-editor/ScopeEditor";
import AccessProvider from "./components/access-provider/AccessProvider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ThemeProvider } from "@material-ui/styles";
import style from "./assets/styleHook.js";
import dtlTheme from "./assets/theme.js";
import { withStyles } from "@material-ui/styles";
import "./assets/editor.css";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}>
      <Box>{children}</Box>
    </Typography>
  );
}

const PsaAccessRightsManager = ({
  structinfos,
  dtlinfo,
  usersinfo,
  accessInfo,
  classes,
}) => {
  const [value, setValue] = useState(0);
  const [structures, setStructures] = useState({});
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const getOrgsTree = (structInfos) => {
    let structuresTree = {};
    structInfos.forEach((info) => {
      let { struct_org1, struct_org2 } = info;

      if (struct_org1 && !structuresTree.hasOwnProperty(struct_org1)) {
        if (struct_org2) {
          structuresTree[struct_org1] = ["", "all", struct_org2];
        } else {
          // PREVENT FROM ORG1 THAT DOESNT HAVE ANY CHILD
          structuresTree[struct_org1] = ["", "all"];
        }
      } else {
        if (struct_org2 && !structuresTree[struct_org1].includes(struct_org2)) {
          structuresTree[struct_org1].push(struct_org2);
        }
      }
    });

    structuresTree.all = ["all"];
    setStructures(structuresTree);
  };

  useEffect(() => {
    getOrgsTree(structinfos);
  }, [structinfos]);

  return (
    <ThemeProvider theme={dtlTheme}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={value}
        onChange={handleChange}>
        <Tab className={classes.tab} label="Dtl Scope editor" />
        <Tab className={classes.tab} label="Access Provider" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {dtlinfo && usersinfo && structinfos ? (
          <ScopeEditor
            usersList={usersinfo}
            dtlUsers={dtlinfo}
            structures={structures}
          />
        ) : (
          <center style={{ fontSize: "18px" }}>
            Error when retrieving the data, try to reload the page and contact
            an administrator
          </center>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {accessInfo && usersinfo ? (
          <AccessProvider
            cultureDigital={usersinfo}
            columnNeeded={[
              "Uid",
              "last_name",
              "first_name",
              "email",
              "has_access",
            ]}
            accessUsers={accessInfo}
          />
        ) : (
          <center style={{ fontSize: "18px" }}>
            Error when retrieving the data, try to reload the page and contact
            an administrator
          </center>
        )}
      </TabPanel>
    </ThemeProvider>
  );
};
export default withStyles(style)(PsaAccessRightsManager);
