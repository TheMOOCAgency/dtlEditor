import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



const styles = theme => ({
  container: {
    fontSize:25
  }
});


class FormDialog extends Component{
  render(){
    const {closeDialog, openedDialog, modifiedProfile, handleProfileChange, structures} = this.props
    const newProfile = Object.keys(modifiedProfile).length===0
    return (
      <div>
        <Dialog open={openedDialog} onClose={closeDialog} aria-labelledby="form-dialog-title">
          {
            newProfile
            ? <DialogTitle id="form-dialog-title">Créer un nouveau DTL</DialogTitle>
            : <DialogTitle id="form-dialog-title">Modifier le profil DTL</DialogTitle>
          }
          <DialogContent>
            {
              newProfile
              ? <DialogContentText> Créez le profil des droits DTL de votre utilisateur.</DialogContentText>
              : <DialogContentText> Modifiez le profil des droits DTL de votre utilisateur.</DialogContentText>
            }
            <TextField
              autoFocus
              margin="dense"
              id="uuid"
              label="UUID"
              fullWidth
              value={modifiedProfile['Uid']}
            />
            {
              !newProfile &&
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="first_name"
                  label="First Name"
                  fullWidth
                  value={modifiedProfile['first_name']}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="last_name"
                  label="Last Name"
                  fullWidth
                  value={modifiedProfile['last_name']}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="role"
                  label="Role"
                  fullWidth
                  value={modifiedProfile['role']}
                />
            <FormControl fullWidth>
            <InputLabel htmlFor="age-simple">Structure 1</InputLabel>
            <Select
            value={modifiedProfile && modifiedProfile['struct_org1']}
            onChange={handleProfileChange}
            >
            {structures['structure1'] && structures['structure1'].map(org=> <MenuItem value={org}>{org}</MenuItem>)}
            </Select>
          </FormControl>
          
          <FormControl 
            fullWidth 
            disabled={(modifiedProfile && !modifiedProfile['struct_org1'])}
          >
            <InputLabel htmlFor="age-simple">Structure 2</InputLabel>
            <Select
            value={modifiedProfile && modifiedProfile['struct_org2']}
            onChange={handleProfileChange}
            >
              {modifiedProfile['struct_org1'] 
              && structures[modifiedProfile['struct_org1']] 
              && structures[modifiedProfile['struct_org1']].map(org=> <MenuItem value={org}>{org}</MenuItem>)}
            </Select>
          </FormControl>
          </>
            }

          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={closeDialog} color="primary">
              Modifier
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  }
  
  export default withStyles(styles)(FormDialog)