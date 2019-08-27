import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function SnackBarError(props) {

    return (
        <div>
            <Snackbar
                className={"warningSnack"}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={props.open}
                onClose={(event,reason) => {
                        if (reason === 'clickaway') {
                            return ;
                        }
                        else{
                            return props.handleClose()
                        }
                    }
                }
                autoHideDuration={6000}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Id Inexistant</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={'close'}
                        onClick={props.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </div>
    );
}