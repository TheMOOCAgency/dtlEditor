import React from 'react';
import ReactDataGrid from 'react-data-grid';
import Papa from 'papaparse';
import './GridUser.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editors } from "react-data-grid-addons";
import Button from '@material-ui/core/Button';
const { DropDownEditor } = Editors;


const issueTypes = []; 
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
    }
    this.getData = this.getData.bind(this);
    this.getDataStruct = this.getDataStruct.bind(this);
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
    this.sortRows = this.sortRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
    this.addRow = this.addRow.bind(this);    
    this.getCellActions = this.getCellActions.bind(this);
  }

  getDataStruct (result){
    result.data.map((x)=>{
      if (struct_org1.indexOf(x[0]) === -1){
        struct_org1.push(x[0])
      }
      if (struct_org2.indexOf(x[1]) === -1) {
        if (x[1] !== '' && x[1] !== undefined){
          struct_org2.push(x[1])
        }
      }
    })
    struct_org1.map((x) => {
      result.data.map((x2) => {
        if (x === x2[0]) {
          if (struct_org[x] === undefined) {
            struct_org[x] = []
          }
          struct_org[x].push(x2[1])
        }
        
      })
    })
    for (var property in struct_org) {
      struct_org[property].push('');
    }
    struct_org[''] = [...struct_org2]
    struct_org1.shift()
    struct_org2.shift()
    struct_org1.sort()
    struct_org2.sort()
    struct_org2.push('')
  }
  getData(result) {
    result.data.pop()
    let columnsArray = result.data[0].map((data,index)=>{
      if (index === 5) {
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable : true,
          width: 125,
          editor: <DropDownEditor options={struct_org1} />
        }
      } else if (index === 6) {
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable: true,
          width: 125,
          editor: <DropDownEditor options={struct_org2} />
        }
      } else if (index === 4) {
        return {
          key: data,
          name: data,
          editable: false,
          sortable: true,
          resizable: true,
          width: 100
        }
      }else if (index === 0){
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
    let formateDataForGrid = async (datas) => {
      
      return new Promise((resolve, reject) => {
        let row = [];
        for (let i = 1; i < datas.length; i++) {
          let tempRow = datas[i].map((data, index) => {
            if (columnsArray[index] !== undefined){
              return {
                [columnsArray[index].key]: data
              }
            }
            return null
          })
          row.push(Object.assign({}, ...tempRow))
        }
        resolve(row)
      })
    }
    formateDataForGrid(result.data).then(resultRow=>{
      this.setState({ columns: columnsArray, rows: resultRow, isLoading:false });
    })
    
  }

  async fetchCsv(file) {

    return await fetch(file)
    .then((response)=> {
      this.props.cultureDigital.data.map((data, index) => {
        if (index >= 1) {
          issueTypes.push(data[0])
        }
      })
      return response.text()
    })
  }

  async getCsvData() {
    this.fetchCsv('/data/struct_org.csv').then(x=>{
      Papa.parse(x, {
        complete: this.getDataStruct
      });
    }).then(x=>{
    this.fetchCsv('/data/dtl.csv').then(y=>{
        Papa.parse(y, {
          complete: this.getData
        });
      })
    })
  }
  handleSubmit (){
    
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

  componentDidMount(){
    this.setState({ isLoading: true });
    this.getCsvData('/data/dtl.csv');
  }
  addRow(){
    let canvGrid = document.getElementsByClassName("react-grid-Canvas")[0];
    canvGrid.scrollTop = canvGrid.scrollHeight;
    this.setState(prevState => ({
      rows: [...prevState.rows, {}]
    }))
  }
  getCellActions(column, row) {
    const firstNameActions = [
      {
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: () => {
          this.setState(prevState => ({
            rows: [...prevState.rows.slice(0, this.state.rows.indexOf(row)), ...prevState.rows.slice(this.state.rows.indexOf(row)+1)]
          }))
        }
      }
    ]
    const cellActions = {
      Uid: firstNameActions
    };
    return cellActions[column.key];
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