import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ScopeEditor from './components/editor/ScopeEditor'
import AccessProvider from './components/editor/AccessProvider'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ThemeProvider } from '@material-ui/styles';
import style from './assets/styleHook.js'
import dtlTheme from './assets/theme.js'
import { withStyles } from '@material-ui/styles';
import './components/editor/editor.css';

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
    const [value, setValue] = React.useState(1);
    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function getStructorgs(structinfos) {
        function arrangeIntoTree(paths) {
            var tree = [];
        
            for (var i = 0; i < paths.length; i++) {
                const path = paths[i];
                const pathArray = Object.keys(path)
                let currentLevel = tree;
                for (var j = 0; j < pathArray.length; j++) {
                    if (pathArray[j] === "struct_org1" || pathArray[j] === "struct_org2") {
                        var part = path[pathArray[j]];
            
                        var existingPath = findWhere(currentLevel, 'struct_org1', part);
            
                        if (existingPath) {
                            currentLevel = existingPath.struct_org2;
                        } else {
                            var newPart = {
                                struct_org1: part,
                                struct_org2: [],
                            }
            
                            currentLevel.push(newPart);
                            currentLevel = newPart.struct_org2;
                        }
                    }
                }
            }
            return tree;
        
            function findWhere(array, key, value) {
                let t = 0; // t is used as a counter
                while (t < array.length && array[t][key] !== value) { t++; }; // find the index where the id is the as the aValue
        
                if (t < array.length) {
                    return array[t]
                } else {
                    return false;
                }
            }
        }
        var tree = arrangeIntoTree(structinfos);
        return tree
    }

    return (
        <ThemeProvider theme={dtlTheme}>
            <Tabs
                indicatorColor='primary'
                textColor='primary'
                value={value}
                onChange={handleChange}
                aria-label="Psa access rigthts manager"
            >
                <Tab className={classes.tab} label="Dtl Scope editor" />
                <Tab className={classes.tab} label="Access Provider" />
            </Tabs>
            <TabPanel value={value} index={0}>
                {props.dtlinfo && props.usersinfo && props.structinfos  ?
                (<ScopeEditor
                    cultureDigital={props.usersinfo}
                    dtl={props.dtlinfo}
                    struct_org={getStructorgs(props.structinfos)}
                 />):
                 (
                        <center style={{ fontSize:"18px" }}>Error when retrieving the data, try to reload the page and contact an administrator</center>
                 )
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {props.accessInfo && props.usersinfo ?
                    (
                        < AccessProvider
                            cultureDigital={props.usersinfo}
                            columnNeeded={['Uid', 'last_name', 'first_name', 'email', 'has_access']}
                            accessUsers={props.accessInfo}
                        />) :
                    (
                        <center style={{fontSize:"18px"}}>Error when retrieving the data, try to reload the page and contact an administrator</center>
                    )
                }
            </TabPanel>
        </ThemeProvider>
    );
}
export default withStyles(style)(PsaAccessRightsManager)
