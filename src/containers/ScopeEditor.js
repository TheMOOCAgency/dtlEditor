import React from "react";
import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";
import Button from "@material-ui/core/Button";
import AlertDialog from "../components/dialog/AlertDialog";
import SnackBarError from "../components/dialog/SnackBarError";
import { withStyles } from "@material-ui/styles";
import styles from "../assets/styleHook.js";
import "../components/editor/editor.css";

const { DropDownEditor } = Editors;

class ScopeEditor extends React.Component {
  state = {
    columns: null,
    openedDialogDelete: false,
    deletingRow: {},
    openedWarning: false,
    unsavedChanges: false,
    rows: [],
  };

  toggleDialogs = (name, row) => {
    this.setState({ [name]: !this.state[name] });
    row && this.setState({ deletingRow: row });
  };

  getData = () => {
    const { dtl, structures } = this.props;
    // Sort data in the following order
    // Uid;last_name;first_name;email;struct_org1;
    let columnsSorted = [
      Object.keys(dtl[0])[3],
      Object.keys(dtl[0])[2],
      Object.keys(dtl[0])[1],
      Object.keys(dtl[0])[4],
      Object.keys(dtl[0])[0],
    ];

    // Cells config
    let cellsConfig = columnsSorted.map((title) => {
      if (title === "struct_org1") {
        return {
          key: title,
          name: title,
          editable: true,
          sortable: true,
          resizable: true,
          width: 110,
          editor: <DropDownEditor options={Object.keys(structures)} />,
        };
      } else if (title === "Uid") {
        return {
          key: title,
          name: title,
          editable: true,
          sortable: true,
          resizable: true,
          width: 150,
        };
      } else {
        return {
          key: title,
          name: title,
          sortable: true,
          resizable: true,
          width: 200,
        };
      }
    });

    this.setState({
      columns: cellsConfig,
    });
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const { usersList } = this.props;
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    if (
      Object.keys(updated)[0] === "Uid" &&
      this.state.rows[toRow].Uid !== updated.Uid
    ) {
      this.toggleDialogs("openedWarning");
      let count = false;

      for (let i = 1; i < usersList.length; i++) {
        if (usersList[i].Uid === updated.Uid) {
          count = true;
          let newUser = {
            Uid: usersList[i].Uid,
            email: usersList[i].email,
            first_name: capitalizeFirstLetter(usersList[i].first_name),
            last_name: capitalizeFirstLetter(usersList[i].last_name),
            struct_org1: "",
          };
          this.setState((state) => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
              rows[i] = { ...rows[i], ...newUser };
            }
            return { rows };
          });
        }
      }
      if (!count) {
        count = false;
        this.toggleDialogs("openedWarning");
      }
    } else {
      this.setState((state) => {
        const rows = state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
          rows[i] = { ...rows[i], ...updated };
        }
        return { rows };
      });
    }
    this.setState({
      unsavedChanges: true,
    });
  };

  addRow = () => {
    // add a new row on top of the list, and scroll to it
    let canvGrid = document.getElementsByClassName("react-grid-Canvas")[0];
    canvGrid.scrollTop = 0;
    let newRows = [...this.props.dtl];
    newRows.unshift({});
    this.setState((prevState) => ({
      rows: newRows,
    }));
  };

  sortRows = (initialRows, sortColumn, sortDirection) => {
    const comparator = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE"
      ? initialRows
      : [...initialRows].sort(comparator);
  };

  deleteRow = (row) => {
    this.setState((prevState) => ({
      rows: [
        ...prevState.rows.slice(0, this.props.dtl.indexOf(row)),
        ...prevState.rows.slice(this.props.dtl.indexOf(row) + 1),
      ],
      unsavedChanges: true,
    }));
  };

  getCellActions = (column, row) => {
    const firstNameActions = [
      {
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: () => {
          this.toggleDialogs("openedDialogDelete", row);
        },
      },
    ];
    const cellActions = {
      Uid: firstNameActions,
    };
    return cellActions[column.key];
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // prevent from sending empty lines
    let dataToSend = this.props.dtl.filter((value, index, arr) => {
      return value.Uid !== undefined;
    });
    // post request for dtl file update
    let formData = new FormData();
    formData.append("dtl", JSON.stringify(dataToSend));
    fetch(window.location.href, {
      method: "POST",
      headers: {
        "X-CSRFToken": window.props.csrfToken,
      },
      body: formData,
    })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        alert("An error has occurred, no data has been sent !");
      });
  };

  componentWillMount() {
    this.getData(this.props.dtl);
  }

  componentDidMount() {
    const comparator = (a, b) => {
      return a["last_name"] > b["last_name"] ? 1 : -1;
    };

    this.setState({
      rows: [...this.props.dtl].sort(comparator),
    });
  }

  render() {
    const { title, button } = this.props.classes;
    const {
      columns,
      openedDialogDelete,
      deletingRow,
      openedWarning,
      unsavedChanges,
      rows,
    } = this.state;
    return (
      <div className="App scopeEditor">
        <div>
          <h1 className={title}>DTL Scope Editor</h1>
          <i style={{ color: "#777" }}>
            Changes made on this interface are displayed in real time but DTL
            scopes are updated each night, between midnight and 6am (French
            Time). DTLs may then wait a maximum of 24 hours before seeing any
            change made here.
          </i>

          <div>
            <Button
              className={button}
              onClick={(event) => this.handleSubmit(event)}
              color="primary"
              variant="contained"
              id="buttonValidate"
            >
              Submit
            </Button>
            <Button
              className={button}
              onClick={this.addRow}
              color="primary"
              variant="contained"
              id="addingRowButton"
            >
              Add a DTL Scope
            </Button>
            {unsavedChanges && (
              <p
                className={"changeWarning"}
                style={{ color: "red", fontStyle: "italic" }}
              >
                You may have unsaved changes
              </p>
            )}
          </div>
          <ReactDataGrid
            ref={(datagrid) => {
              this.refGrid = datagrid;
            }}
            columns={columns}
            rowGetter={(i) => rows[i]}
            rowsCount={rows.length}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect={true}
            headerRowHeight={35}
            getCellActions={this.getCellActions}
            enableRowSelect={null}
            rowScrollTimeout={null}
            onGridSort={(sortColumn, sortDirection) => {
              this.setState({
                rows: this.sortRows(rows, sortColumn, sortDirection),
              });
            }}
          />
          <AlertDialog
            open={openedDialogDelete}
            handleClose={() => this.toggleDialogs("openedDialogDelete")}
            handleClickOpen={() => this.toggleDialogs("openedDialogDelete")}
            handleDeleteRow={this.deleteRow}
            deletingRow={deletingRow}
          />
          <SnackBarError
            open={openedWarning}
            handleClose={() => this.toggleDialogs("openedWarning")}
          />
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(ScopeEditor);
