import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';
export default function SnackBarSuccess(props) {

    const useStyles1 = makeStyles(theme => ({
        warning: {
            backgroundColor: green[700],
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
            alignItems: 'center',
        },
    }));
    const classes = useStyles1();
    return (
        <div>
            <Snackbar
                className={classes.warning}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={props.open}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    else {
                        return props.handleClose()
                    }
                }
                }
                autoHideDuration={3000}
            >
                <SnackbarContent
                    className={classes.warning}
                    message={<span id="client-snackbar">
                        Success
                </span>}
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