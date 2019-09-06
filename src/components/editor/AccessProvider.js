import React from 'react';
import ReactDataGrid from 'react-data-grid';
import Button from '@material-ui/core/Button';
import styles from '../../assets/styleHook.js'
import { withStyles } from '@material-ui/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SnackBar from '../dialog/SnackBar'

class AccessProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsGrid : [],
            rows : [],
            has_access : [],
            openedSnackBarWarning: false,
            openedSnackBarSuccess: false,
            snackBarHandler : {
                open : false,
                type : "",
                message: ""
            },
            height: window.innerHeight,
            order : {
                column: "last_name",
                direction : "ASC"
            }

        };
        this.onGrantAccess = this.onGrantAccess.bind(this);
        this.onRemoveAccess = this.onRemoveAccess.bind(this);
        this.onResize = this.onResize.bind(this);
    }
    onResize(){
        this.setState({
            height: window.innerHeight
        });
    }
    getColumns(){
        return this.props.columnNeeded.map((column) => ({
            key: column,
            name: column,
            sortable:true,
            resizable: true,
            width : column === "email" ? 270 : 170
        }))
    }
    getRows(listAccess){
        let rowFetched =  this.props.cultureDigital.map((row)=>{
            return listAccess.includes(row.Uid) ? {...row, has_access : 'yes'} : { ...row, has_access: 'no' }
        })
        return this.onSortRows(rowFetched, this.state.order.column, this.state.order.direction)
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
            (Uid) => { return Uid !== "" }
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
                    return null
                } else {
                    if(Uid !== ''){
                        warning.push(Uid)
                    }
                    return null
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
            (Uid) => { return Uid !== "" }
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
                return null
            } else {
                if (Uid !== '') {
                    warning.push(Uid)
                }
                return null
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
                    snackBarHandler: {
                        open: true,
                        type: "warning",
                        message: "Incorrect Uid(s): \r\n" + warning.join(' \r\n - ')
                    }
                })
            } else {
                that.setState({
                    snackBarHandler: {
                        open: true,
                        type: "success",
                        message : "Success !"
                    }
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
    componentDidMount(){
        window.addEventListener("resize", this.onResize);
    }
    render() {
        return (
            <div className="App Accessprovider">
                <h1 className={this.props.classes.title}>Digital Barometer Invitations</h1>
                <TextareaAutosize id='listUsersToChange' className={this.props.classes.textearea} rows={5} placeholder="Type here(or double click on) UID(s) of the user(s) you want to grant or remove access to (one UID per line)"/>
                <div>
                    <Button className={this.props.classes.button} onClick={this.onGrantAccess} color="primary" variant="contained" id='buttonValidate'>
                    Grant Access
                </Button>
                    <Button className={this.props.classes.button} onClick={this.onRemoveAccess} color="secondary" variant="contained" id='addingRowButton'>
                    Remove access
                 </Button>
                </div>
                <ReactDataGrid
                    ref="rows"
                    columns={this.state.columnsGrid}
                    rowGetter={i => this.state.rows[i]}
                    rowsCount={this.state.rows.length}
                    enableCellSelect={true}
                    minHeight={this.state.height - 305}
                    enableRowSelect={null}
                    rowScrollTimeout={null}
                    onRowDoubleClick={e=>{
                        document.getElementById('listUsersToChange').value = document.getElementById('listUsersToChange').value + this.state.rows[e].Uid + '\n';
                    }}
                    onGridSort={(sortColumn, sortDirection) => {
                        this.setState({
                            order: { column: sortColumn, direction: sortDirection},
                            rows: this.onSortRows(this.state.rows, sortColumn, sortDirection)
                        })
                    }
                }
                />
                <SnackBar
                    snackBarState={this.state.snackBarHandler}
                    
                    handleClose={() => {
                        this.setState({
                            snackBarHandler: {
                                opening : false,
                                type: this.state.snackBarHandler.type,
                                message : ""
                            }
                        })}
                    }
                />
            </div>
        );
    }
}
export default withStyles(styles)(AccessProvider);