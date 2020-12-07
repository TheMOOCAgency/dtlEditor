import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  Grid,
  TableRow,
  Paper,
  Input,
  Select,
  MenuItem,
  FormControl,
  withStyles,
  makeStyles,
} from "@material-ui/core/";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: "pointer",
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    maxWidth: 1200,
    marginLeft: 25,
    marginBottom: 25,
  },
  buttonsList: {
    margin: 25,
  },
  button: {
    marginRight: 15,
  },
});

const Buttons = ({ addDtlScope }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.buttonsList}>
      <Button
        className={classes.button}
        onClick={() => addDtlScope()}
        variant="contained"
        color="primary"
      >
        Add a DTL scope
      </Button>
      <Button className={classes.button} variant="contained" color="secondary">
        Save
      </Button>
    </Grid>
  );
};

const Header = () => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell align="center">Uid</StyledTableCell>
        <StyledTableCell align="center">first_name</StyledTableCell>
        <StyledTableCell align="center">last_name</StyledTableCell>
        <StyledTableCell align="center">struct_org1</StyledTableCell>
        <StyledTableCell align="center">struct_org2</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const Selector = ({ name, index, editDtlScope, structures, value }) => {
  return (
    <FormControl>
      <Select
        value={value}
        name={name}
        onChange={(event) =>
          editDtlScope(index, event.target.name, event.target.value)
        }
      >
        {structures.map((structure) => {
          return (
            <MenuItem key={structure} value={structure}>
              {structure}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const Row = ({
  user,
  index,
  structures,
  selectedCell,
  setSelectedCell,
  editDtlScope,
}) => {
  return (
    <StyledTableRow onClick={() => setSelectedCell(index)}>
      <StyledTableCell component="th" scope="row" align="center">
        {selectedCell === index ? (
          <Input
            value={user.Uid}
            name="Uid"
            onChange={(event) =>
              editDtlScope(index, event.target.name, event.target.value)
            }
          />
        ) : (
          user.Uid
        )}
      </StyledTableCell>
      <StyledTableCell align="center">{user.first_name}</StyledTableCell>
      <StyledTableCell align="center">{user.last_name}</StyledTableCell>
      <StyledTableCell align="center">
        {selectedCell === index ? (
          <Selector
            name="struct_org1"
            index={index}
            editDtlScope={editDtlScope}
            structures={Object.keys(structures)}
            value={user.struct_org1}
          />
        ) : (
          user.struct_org1
        )}
      </StyledTableCell>
      <StyledTableCell align="center">
        {selectedCell === index ? (
          <Selector
            name="struct_org2"
            index={index}
            editDtlScope={editDtlScope}
            structures={structures[user.struct_org1]}
            value={user.struct_org2}
          />
        ) : (
          user.struct_org2
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default function ScopeEditor({ dtlUsers, structures }) {
  const classes = useStyles();

  const [dtlScopesList, setDtlScopes] = useState(dtlUsers);
  const [selectedCell, setSelectedCell] = useState();

  // Create an empty line on top of dtl list
  const addDtlScope = useCallback(() => {
    let userTemplate = {
      Uid: "",
      first_name: "",
      last_name: "",
      struct_org1: "",
      struct_org2: "",
    };

    let newDtlList = [...dtlScopesList];
    newDtlList.unshift(userTemplate);
    setDtlScopes(newDtlList);
  }, [dtlScopesList]);

  const editDtlScope = useCallback(
    (index, name, value) => {
      console.log(dtlScopesList);
      let newDtlList = [...dtlScopesList];
      newDtlList[index][name] = value;
      if (name === "struct_org1") {
        newDtlList[index]["struct_org2"] = "";
      }
      setDtlScopes(newDtlList);
    },
    [dtlScopesList]
  );

  return (
    <Grid>
      <Buttons addDtlScope={addDtlScope} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <Header />
          <TableBody>
            {dtlScopesList.map((user, index) => (
              <Row
                user={user}
                index={index}
                structures={structures}
                editDtlScope={editDtlScope}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
