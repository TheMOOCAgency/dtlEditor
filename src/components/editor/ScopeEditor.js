import React from "react";
import ReactDataGrid from "react-data-grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Editors } from "react-data-grid-addons";
import Button from "@material-ui/core/Button";
import AlertDialog from "../dialog/AlertDialog";
import SnackBarError from "../dialog/SnackBarError";
import { withStyles } from "@material-ui/styles";
import styles from "../../assets/styleHook.js";

const { DropDownEditor } = Editors;

const struct_org = {};
const struct_org1 = [];

class ScopeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: null,
      rows: null,
      isLoading: true,
      openedDialogDelete: false,
      deletingRow: {},
      openedWarning: false,
      changing: false,
      height: window.innerHeight,
    };
    this.getData = this.getData.bind(this);
    this.getDataStruct = this.getDataStruct.bind(this);
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
    this.sortRows = this.sortRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addRow = this.addRow.bind(this);
    this.getCellActions = this.getCellActions.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  onResize() {
    this.setState({
      height: window.innerHeight,
    });
  }
  closeWarning = () => {
    this.setState({
      openedWarning: false,
    });
  };

  closeDialog = () => {
    this.setState({
      openedDialogDelete: false,
    });
  };

  openDialog = (row) => {
    this.setState({
      openedDialogDelete: true,
      deletingRow: row,
    });
  };

  getData() {
    const { dtl, struct_org } = this.props;
    // Uid;last_name;first_name;email;struct_org1;
    let columnsSorted = [
      Object.keys(dtl[0])[2],
      Object.keys(dtl[0])[1],
      Object.keys(dtl[0])[0],
      Object.keys(dtl[0])[6],
      Object.keys(dtl[0])[4],
    ];
    let columnsArray = columnsSorted.map((data) => {
      if (data === "struct_org1") {
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable: true,
          width: 110,
          editor: <DropDownEditor options={struct_org1} />,
        };
      } else if (data === "Uid") {
        return {
          key: data,
          name: data,
          editable: true,
          sortable: true,
          resizable: true,
          width: 150,
        };
      } else {
        return {
          key: data,
          name: data,
          sortable: true,
          resizable: true,
          width: 200,
        };
      }
    });

    this.setState({
      columns: columnsArray,
      rows: dtl,
      struct_org: this.getDataStruct(struct_org),
      isLoading: false,
    });
  }

  getDataStruct(result) {
    Object.keys(result).forEach((x) => {
      if (struct_org1.indexOf(result[x].struct_org1) === -1) {
        if (result[x].struct_org1 !== undefined) {
          struct_org1.push(result[x].struct_org1);
        }
      }
    });

    struct_org1.forEach((x) => {
      Object.keys(result).forEach((x2) => {
        if (x === result[x2].struct_org1) {
          if (struct_org[x] === undefined) {
            struct_org[x] = [];
          }
        }
      });
    });
    for (var property in struct_org) {
      struct_org[property].push("");
    }
    console.log(struct_org);

    struct_org1.push("all");
    struct_org1.sort();
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const { usersList } = this.props;
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    if (
      Object.keys(updated)[0] === "Uid" &&
      this.state.rows[toRow].Uid !== updated.Uid
    ) {
      this.closeWarning();
      let count = false;
      for (let i = 1; i < usersList.length; i++) {
        if (usersList[i].Uid === updated.Uid) {
          count = true;
          let newUser = {
            Uid: usersList[i].Uid,
            email: usersList[i].email,
            first_name: capitalizeFirstLetter(usersList[i].first_name),
            last_name: capitalizeFirstLetter(usersList[i].last_name),
            role: usersList[i].role,
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
        this.setState({
          openedWarning: true,
        });
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
      changing: true,
    });
  };
  addRow() {
    let canvGrid = document.getElementsByClassName("react-grid-Canvas")[0];
    canvGrid.scrollTop = 0;
    let newRows = [...this.state.rows];
    newRows.unshift({});
    this.setState((prevState) => ({
      rows: newRows,
    }));
  }

  sortRows = (initialRows, sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE"
      ? initialRows
      : [...initialRows].sort(comparer);
  };

  deleteRow(row) {
    this.setState((prevState) => ({
      rows: [
        ...prevState.rows.slice(0, this.state.rows.indexOf(row)),
        ...prevState.rows.slice(this.state.rows.indexOf(row) + 1),
      ],
      changing: true,
    }));
  }

  getCellActions(column, row) {
    const firstNameActions = [
      {
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: () => {
          this.openDialog(row);
        },
      },
    ];
    const cellActions = {
      Uid: firstNameActions,
    };
    return cellActions[column.key];
  }

  handleSubmit() {
    let dataToSend = this.state.rows.filter((value, index, arr) => {
      return value.Uid !== undefined;
    });
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
        window.location.reload();
      })
      .catch(function (error) {
        alert("An error has occurred, no data has been sent !");
      });
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getData(this.props.dtl);
  }

  componentDidMount() {
    const comparer = (a, b) => {
      return a["last_name"] > b["last_name"] ? 1 : -1;
    };
    this.setState({
      rows: [...this.state.rows].sort(comparer),
    });
    window.addEventListener("resize", this.onResize);
  }

  render() {
    const { title, button } = this.props.classes;
    const {
      isLoading,
      columns,
      rows,
      height,
      openedDialogDelete,
      deletingRow,
      openedWarning,
    } = this.state;
    return (
      <div className="App scopeEditor">
        {isLoading ? (
          <div className="circularProgress">
            <CircularProgress color="primary" />
          </div>
        ) : (
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
                onClick={this.handleSubmit}
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
              {this.state.changing && (
                <p
                  className={"changeWarning"}
                  style={{ color: "red", fontStyle: "italic" }}
                >
                  You may have unsaved changes{" "}
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
              minHeight={height - 260}
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
              handleClose={this.closeDialog}
              handleClickOpen={this.openDialog}
              handleDeleteRow={this.deleteRow}
              deletingRow={deletingRow}
            />
            <SnackBarError
              open={openedWarning}
              handleClose={this.closeWarning}
            />
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(ScopeEditor);
