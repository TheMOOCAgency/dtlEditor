import React from 'react';
import ReactDOM from "react-dom";
import ReactDataGrid from 'react-data-grid';
import Papa from 'papaparse';
import './GridUser.css';
import './plugins/selectMultipleBig/multipleselectbig.js';
import $ from 'jquery';
import CircularProgress from '@material-ui/core/CircularProgress';



const issueTypes = []; //temporaire********************

class IdPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { idValue: props.value };
  }
  componentDidMount() {
    $('.idSelect').selectmultiple({
      text: this.state.idValue,
      data: issueTypes,
      width: 200,
    });
    var that = this;
    function handleTemp(s) {//A revoir <---*******
      that.props.handleChangeComplete(s)//A revoir <---*******
    }

    $('.idSelect').on('multiple_select_change', function () {
      handleTemp(this.firstChild.firstChild.innerText) //A revoir <---*******
    })
  }
  render() {
    return (
      <div className="idSelect">
      </div>
    )
  }
}



class CustomEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { idValue: props.value };
    this.handleChangeComplete = this.handleChangeComplete.bind(this)
  }
  handleChangeComplete = idVa => {
    this.setState({ idValue: idVa }, () => this.props.onCommit());
  };
  getValue() {
    return {Uid : this.state.idValue}
  }
  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName("button")[0].getElementsByTagName("span")[0];
  }

  render() {
   return(
     <IdPicker value={this.props.value} handleChangeComplete={this.handleChangeComplete}/>
      )
  }
}




class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      columns : null,
      rows : null, 
      isLoading : true,
    }
    this.getData = this.getData.bind(this);
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
    this.sortRows = this.sortRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
    this.addRow = this.addRow.bind(this);    
  }
  getData(result) {
    let columnsArray = result.data[0].map((data,index)=>{
      if(index === 0){
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          width: 200,
          editor: <CustomEditor />
        }
      }else{
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
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

  async fetchCsv() {

    return await fetch('/data/dtl.csv')
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
    /*With fetch method --************************************************************* > */
    let csvData = await this.fetchCsv();
    Papa.parse(csvData, {
      complete: this.getData
    });

  /* With Papaparse module method -********************************************************- > 

    Papa.parse('/data/dtl.csv', {
      download: true,
      complete: this.getData
    });*/
    
  }

  handleSubmit (){
    
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
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
    this.getCsvData();
  }
  addRow(){
    let canvGrid = document.getElementsByClassName("react-grid-Canvas")[0];
    canvGrid.scrollTop = canvGrid.scrollHeight;
    this.setState(prevState => ({
      rows: [...prevState.rows, {}]
    }))
  }
  render(){
    let gridData;
      if (this.state.isLoading) {
        gridData = <CircularProgress color="primary" />
      }else{
        console.log(this.state)
          gridData = 
            <div className='gridData'>
            <ReactDataGrid 
              columns={this.state.columns}
              rowGetter={i => this.state.rows[i]}
              rowsCount={this.state.rows.length}
              onGridRowsUpdated={this.onGridRowsUpdated}
              enableCellSelect={true}
              minHeight={800}
              headerRowHeight={50}
              onGridSort={(sortColumn, sortDirection) => {
               this.setState({
                 rows: this.sortRows(this.state.rows, sortColumn, sortDirection)
               })
              }

              } />
              <div id='buttonValidate'>
                <input onClick={this.handleSubmit} type='submit'/>
                {
                  //<CSVLink data={this.state.rows}>Download me</CSVLink> ************************* Lien pour télecharger directement un fichier CSV
                }
              </div>
            <div id='addingRowButton'>
              <input onClick={this.addRow} type='submit' />
            </div>
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
