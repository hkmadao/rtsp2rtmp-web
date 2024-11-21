import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import LinkOffIcon from "@material-ui/icons/LinkOff";
import LinkIcon from "@material-ui/icons/Link";
import ActionList from "./ActionList";
import CameraEdit from "./CameraEdit";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Switch from "@material-ui/core/Switch";
import API from "../api/Api";

const columns = [
  {
    id: "id",
    label: "id",
    minWidth: 20,
  },
  {
    id: "code",
    label: "摄像头编号",
    minWidth: 20,
  },
  {
    id: "rtspURL",
    label: "rtspURL",
  },
  {
    id: "rtmpURL",
    label: "rtmpURL",
  },
  {
    id: "playAuthCode",
    label: "播放权限码",
  },
  {
    id: "onlineStatus",
    label: "在线状态",
    format: (value) => (value && value === 1 ? <LinkIcon /> : <LinkOffIcon />),
  },
  {
    id: "enabled",
    label: "启用状态",
    format: (value) => {
      return (
        <Switch
          checked={value === 1}
          id="enabled"
          color="primary"
          name="enabled"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      );
    },
  },
  {
    id: "live",
    label: "直播状态",
    format: (value) => {
      return (
        <Switch
          checked={value === 1}
          id="live"
          color="primary"
          name="live"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      );
    },
  },
  {
    id: "saveVideo",
    label: "录像状态",
    format: (value) => {
      return (
        <Switch
          checked={value === 1}
          id="saveVideo"
          color="primary"
          name="saveVideo"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      );
    },
  },
  {
    id: "rtmpPushStatus",
    label: "Rtmp推送状态：",
    format: (value) => {
      return (
        <Switch
          checked={value === 1}
          id="rtmpPushStatus"
          color="primary"
          name="rtmpPushStatus"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      );
    },
  },
  {
    id: "action",
    label: "操作",
    minWidth: 150,
    format: (value, row, callBack) => {
      return <ActionList row={row} callBack={callBack} />;
    },
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  container: {
    minHeight: 400,
  },
  dropdown: {
    position: "absolute",
    top: 28,
    right: 0,
    left: 0,
    zIndex: 0,
    border: "0px solid",
    padding: 1,
    backgroundColor: "#f8f8f8",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function CameraList() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  var rows, setRows;
  [rows, setRows] = React.useState([]);
  var editRow = {
    id: "",
    code: "",
    rtspURL: "rtsp://192.168.0.10:554/1",
    rtmpURL: "rtmp://127.0.0.1:1935/code/authcode",
    playAuthCode: "",
    onlineStatus: 0,
    enabled: 1,
    saveVideo: 0,
    live: 1,
    rtmpPushStatus: 1,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getPageList = () => {
    API.cameraList().then((res) => {
      if (res.code === 1) {
        rows.splice(0);
        rows.push(...res.data.page);
        setRows([]);
        setRows(rows);
      }
    });
  };

  let editRef = React.createRef();
  function edit() {
    editRef.current.handleClickOpen();
  }

  React.useEffect(getPageList, []);

  return (
    <Paper className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Button variant="contained" onClick={edit}>
            创建
          </Button>
          <Typography variant="h6" className={classes.title}>
            摄像头列表
          </Typography>
        </Toolbar>
      </AppBar>
      <CameraEdit
        row={editRow}
        type="add"
        callBack={getPageList}
        onRef={editRef}
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format
                            ? column.format(value, row, getPageList)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
