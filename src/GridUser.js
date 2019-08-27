import React from 'react';
import ReactDataGrid from 'react-data-grid';
import Papa from 'papaparse';
import './GridUser.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editors } from "react-data-grid-addons";
import Button from '@material-ui/core/Button';
import FormDialog from './Components/FormDialog'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


const { DropDownEditor } = Editors;

const styles={
  gridWrapper:{
    padding:20
  },
  AddDtl:{
      marginTop:50
  }
}


const columnsOrder=["uuid","first_name","last_name","struct_org1","struct_org2","role"]

class App extends React.Component {
  state={
    columns : [],
    rows : [],
    structures:{}, 
    isLoading : false,
    openedDialog:false,
    modifiedProfile:{}
  }

  getStructOrgs=()=>{
    let structures={}
    this.props.dtl.forEach(row=>{
      const userOrg1 = row['struct_org1']
      const userOrg2 = row['struct_org2']
      if(!structures["structure1"] ||  !structures["structure1"].includes(userOrg1)){
        !structures["structure1"]
        ?structures["structure1"]=[userOrg1]
        :structures["structure1"].push(userOrg1)
      }
      if(!structures[userOrg1] || !structures[userOrg1].includes(userOrg2)){
        !structures[userOrg1]
        ?structures[userOrg1]=[userOrg2] 
        :structures[userOrg1].push(userOrg2)
      }
    })
    this.setState({
      structures
    })
  }

  getColumns = ()=>{
    return Object.keys(this.props.dtl[0])
    .map(column=>({
      key:column,
      name:column,
      sortable: true,
      resizable: true,
      editor : ["struct_org1","struct_org2"].includes() && <DropDownEditor options={this.state.struct_orgs[column]} />
    }))
    .sort((el1,el2)=>{
      return columnsOrder.indexOf(el1['key'].toLowerCase()) - columnsOrder.indexOf(el2["key"].toLowerCase())
    })
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

  modifyRow=(rowIndex)=>{
    this.setState(prevState=>({
      openedDialog:true,
      modifiedProfile : prevState.rows[rowIndex]
    }))
  }

  closeDialog=()=>{
    this.setState({
      openedDialog:false,
      modifiedProfile:{}
    })
  }

  handleStructureChange=()=>{

  }

  createNewDtl=()=>{
    this.setState({
      openedDialog:true,
    })
  }

  componentWillMount=()=>{
    const {dtl} = this.props
    if(dtl && dtl.length >0){
      this.setState({
        columns : this.getColumns(),
        rows :  dtl,
        struct_orgs: this.getStructOrgs()
      })
    }
  }
  
  render(){
    const {isLoading, columns, rows} = this.state
    const {classes}=this.props
    return(        
    <div className={classes.gridWrapper}>
      <Typography component="div">
        <Box fontSize={26} m={1}>Edition des droits DTL</Box>
        <Box fontSize={16} m={1}>Modifiez ici les droits d'accès des DTL aux organisations</Box>
      </Typography>
      {
        isLoading 
        ? <div className='circularProgress'><CircularProgress color="primary" /></div>
        :             
        <div className='gridData'>
          <ReactDataGrid 
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            onGridSort={(sortColumn, sortDirection) => {
              this.setState({
                rows: this.sortRows(this.state.rows, sortColumn, sortDirection)
              })
            }}
            onRowDoubleClick={event=>this.modifyRow(event)}
          />
        </div>
      }
      <FormDialog 
        openedDialog={this.state.openedDialog}
        closeDialog={this.closeDialog}
        modifiedProfile={this.state.modifiedProfile}
        structures={this.state.structures}
      />
      <Grid container className={classes.AddDtl}>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={e=>this.createNewDtl()}> Ajouter un DTL</Button>
        </Grid>
      </Grid>
      </div>
    )
   }
}
export default withStyles(styles)(App);