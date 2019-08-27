import React from 'react';
import ReactDataGrid from 'react-data-grid';
import './GridUser.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editors } from "react-data-grid-addons";
import Button from '@material-ui/core/Button';
import FormDialog from './components/FormDialog'
const { DropDownEditor } = Editors;

const struct_org = {};
const struct_org1 = []; 
const struct_org2 = [];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      columns : null,
      rows : null, 
      isLoading : true,
      openedDialogDelete: false,
      deletingRow:{},
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
    let columnsArray = Object.keys(this.props.dtl[0]).map((data)=>{
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
      } else if (data === 'role') {
        return {
          key: data,
          name: data,
          editable: false,
          sortable: true,
          resizable: true,
          width: 100
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
        if (result[x].struct_org2 !== '' && result[x].struct_org2 !== undefined) {
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
          if (result[x2].struct_org2 != '' || result[x2].struct_org2 !== undefined) {
            struct_org[x].push(result[x2].struct_org2)
          }
        }
      })
    })
    for (var property in struct_org) {
      struct_org[property].push('');
    }

    struct_org[''] = [...struct_org2]
    struct_org1.sort()
    struct_org2.sort()
    struct_org2.push('')

  }
  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    if (Object.keys(updated)[0] === "Uid"){
      for (let i = 1; i < this.props.cultureDigital.data.length; i++) {
        if (this.props.cultureDigital.data[i][0] === updated.Uid){
          let newUser = {
            Uid: this.props.cultureDigital.data[i][0],
            email: this.props.cultureDigital.data[i][4],
            first_name: this.props.cultureDigital.data[i][1],
            last_name: this.props.cultureDigital.data[i][2],
            role: this.props.cultureDigital.data[i][6],
            struct_org1: this.props.cultureDigital.data[i][7],
            struct_org2: this.props.cultureDigital.data[i][8]
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
    } else if (Object.keys(updated)[0] === "struct_org2"){
      if (struct_org[this.state.rows[fromRow].struct_org1].indexOf(updated.struct_org2) !== -1 || updated.struct_org2 === ''){
        this.setState(state => {
          const rows = state.rows.slice();
          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
          }
          return { rows };
        });
      }else{
        alert('Combinaison erronée')
      }

    } else if (Object.keys(updated)[0] === "struct_org1") {
      if (struct_org[updated.struct_org1].indexOf(this.state.rows[fromRow].struct_org2) !== -1 || updated.struct_org1 === '') {
        this.setState(state => {
          const rows = state.rows.slice();
          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
          }
          return { rows };
        });
      }else{
        alert('Combinaison erronée')
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

  };
  addRow(){
    let canvGrid = document.getElementsByClassName("react-grid-Canvas")[0];
    canvGrid.scrollTop = canvGrid.scrollHeight;
    this.setState(prevState => ({
      rows: [...prevState.rows, {}]
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
      rows: [...prevState.rows.slice(0, this.state.rows.indexOf(row)), ...prevState.rows.slice(this.state.rows.indexOf(row) + 1)]
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
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'auth': '1234'
      },
      body: JSON.stringify({
        rows: this.state.rows
      })
    })
      .then(function (data) {
        console.log('Request success: ', data);
      })
      .catch(function (error) {
        console.log('Request failure: ', error);
      });
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    this.getData(this.props.dtl)

  }
  render(){
    let gridData;
      if (this.state.isLoading) {
        gridData = <div className='circularProgress'><CircularProgress color="primary" /></div>
      }else{
          gridData = 
            <div className='gridData'>
            <ReactDataGrid 
              columns={this.state.columns}
              rowGetter={i => this.state.rows[i]}
              rowsCount={this.state.rows.length}
              onGridRowsUpdated={this.onGridRowsUpdated}
              enableCellSelect={true}
              minHeight={520}
              headerRowHeight={50}
              getCellActions={this.getCellActions}
              onGridSort={(sortColumn, sortDirection) => {
               this.setState({
                 rows: this.sortRows(this.state.rows, sortColumn, sortDirection)
               })
              }

              } />
            <Button color="primary" variant="contained" id='buttonValidate'>
                <input onClick={this.handleSubmit} type='submit' value="Valider" />
            </Button>
            <Button color="primary" variant="contained" id='addingRowButton'>
              <input onClick={this.addRow} type='submit' value="Ajouter un utilisateur" />
            </Button>
            <FormDialog
              open={this.state.openedDialogDelete}
              handleClose={this.closeDialog}
              handleClickOpen={this.openDialog}
              handleDeleteRow={this.deleteRow}
              deletingRow={this.state.deletingRow}
            />
          </div>

      }
      return (
        <div className="App">
           {gridData}
       </div>
      );
   }
  }
export default App;