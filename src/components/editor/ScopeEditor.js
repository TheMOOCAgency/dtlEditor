import React from 'react';
import ReactDataGrid from 'react-data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editors } from "react-data-grid-addons";
import Button from '@material-ui/core/Button';
import FormDialog from '../dialog/FormDialog'
import SnackBarError from '../dialog/SnackBarError'
const { DropDownEditor } = Editors;

const struct_org = {};
const struct_org1 = []; 
const struct_org2 = [];

class ScopeEditor extends React.Component {
  constructor(props){
    super(props);
    this.state={
      columns : null,
      rows : null, 
      isLoading : true,
      openedDialogDelete: false,
      deletingRow:{},
      openedWarning : false,
      changing : false
    }
    this.getData = this.getData.bind(this);
    this.getDataStruct = this.getDataStruct.bind(this);
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
    this.sortRows = this.sortRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
    this.addRow = this.addRow.bind(this);    
    this.getCellActions = this.getCellActions.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  closeWarning = () => {
    this.setState({
      openedWarning: false,
    })
  }

  closeDialog = () => {
    this.setState({
      openedDialogDelete: false,
    })
  }

  openDialog=(row)=>{
    this.setState({
      openedDialogDelete:true,
      deletingRow : row
    })
  }

  getData() {
    let columnsSorted = [
      Object.keys(this.props.dtl[0])[2], Object.keys(this.props.dtl[0])[1], Object.keys(this.props.dtl[0])[0], Object.keys(this.props.dtl[0])[6], Object.keys(this.props.dtl[0])[4], Object.keys(this.props.dtl[0])[3]
    ]
    let columnsArray = columnsSorted.map((data)=>{
      if (data === 'struct_org1') {
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable : true,
          width: 125,
          editor: <DropDownEditor options={struct_org1} />
        }
      } else if (data === 'struct_org2') {
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable: true,
          width: 125,
          editor: <DropDownEditor options={struct_org2} />
        }
      }else if (data === 'Uid'){
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable: true,
          width: 150,
        }
      }else{
        return {
          key: data,
          name: data,
          sortable: true,
          resizable: true,
          width: 200
        }
      }
      
    })

    this.setState({
      columns: columnsArray,
      rows : this.props.dtl,
      struct_org: this.getDataStruct(this.props.struct_org),
      isLoading: false 
    })
  }

  getDataStruct(result) {
    Object.keys(result).map((x) => {
      if (struct_org1.indexOf(result[x].struct_org1) === -1) {
        if (result[x].struct_org1 !== undefined) {
          struct_org1.push(result[x].struct_org1)
        }
      }
      if (struct_org2.indexOf(result[x].struct_org1) === -1) {
        if (struct_org2.indexOf(result[x].struct_org2) === -1 && result[x].struct_org2 !== '' && result[x].struct_org2 !== undefined) {
          struct_org2.push(result[x].struct_org2)
        }
      }
    })

    struct_org1.map((x) => {
      Object.keys(result).map((x2) => {
        if (x === result[x2].struct_org1) {
          if (struct_org[x] === undefined) {
            struct_org[x] = []
          }
          if (result[x2].struct_org2 !== '' || result[x2].struct_org2 !== undefined) {
            struct_org[x].push(result[x2].struct_org2)
          }
        }
      })
    })
    for (var property in struct_org) {
      struct_org[property].push('');
    }

    struct_org[''] = [...struct_org2]
    struct_org['all'] = [...struct_org2]
    struct_org1.push('all')
    struct_org2.push('')
    struct_org1.sort()
    struct_org2.sort()
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    if (Object.keys(updated)[0] === "Uid" && this.state.rows[toRow].Uid !== updated.Uid){
      this.closeWarning();
      let count = false;
      for (let i = 1; i < this.props.cultureDigital.length; i++) {
        if (this.props.cultureDigital[i].Uid === updated.Uid){
          count = true;
          let newUser = {
            Uid: this.props.cultureDigital[i].Uid,
            email: this.props.cultureDigital[i].email,
            first_name: capitalizeFirstLetter(this.props.cultureDigital[i].first_name),
            last_name: capitalizeFirstLetter(this.props.cultureDigital[i].last_name),
            role: this.props.cultureDigital[i].role,
            struct_org1: "",
            struct_org2: ""
          }
          this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
              rows[i] = { ...rows[i], ...newUser };
            }
            return { rows };
          });
        }
      
      }
      if(!count){
        count = false;
        this.setState({
          openedWarning : true
        })
        
      }
    }else{
      this.setState(state => {
        const rows = state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
          rows[i] = { ...rows[i], ...updated };
        }
        return { rows };
      });
    }
    this.setState({
      changing : true
    })
  };
  addRow(){
    let canvGrid = document.getElementsByClassName("react-grid-Canvas")[0];
    canvGrid.scrollTop = 0;
    let newRows = [...this.state.rows]
    newRows.unshift({})
    this.setState(prevState => ({
      rows: newRows
    }))
  }

  sortRows = (initialRows, sortColumn, sortDirection) =>{
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? initialRows : [...initialRows].sort(comparer);
  };

  deleteRow (row){
    this.setState(prevState => ({
      rows: [...prevState.rows.slice(0, this.state.rows.indexOf(row)), ...prevState.rows.slice(this.state.rows.indexOf(row) + 1)],
      changing: true
    }))
  }

  getCellActions(column, row) {
    const firstNameActions = [
      {
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: ()=>{
          this.openDialog(row)
        }
      }
    ]
    const cellActions = {
      Uid: firstNameActions
    };
    return cellActions[column.key];
  }

  handleSubmit() {
    let dataToSend = this.state.rows.filter((value,index,arr)=>{
      return value.Uid !== undefined
    })
    let formData = new FormData();
    formData.append('data', JSON.stringify(dataToSend))

    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'X-CSRFToken': window.props.csrfToken
      },
      body: formData,
    }).then(function (data) {
      window.location.reload()
    })
      .catch(function (error) {
        alert('An error has occurred, no data has been sent !')
    }); 
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getData(this.props.dtl)
  }

  componentDidMount(){
    const comparer = (a, b) => {
      return a['last_name'] > b['last_name'] ? 1 : -1;
    };
    this.setState({
      rows:[...this.state.rows].sort(comparer)
    })
  }

  render(){
      return (
        <div className="App scopeEditor">
          {this.state.isLoading ? 
          (
              <div className='circularProgress'><CircularProgress color="primary" /></div>
          )  :
          (
              <div>
                <h1 id={'dtlEditorTitle'}>DTL Scope Editor</h1>
                <i>Changes made on this interface are displayed in real time but DTL scopes are updated each night, between midnight and 6am (French Time). DTLs may then wait a maximum of 24 hours before seeing any change made here.</i>
                <div><Button style={{ borderRadius: 15, padding: "10px 20px", fontSize: '14px' }} onClick={this.handleSubmit} color="primary" variant="contained" id='buttonValidate'>
                  Submit
            </Button>
                  <Button style={{ borderRadius: 15, padding: "10px 20px", fontSize: '14px', margin: '10px' }} onClick={this.addRow} color="primary" variant="contained" id='addingRowButton'>
                    Add a DTL Scope
            </Button>
                  {this.state.changing &&
                    <p className={'changeWarning'}>You may have unsaved changes </p>
                  }
                </div>
                <ReactDataGrid
                  ref={(datagrid) => { this.refGrid = datagrid; }}
                  columns={this.state.columns}
                  rowGetter={i => this.state.rows[i]}
                  rowsCount={this.state.rows.length}
                  onGridRowsUpdated={this.onGridRowsUpdated}
                  enableCellSelect={true}
                  headerRowHeight={35}
                  getCellActions={this.getCellActions}
                  onGridSort={(sortColumn, sortDirection) => {
                    this.setState({
                      rows: this.sortRows(this.state.rows, sortColumn, sortDirection)
                    })
                  }

                  } />
                <FormDialog
                  open={this.state.openedDialogDelete}
                  handleClose={this.closeDialog}
                  handleClickOpen={this.openDialog}
                  handleDeleteRow={this.deleteRow}
                  deletingRow={this.state.deletingRow}
                />
                <SnackBarError
                  open={this.state.openedWarning}
                  handleClose={this.closeWarning}
                />
              </div>
          )
        }
       </div>
      );
   }
  }
export default ScopeEditor;