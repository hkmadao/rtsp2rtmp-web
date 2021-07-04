import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {NavLink} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Switch from '@material-ui/core/Switch';
import Moment from 'moment'
import ActionList from './ActionList';
import CameraShareEdit from './CameraShareEdit';
import API from '../api/Api';

const columns = [
  { 
    id: 'id',
    label: 'id',
    minWidth: 170
  },
  {
    id: 'name',
    label: '分享名称',
  },
  {
    id: 'authCode',
    label: '权限码',
  },
  {
    id: 'startTime',
    label: '开始时间',
    format: (value) => {
        let offset = new Date().getTimezoneOffset()
        return value?Moment(value).format("YYYY-MM-DD HH:mm"):"---"
    }
  },
  {
    id: 'deadline',
    label: '截止时间',
    format: (value) => {
      let offset = new Date().getTimezoneOffset()
        return value?Moment(value).format("YYYY-MM-DD HH:mm"):"---"
    }
  },
  {
    id: 'enabled',
    label: '启用状态',
    format: (value) => {
      return <Switch
              checked={value === 1}
              id="enabled"
              color="primary"
              name="enabled"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
    }
  },
  {
    id: 'action',
    label: '操作',
    format: (value,row,camera,callBack) => {
      row.cameraId = camera.id
      row.cameraCode = camera.code
      return <ActionList row={row} callBack={callBack} />},
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
  },
  container: {
    minHeight: 400,
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 0,
    border: '0px solid',
    padding: 1,
    backgroundColor: '#f8f8f8',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function CameraShareList(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows,setRows]  = React.useState([]);
  const [editRow,setEditRow]  = React.useState({
    id: "",
    cameraId: "",
    cameraCode: "",
    name: "",
    authCode: "",
    enabled: 1,
    startTime: "",
    deadline: "",
  });
  const [camera,setCamera] = React.useState({})

  const getQueryString = (name) => {
    let reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.hash.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getPageList = ()=>{
    let cameraId = getQueryString("cameraId")
    API.cameraDetail({id:cameraId})
    .then(res => {
      if (res.code === 1) {
        let camera = res.data
        if (!camera){
          return
        }
        setCamera(camera)
        let editRowNew = editRow
        editRowNew.cameraId = camera.id
        editRowNew.cameraCode = camera.code
        setEditRow(editRowNew)
        API.cameraShareList({cameraId:camera.id})
        .then(res => {
          if (res.code === 1) {
            rows.splice(0);
            rows.push(...res.data.page)
            setRows([])
            setRows(rows)
          }
        });
      }
    });
    
  }

  let editRef = React.createRef();
  function edit() {
    setEditRow({})
    setEditRow(editRow)
    editRef.current.handleClickOpen();
  }

  React.useEffect(getPageList,[]) 

  return (
    
    <Paper className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Button variant="contained" onClick={edit}>
            创建
          </Button>
          <Typography variant="h6" className={classes.title}>
          摄像头: {camera.code?camera.code:'--'} 分享列表
          </Typography>
          <Button variant="contained">
            <NavLink exact to={{
              pathname: "/",
              // search: "?sort=name",
              // hash: "#camerashare",
              state: { }
            }}>返回</NavLink>
          </Button>
        </Toolbar>
      </AppBar>
      <CameraShareEdit row={editRow} type="add" callBack={getPageList} onRef={editRef}/>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value,row,camera,getPageList) : value}
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
