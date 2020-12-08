import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { green, amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';

const useStyles1 = makeStyles(theme => ({
    warning: {
        backgroundColor: amber[700],
        fontSize: "14px",
        maxHeight: "500px",
        overflow: "auto"
    },
    success: {
        backgroundColor: green[700],
        fontSize: "14px",
        maxHeight: "500px",
        overflow: "auto"
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
    },
}));
export default function SnackBarSuccess(props) {
    const classes = useStyles1();
    return (
        <div>
            <Snackbar
                className={classes[props.snackBarState.type]}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={props.snackBarState.open}
                onClose={(event, reason) => {

                        return props.handleClose()
                    
                }
                }
            >
                <SnackbarContent
                    className={classes[props.snackBarState.type]}
                    message={                    
                        <span className={classes.message}>
                            {props.snackBarState.type === "success" ? (
                                <CheckCircleIcon className={clsx(classes.icon, classes.iconVariant)} />
                            ):
                            (
                                <WarningIcon className={clsx(classes.icon, classes.iconVariant)} />
                            )}
                            <span style={{whiteSpace: "pre-wrap"}}>{props.snackBarState.message}</span>
                        </span>
                        }
                    action={[
                        <IconButton
                            color="inherit"
                            key="close"
                            aria-label="close"
                            className={'close'}
                            onClick={props.handleClose}
                        >
                            <CloseIcon className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        </div>
    );
}