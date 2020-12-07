import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ScopeEditor from "./components/editor/ScopeEditor";
import AccessProvider from "./components/editor/AccessProvider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ThemeProvider } from "@material-ui/styles";
import style from "./assets/styleHook.js";
import dtlTheme from "./assets/theme.js";
import { withStyles } from "@material-ui/styles";
import "./components/editor/editor.css";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      <Box>{children}</Box>
    </Typography>
  );
}

function PsaAccessRightsManager(props) {
  const classes = props.classes;
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  // function getStructorgs(structInfos) {
  //     let structuresTree = {}
  //     let structOrgs = []
  //     let arrayStructOrg1ForIndex = []

  //     for (let i = 0; i < structInfos.length; i++) {
  //         if(structuresTree.hasOwnPropertuy)
  //         const currentOrg1 = structInfos[i].struct_org1
  //         const currentOrg2 = structInfos[i].struct_org2
  //         if (!arrayStructOrg1ForIndex.includes(currentOrg1)) {
  //             arrayStructOrg1ForIndex.push(currentOrg1)
  //             structOrgs.push({ "struct_org1": currentOrg1, "struct_org2": [] })
  //         } else {
  //             const selectedOrg = structOrgs.find(o => o.struct_org1 === currentOrg1)
  //             if (!selectedOrg.struct_org2.includes(currentOrg2)) {
  //                 selectedOrg.struct_org2.push(currentOrg2)
  //             }
  //         }
  //     }
  //     console.log(structOrgs)
  //     return structOrgs
  // }

  function getStructorgs(structInfos) {
    let structuresTree = {};
    structInfos.forEach((info) => {
      let { struct_org1, struct_org2 } = info;

      if (!structuresTree.hasOwnProperty(struct_org1)) {
        structuresTree[struct_org1] = [struct_org2];
      } else {
        if (!structuresTree[struct_org1].includes(struct_org2)) {
          structuresTree[struct_org1].push(struct_org2);
        }
      }
    });

    return structuresTree;
  }

  return (
    <ThemeProvider theme={dtlTheme}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="Psa access rigthts manager"
      >
        <Tab className={classes.tab} label="Dtl Scope editor" />
        <Tab className={classes.tab} label="Access Provider" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {props.dtlinfo && props.usersinfo && props.structinfos ? (
          <ScopeEditor
            cultureDigital={props.usersinfo}
            dtl={props.dtlinfo}
            // struct_org={getStructorgs(props.structinfos)}
            // new
            dtlUsers={props.dtlinfo}
            structures={getStructorgs(props.structinfos)}
          />
        ) : (
          <center style={{ fontSize: "18px" }}>
            Error when retrieving the data, try to reload the page and contact
            an administrator
          </center>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.accessInfo && props.usersinfo ? (
          <AccessProvider
            cultureDigital={props.usersinfo}
            columnNeeded={[
              "Uid",
              "last_name",
              "first_name",
              "email",
              "has_access",
            ]}
            accessUsers={props.accessInfo}
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
}
export default withStyles(style)(PsaAccessRightsManager);
