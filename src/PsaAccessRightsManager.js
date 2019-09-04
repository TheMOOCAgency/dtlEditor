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
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
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
                    struct_org={props.structinfos}
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

