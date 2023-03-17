import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  InputLabel,
  Grid
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'subjectName', label: 'เรื่องที่แจ้ง', alignRight: false },
  { id: 'name', label: 'ชื่อผู้แจ้ง', alignRight: false },
  { id: 'property', label: 'ตึก', alignRight: false },
  { id: 'room', label: 'ห้อง', alignRight: false },
  { id: 'date', label: 'วันที่แจ้ง', alignRight: false },
  { id: 'status', label: 'สถานะการซ่อม', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [ToDetail, setToDetail] = useState(null);

  const [ToEdit, setToEdit] = useState(null);

  const [ToDelete, setToDelete] = useState(null);

  const [openCreate, setOpenCreate] = useState(false)

  // const [stateData, setStateData] = useState({ name: '', request_text: '', dateCreate: '', status: '', property: '', room: ''});

  const handleClickOpen = () => {
    setOpenCreate(true)
  }

  const handleClose = () => {
    setOpenCreate(false)
  }

  const [loading, setLoading] = useState(false)

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://dorm-api.vercel.app/api/maintenance");
      const data = await res.json();
      setData(data);
      console.log(data)
    }
    fetchData();
  }, []);

  const maintainLIST = data.map(item => ({
    id: item.request_id,
    userID: item.user_id,
    name: item.name,
    lastName: item.lastName,
    status: item.request_status,
    property: item.property_id,
    room: item.room_id,
    requestTitle: item.request_title,
    requestText: item.request_text,
    dateCreate: item.date_created,
    imageURL: item.imageURL
  }));

  const maintainStateList = [
    { value: 'no open', label: 'รออนุมัติ' },
    { value: 'closed', label: 'เสร็จสิ้น' },
    { value: 'in progress', label: 'กำลังดำเนินการ' },
  ];

  const handleOpenMenu = (event, id, name, requestTitle, requestText, dateCreate, imageURL) => {
    setOpen(event.currentTarget);
    setSelected([id, name, requestTitle, requestText, dateCreate, imageURL]);
    console.log(selected)
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = maintainLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDetailClick = (id) => {
    console.log(id)
    setToDetail(id);
  };

  const imageUrlss = "http://res.cloudinary.com/dklgtawp3/image/upload/v1678914622/Dorm/1678914619531.jpg"

  const handleDetailConfirm = () => {
    // fetch(`https://dorm-api.vercel.app/api/maintenance/${ToDelete}`, {
    //   method: 'DELETE'
    // })
    //   .then(() => {
    //     // Close the dialog
    //     setToDelete(null);
    //   })
    //   .catch(error => console.error(error));
  };

  const handleEditClick = (id) => {
    setToEdit(id);
  };

  const handleEditSubmit = () => {
    // event.preventDefault();
    const status = {
      status: ToEdit.meter_state
    }
    console.log(status)
    fetch(`https://dorm-api.vercel.app/api/maintenance/updateStatus/${selected[0]}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status),
    })
      .then((response) => response.json())
      .then((data) => {
        setToEdit(null);
        console.log("Edit Succes")
      })
      .catch((error) => console.log(error));
  };


  const handleDeleteClick = (id) => {
    console.log(id)
    setToDelete(id);
  };

  const handleDeleteConfirm = () => {
    fetch(`https://dorm-api.vercel.app/api/maintenance/${ToDelete}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Close the dialog
        setToDelete(null);
      })
      .catch(error => console.error(error));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - maintainLIST.length) : 0;

  const filteredUsers = applySortFilter(maintainLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;


  return (
    <>
      <Helmet>
        <title> แจ้งซ่อม </title>
      </Helmet>

      <Dialog
        open={Boolean(ToDetail)}
        onClose={() => setToDetail(null)}
      >
        <DialogTitle>รายละเอียดปัญหา</DialogTitle>
        <DialogContent>
          <DialogContentText>
            หัวเรื่องปัญหา {selected[2]}
          </DialogContentText>
          <DialogContentText>
            เนื้อหาปัญหา {selected[3]}
          </DialogContentText>
          <DialogContentText>
            วันที่แจ้ง {selected[4]}
          </DialogContentText>
          <DialogContentText>
            ชื่อผู้แจ้ง {selected[1]}
          </DialogContentText>
          <img
            src={selected[5]}
            alt="new"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDetail(null)}>Done</Button>
          {/* <Button onClick={handleDeleteConfirm} color="error">ลบ</Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(ToEdit)} onClose={() => setToEdit(null)}>
        <DialogTitle>เลือกสถานะการซ่อม</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <TextField
                label="Property ID"
                variant="outlined"
                fullWidth
                onChange={(event) =>
                  setToEdit({
                    property_id: event.target.value,
                  })
                }
              />
            </Grid> */}
            <Grid item xs={12}>
              <InputLabel variant="h1">สถานะการซ่อม</InputLabel>
              <Select
                fullWidth
                onChange={(event) =>
                  setToEdit({
                    meter_state: event.target.value,
                  })
                }
              >
                {maintainStateList.map((id) => (
                  <MenuItem key={id.value} value={id.value}>
                    {id.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <DialogActions>
            <Button onClick={() => setToEdit(null)}>ยกเลิก</Button>
            <Button onClick={() => handleEditSubmit()} variant="contained">
              บันทึก
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>


      <Dialog
        open={Boolean(ToDelete)}
        onClose={() => setToDelete(null)}
      >
        <DialogTitle>ลบรายการแจ้งซ่อม?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจว่าต้องการลบรายการแจ้งซ่อมนี้ไหม?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>ยกเลิก</Button>
          <Button onClick={handleDeleteConfirm} color="error">ลบ</Button>
        </DialogActions>
      </Dialog>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            แจ้งซ่อม
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick ={handleClickOpen}>
            เพิ่มเรื่องแจ้ง
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={maintainLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, requestTitle, requestText, userID, name, lastName, status, property, room, dateCreate, imageURL } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {requestText}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{name} {lastName}</TableCell>

                        <TableCell align="left">{property}</TableCell>

                        <TableCell align="left">{room}</TableCell>

                        <TableCell align="left">{dateCreate}</TableCell>

                        <TableCell align="left">
                          <Label color={status === 'closed' ? 'error' : status === 'no open' ? 'warning' : 'success'}>{status === 'closed' ? 'เสร็จสิ้น' : status === 'no open' ? 'รออนุมัติ' : 'กำลังดำเนินการ'}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => { handleOpenMenu(event, id, name, requestTitle, requestText, dateCreate, imageURL) }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            ไม่มีข้อมูลให้แสดง
                          </Typography>

                          <Typography variant="body2">
                            ไม่พบข้อมูล &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> โปรดป้อนข้อมูลที่ต้องการค้นหาใหม่อีกครั้ง
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={maintainLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => { handleDetailClick(selected[0]) }}>
          <Iconify icon={'ph:magnifying-glass-bold'} sx={{ mr: 2 }} />
          ดูรายละเอียด
        </MenuItem>

        <MenuItem onClick={() => { handleEditClick(selected[0]) }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          แก้ไข
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => { handleDeleteClick(selected[0]) }} >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          ลบ
        </MenuItem>
      </Popover>
    </>
  );
}
