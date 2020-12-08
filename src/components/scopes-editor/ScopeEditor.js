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
  Input,
  Select,
  MenuItem,
  FormControl,
  withStyles,
  makeStyles,
  Box,
  Snackbar,
} from "@material-ui/core/";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import MuiAlert from "@material-ui/lab/Alert";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: "bold !important",
  },
  body: {
    fontSize: 12,
    position: "relative",
    height: 50,
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

const useStyles = makeStyles((theme) => ({
  buttonsList: {
    margin: "25px 25px 25px 0",
  },
  button: {
    marginRight: 15,
    fontWeight: "bold !important",
  },
  icon: {
    position: "absolute",
    left: 10,
    top: "calc(50% - 8px)",
    fontSize: 16,
  },
  subtitle: {
    fontStyle: "italic",
    color: "#777",
    maxWidth: 964,
    textAlign: "justify",
  },
  dtlEditor: {
    marginLeft: 25,
  },
  select: {
    fontSize: 12,
  },
  alert: {
    fontSize: 14,
  },
  container: {
    minWidth: 700,
    maxWidth: 964,
    height: 550,
    marginBottom: 25,
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: 5,
  },
}));

const Alert = (props) => {
  const classes = useStyles();
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      {...props}
      className={classes.alert}
    />
  );
};

const Buttons = ({ addDtlScope, saveNewScopes }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.buttonsList}>
      <Button
        className={classes.button}
        onClick={() => addDtlScope()}
        variant="contained"
        color="primary">
        Add a DTL scope
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={() => saveNewScopes()}>
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
        <StyledTableCell align="left">first_name</StyledTableCell>
        <StyledTableCell align="left">last_name</StyledTableCell>
        <StyledTableCell align="left">email</StyledTableCell>
        <StyledTableCell align="center">struct_org1</StyledTableCell>
        <StyledTableCell align="center">struct_org2</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const Selector = ({ name, index, editDtlScope, structures, value }) => {
  const classes = useStyles();
  return (
    <FormControl>
      <Select
        className={classes.select}
        value={value}
        name={name}
        onChange={(event) =>
          editDtlScope(index, event.target.name, event.target.value)
        }>
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
  removeDtlScope,
}) => {
  const classes = useStyles();
  return (
    <StyledTableRow onClick={() => setSelectedCell(index)}>
      <StyledTableCell component="th" scope="row" align="center">
        {selectedCell === index && (
          <HighlightOffIcon
            color="secondary"
            className={classes.icon}
            onClick={() =>
              removeDtlScope(user.Uid, user.struct_org1, user.struct_org2)
            }
          />
        )}
        {selectedCell === index ? (
          <Input
            inputProps={{
              style: { textAlign: "center", fontSize: 12 },
            }}
            size="normal"
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
      <StyledTableCell align="left">{user.first_name}</StyledTableCell>
      <StyledTableCell align="left">{user.last_name}</StyledTableCell>
      <StyledTableCell align="left">{user.email}</StyledTableCell>
      <StyledTableCell align="center">
        {selectedCell === index &&
        Object.keys(structures).includes(user.struct_org1) ? (
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
        {selectedCell === index &&
        Object.keys(structures).includes(user.struct_org1) ? (
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

const SnackBars = ({
  success,
  setSuccess,
  error,
  setError,
  warning,
  setWarning,
}) => {
  return (
    <>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Vos modifications ont bien été sauvegardées
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error">
          Une erreur est survenue lors de la sauvegarde, essayez à nouveau.
        </Alert>
      </Snackbar>
      <Snackbar
        open={warning}
        autoHideDuration={3000}
        onClose={() => setWarning(false)}>
        <Alert onClose={() => setWarning(false)} severity="warning">
          Incorrect UID
        </Alert>
      </Snackbar>
    </>
  );
};

export default function ScopeEditor({ dtlUsers, structures, usersList }) {
  const classes = useStyles();

  const [dtlScopesList, setDtlScopes] = useState(dtlUsers);
  const [selectedCell, setSelectedCell] = useState();
  const [warning, setWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const addDtlScope = useCallback(() => {
    // Create an empty line on top of dtl list
    let userTemplate = {
      Uid: "",
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      struct_org1: "",
      struct_org2: "",
    };

    let newDtlList = [...dtlScopesList];
    newDtlList.unshift(userTemplate);
    setDtlScopes(newDtlList);
  }, [dtlScopesList]);

  const removeDtlScope = useCallback(
    (uid, org1, org2) => {
      let newDtlList = [
        ...dtlScopesList.filter(
          (user) =>
            user.Uid !== uid ||
            user.struct_org1 !== org1 ||
            user.struct_org2 !== org2
        ),
      ];
      setDtlScopes(newDtlList);
    },
    [dtlScopesList]
  );

  const editDtlScope = useCallback(
    (index, name, value) => {
      let newDtlList = [...dtlScopesList];
      newDtlList[index][name] = value;

      if (name === "struct_org1") {
        // Empty struct_org2 value when selection a new struct_org1
        newDtlList[index]["struct_org2"] = "";
      }

      if (name === "Uid") {
        // Check if Uid is in users list
        let newUser = usersList.find((user) => {
          return user.Uid === value;
        });

        if (newUser) {
          // Auto-fill line with user details, when Uid matches
          newDtlList[index]["first_name"] = newUser.first_name;
          newDtlList[index]["last_name"] = newUser.last_name;
          newDtlList[index]["email"] = newUser.email;
          newDtlList[index]["role"] = newUser.role;
        } else {
          // Empty line in case Uid is not in users list
          newDtlList[index]["first_name"] = "";
          newDtlList[index]["last_name"] = "";
          newDtlList[index]["email"] = "";
          newDtlList[index]["role"] = "";
          newDtlList[index]["struct_org1"] = "";
          newDtlList[index]["struct_org2"] = "";
          setWarning(true);
        }
      }

      setDtlScopes(newDtlList);
    },
    [dtlScopesList, usersList]
  );

  const saveNewScopes = () => {
    let cleanScopes = dtlScopesList.filter((user) => user.email !== "");

    let formData = new FormData();
    formData.append("dtl", JSON.stringify(cleanScopes));
    fetch("/tma_apps/microsite_dashboard/dtl_manager", {
      method: "POST",
      headers: {
        "X-CSRFToken": window.props.csrfToken,
      },
      body: formData,
    })
      .then((data) => {
        let status = data.status;
        if (status === 200) {
          setSuccess(true);
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  return (
    <Grid className={classes.dtlEditor}>
      <Box component="h3">DTL Scope Editor</Box>
      <Box component="div" className={classes.subtitle}>
        Changes made on this interface are displayed in real time but DTL scopes
        are updated each night, between midnight and 6am (French Time). DTLs may
        then wait a maximum of 24 hours before seeing any change made here.
      </Box>
      <Buttons addDtlScope={addDtlScope} saveNewScopes={saveNewScopes} />
      <TableContainer className={classes.container} r>
        <Table stickyHeader>
          <Header className={classes.tableHeader} />
          <TableBody>
            {dtlScopesList.map((user, index) => (
              <Row
                user={user}
                index={index}
                structures={structures}
                editDtlScope={editDtlScope}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                removeDtlScope={removeDtlScope}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SnackBars
        error={error}
        warning={warning}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
        setWarning={setWarning}
      />
    </Grid>
  );
}
