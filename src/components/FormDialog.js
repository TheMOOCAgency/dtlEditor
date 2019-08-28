import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {

    return (
        <div>
            <Dialog
            className={'deleteDialog'}
                fullWidth={true}
                style={{fontSize:'18px'}}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this item?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={
                        props.handleClose
                    } color="primary">
                        Cancel
          </Button>
                    <Button onClick={()=>{
                        props.handleClose();
                        props.handleDeleteRow(props.deletingRow)
                    }} color="primary" autoFocus>
                        Delete
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}