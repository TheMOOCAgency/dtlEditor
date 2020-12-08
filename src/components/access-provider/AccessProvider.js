import React from "react";
import ReactDataGrid from "react-data-grid";
import Button from "@material-ui/core/Button";
import styles from "../../assets/styleHook.js";
import { withStyles } from "@material-ui/styles";
import SnackBar from "./dialog/SnackBar";
import TextField from "@material-ui/core/TextField";
import { CSVLink } from "react-csv";
class AccessProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsGrid: [],
      rows: [],
      has_access: [],
      dataToCSV: [],
      openedSnackBarWarning: false,
      openedSnackBarSuccess: false,
      snackBarHandler: {
        open: false,
        type: "",
        message: "",
      },
      height: window.innerHeight,
      order: {
        column: "last_name",
        direction: "ASC",
      },
    };
    this.onGrantAccess = this.onGrantAccess.bind(this);
    this.onRemoveAccess = this.onRemoveAccess.bind(this);
    this.onResize = this.onResize.bind(this);
    this.downloadCsv = this.downloadCsv.bind(this);
  }
  onResize() {
    this.setState({
      height: window.innerHeight,
    });
  }
  getColumns() {
    return this.props.columnNeeded.map((column) => ({
      key: column,
      name: column,
      sortable: true,
      resizable: true,
      width: column === "email" ? 270 : 170,
    }));
  }
  getRows(listAccess) {
    let rowFetched = this.props.cultureDigital.map((row) => {
      return listAccess.includes(row.Uid)
        ? { ...row, has_access: "yes" }
        : { ...row, has_access: "no" };
    });
    return this.onSortRows(
      rowFetched,
      this.state.order.column,
      this.state.order.direction
    );
  }
  onSortRows = (initialRows, sortColumn, sortDirection) => {
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
  onGrantAccess() {
    if (
      document
        .getElementById("listUsersToChange")
        .value.split("\n")
        .some((Uid) => {
          return Uid !== "";
        })
    ) {
      let warning = [];
      let rowUid = this.state.rows.map((row) => {
        return row.Uid;
      });
      let stringValue = document
        .getElementById("listUsersToChange")
        .value.split("\n")
        .filter((Uid) => {
          if (rowUid.includes(Uid)) {
            if (!this.state.has_access.includes(Uid)) {
              return Uid;
            }
            return null;
          } else {
            if (Uid !== "") {
              warning.push(Uid);
            }
            return null;
          }
        });
      stringValue = [...this.state.has_access, ...stringValue];
      this.setState(
        {
          rows: this.getRows(stringValue),
          has_access: [...stringValue],
        },
        () => {
          this.handleSubmit(warning);
        }
      );
    }
  }
  onRemoveAccess() {
    //********************************************A faire le checking d'erreur */
    if (
      document
        .getElementById("listUsersToChange")
        .value.split("\n")
        .some((Uid) => {
          return Uid !== "";
        })
    ) {
      let warning = [];
      let rowUid = this.state.rows.map((row) => {
        return row.Uid;
      });
      let stringValue = document
        .getElementById("listUsersToChange")
        .value.split("\n")
        .filter((Uid) => {
          if (rowUid.includes(Uid)) {
            if (this.state.has_access.includes(Uid)) {
              return Uid;
            }
            return null;
          } else {
            if (Uid !== "") {
              warning.push(Uid);
            }
            return null;
          }
        });
      stringValue = this.state.has_access.filter((Uid) => {
        return !document
          .getElementById("listUsersToChange")
          .value.split("\n")
          .includes(Uid);
      });
      this.setState(
        {
          rows: this.getRows(stringValue),
          has_access: [...stringValue],
        },
        () => {
          this.handleSubmit(warning);
        }
      );
    }
  }
  downloadCsv() {
    var rowsRaw = this.props.cultureDigital.map(function (cultureDigitalRow) {
      return { ...cultureDigitalRow, has_access: "no" };
    }, this);

    var columnToSend = [
      "Uid",
      "last_name",
      "second_last_name",
      "first_name",
      "profession",
      "society",
      "manager",
      "toBeDeleted",
      "role",
      "location",
      "email",
      "function",
      "language",
      "country",
      "struct_org1",
      "struct_org2",
      "struct_org3",
      "struct_org4",
      "struct_org5",
      "struct_org6",
      "struct_org7",
      "struct_org8",
      "struct_org9",
      "struct_orgA",
      "struct_orgB",
      "struct_orgC",
      "detailedResults",
      "job_family",
      "has_access",
    ];

    var dataToDownload = rowsRaw.map(function (cultureDigitalRow) {
      this.state.rows.forEach(function (stateRow) {
        if (cultureDigitalRow.Uid === stateRow.Uid) {
          if (stateRow.has_access === "yes") {
            cultureDigitalRow.has_access = "yes";
          }
        }
      });
      return cultureDigitalRow;
    }, this);

    dataToDownload = dataToDownload.map(function (obj) {
      var tempil = [];
      columnToSend.map(function (el) {
        return tempil.push(obj[el]);
      });
      return tempil;
    }, this);
    dataToDownload.unshift(columnToSend);

    this.setState({
      dataToCSV: JSON.parse(JSON.stringify(dataToDownload)),
    });
  }

  handleSubmit(warning) {
    const that = this;
    let dataToCSVFormat = this.state.has_access.map((data) => {
      return { Uid: data };
    });
    let formData = new FormData();
    formData.append("invited", JSON.stringify(dataToCSVFormat));

    fetch(window.location.href, {
      method: "POST",
      headers: {
        "X-CSRFToken": window.props.csrfToken,
      },
      body: formData,
    })
      .then(function (data) {
        document.getElementById("listUsersToChange").value = "";
        if (warning && warning.length > 0) {
          that.setState({
            snackBarHandler: {
              open: true,
              type: "warning",
              message: "Incorrect Uid(s): \r\n - " + warning.join(" \r\n - "),
            },
          });
        } else {
          that.setState({
            snackBarHandler: {
              open: true,
              type: "success",
              message: "Success !",
            },
          });
        }
      })
      .catch(function (error) {
        alert("An error has occurred, no data has been sent !");
      });
  }
  componentWillMount() {
    if (this.state.rows <= 0 || this.state.columnsGrid <= 0) {
      this.setState({
        columnsGrid: this.getColumns(),
        has_access: [...this.props.accessUsers],
        rows: this.getRows(this.props.accessUsers),
      });
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.onResize);
  }
  render() {
    return (
      <div className="App Accessprovider">
        <h1 className={this.props.classes.title}>
          Digital Barometer Invitations
        </h1>
        <TextField
          id="listUsersToChange"
          multiline
          rowsMax="5"
          variant="outlined"
          placeholder="Type here(or double click on) UID(s) of the user(s) you want to grant or remove access to (one UID per line)"
          className={this.props.classes.textearea}
        />

        <div>
          <Button
            className={this.props.classes.button}
            onClick={this.onGrantAccess}
            color="primary"
            variant="contained"
            id="buttonValidate">
            Grant Access
          </Button>
          <Button
            className={this.props.classes.button}
            onClick={this.onRemoveAccess}
            color="secondary"
            variant="contained"
            id="addingRowButton">
            Remove access
          </Button>
          <Button
            className={this.props.classes.button}
            style={{ backgroundColor: "green", color: "white" }}
            variant="contained"
            id="downloadDtat">
            <CSVLink
              style={{ color: "white", textDecoration: "none" }}
              data={this.state.dataToCSV}
              onClick={this.downloadCsv}>
              {" "}
              Download data
            </CSVLink>
          </Button>
        </div>
        <ReactDataGrid
          ref="rows"
          columns={this.state.columnsGrid}
          rowGetter={(i) => this.state.rows[i]}
          rowsCount={this.state.rows.length}
          enableCellSelect={true}
          headerRowHeight={35}
          minHeight={this.state.height - 305}
          enableRowSelect={null}
          rowScrollTimeout={null}
          onRowDoubleClick={(e) => {
            let textInput = document.getElementById("listUsersToChange");
            textInput.focus();
            textInput.scrollTop = textInput.scrollHeight;
            textInput.value = textInput.value + this.state.rows[e].Uid + "\n";
          }}
          onGridSort={(sortColumn, sortDirection) => {
            this.setState({
              order: { column: sortColumn, direction: sortDirection },
              rows: this.onSortRows(this.state.rows, sortColumn, sortDirection),
            });
          }}
        />
        <SnackBar
          snackBarState={this.state.snackBarHandler}
          handleClose={() => {
            this.setState({
              snackBarHandler: {
                opening: false,
                type: this.state.snackBarHandler.type,
                message: "",
              },
            });
          }}
        />
      </div>
    );
  }
}
export default withStyles(styles)(AccessProvider);
