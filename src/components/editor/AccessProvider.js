import React from 'react';
import ReactDataGrid from 'react-data-grid';
import Button from '@material-ui/core/Button';
import styles from '../../assets/styleHook.js'
import { withStyles } from '@material-ui/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SnackBarSuccess from '../dialog/SnackBarSuccess'
import SnackBarError from '../dialog/SnackBarError'

class AccessProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsGrid : [],
            rows : [],
            has_access : [],
            openedSnackBarWarning: false,
            openedSnackBarSuccess: false,

        };
        this.onGrantAccess = this.onGrantAccess.bind(this);
        this.onRemoveAccess = this.onRemoveAccess.bind(this);
    }
    getColumns(){
        return this.props.columnNeeded.map((column) => ({
            key: column,
            name: column,
            sortable:true,
            resizable: true,
            width : 210
        }))
    }
    getRows(listAccess){
        return this.props.cultureDigital.map((row)=>{
            return listAccess.includes(row.Uid) ? {...row, has_access : 'yes'} : { ...row, has_access: 'no' }
        })
    }
 
    onSortRows = (initialRows, sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };
        return sortDirection === "NONE" ? initialRows : [...initialRows].sort(comparer);
    };
    onGrantAccess (){
        if (document.getElementById('listUsersToChange').value.split("\n").some(
            (Uid) => { return Uid != "" }
        )){
            let warning = [];
            let rowUid = this.state.rows.map((row) => {
                return row.Uid
            })
            let stringValue = document.getElementById('listUsersToChange').value.split("\n").filter((Uid) => {
                if (rowUid.includes(Uid)){
                    if(!this.state.has_access.includes(Uid)){
                        return Uid
                    }
                } else {
                    warning.push(Uid)
                }
            })
            
            
            stringValue = [...this.state.has_access, ...stringValue]
            this.setState({
                rows: this.getRows(stringValue),
                has_access: [...stringValue]
            }, () => {
                this.handleSubmit(warning);
            })
        }
    }
    onRemoveAccess() { //********************************************A faire le checking d'erreur */
        if (document.getElementById('listUsersToChange').value.split("\n").some(
            (Uid) => { return Uid != "" }
        )) {
        let warning = [];
        let rowUid = this.state.rows.map((row) => {
            return row.Uid
        })
        let stringValue = document.getElementById('listUsersToChange').value.split("\n").filter((Uid) => {
            if (rowUid.includes(Uid)) {
                if (this.state.has_access.includes(Uid)){
                    return Uid
                }
            } else {
                warning.push(Uid)
            } 
        })
        stringValue = this.state.has_access.filter((Uid) => {
            return !document.getElementById('listUsersToChange').value.split("\n").includes(Uid)
        })
        this.setState({
            rows: this.getRows(stringValue),
            has_access: [...stringValue]
        },() => {
                this.handleSubmit(warning);
        })
        
        }
    }
    handleSubmit(warning) {
        const that = this;
        let formData = new FormData();
        formData.append('data', JSON.stringify(this.state.has_access))
       
        fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': window.props.csrfToken
            },
            body: formData,
        }).then(function (data) {
            document.getElementById('listUsersToChange').value = '';
            if (warning && warning.length > 0) {
                that.setState({
                    openedSnackBarWarning: true
                })
            } else {
                that.setState({
                    openedSnackBarSuccess: true
                })
            }
        }).catch(function (error) {
            alert('An error has occurred, no data has been sent !')
        });

    }
    componentWillMount() {
        if (this.state.rows <= 0 || this.state.columnsGrid <= 0) {
            this.setState({
                columnsGrid: this.getColumns(),
                has_access: [...this.props.accessUsers],
                rows: this.getRows(this.props.accessUsers),
            })
        }
    } 
    render() {
        return (
            <div className="App Accessprovider">
                <h1 className={this.props.classes.title}>Digital Barometer Invitations</h1>
                <TextareaAutosize id='listUsersToChange' className={this.props.classes.textearea} rows={5} placeholder="Type here UIDs of The users you want to grant or remove access to (one UID per line)"/>
                <div>
                    <Button className={this.props.classes.button} onClick={this.onGrantAccess} color="primary" variant="contained" id='buttonValidate'>
                    Grant Access
                </Button>
                    <Button className={this.props.classes.button} onClick={this.onRemoveAccess} color="secondary" variant="contained" id='addingRowButton'>
                    Remove access
                 </Button>
                </div>
                <ReactDataGrid
                    columns={this.state.columnsGrid}
                    rowGetter={i => this.state.rows[i]}
                    rowsCount={this.state.rows.length}
                    enableCellSelect={true}
                    onRowDoubleClick={e=>{
                        document.getElementById('listUsersToChange').value = document.getElementById('listUsersToChange').value + this.state.rows[e].Uid + '\n';
                    }}
                    onGridSort={(sortColumn, sortDirection) => {
                        this.setState({
                            rows: this.onSortRows(this.state.rows, sortColumn, sortDirection)
                        })
                    }
                }
                />
                <SnackBarSuccess
                    open={this.state.openedSnackBarSuccess}
                    handleClose={() => {
                        this.setState({
                            openedSnackBarSuccess: false,
                        })}
                    }
                />
                <SnackBarError
                    open={this.state.openedSnackBarWarning}
                    handleClose={() => {
                        this.setState({
                            openedSnackBarWarning: false,
                        })
                    }
                    }
                />
            </div>
        );
    }
}
export default withStyles(styles)(AccessProvider);