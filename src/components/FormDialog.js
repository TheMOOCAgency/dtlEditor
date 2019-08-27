import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';




export default function AlertDialog(props) {

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Suppression d'une ligne"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                     Voulez-vous vraiment supprimer cette ligne ?
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={
                        props.handleClose
                    } color="primary">
                        Annuler
          </Button>
                    <Button onClick={()=>{
                        props.handleClose();
                        props.handleDeleteRow(props.deletingRow)
                    }} color="primary" autoFocus>
                        Supprimer
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}