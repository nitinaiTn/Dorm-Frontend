import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { filter } from 'lodash';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid,
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
  TableHead
} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { UserContext } from '../App';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'room', label: 'ห้อง', alignRight: false },
  { id: 'property', label: 'ตึก', alignRight: false },
  { id: 'name', label: 'ชื่อผู้พักอาศัย', alignRight: false },
  { id: 'status', label: 'สถานะห้อง', alignRight: false },
  { id: 'cost', label: 'ค่าที่พักรายเดือน', alignRight: false },
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

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [utilitydata, setUtilityData] = useState([]);

  const [roomData, setRoomData] = useState([]);

  const {userData} = useContext(UserContext)
  
  useEffect(() => {
    async function fetchRoom() {
      console.log(userData)
      const res = await fetch(`https://dorm-api.vercel.app/api/room/${userData.user.property_id}`);
      const data = await res.json();
      setRoomData(data);
      console.log(roomData)
    }
    fetchRoom();

    async function fetchUtility() {
      const res = await fetch("https://dorm-api.vercel.app/api/utility");
      const data = await res.json();
      setUtilityData(data);
      console.log(data)
    }
    fetchUtility();

    async function fetchData() {
      const res = await fetch("https://dorm-api.vercel.app/api/bill");
      const data = await res.json();
      setData(data);
      console.log(data)
    }
    fetchData();
    
  }, []);

     // Check if userData has been initialized before rendering the component
     if (!userData) {
      return null; // or some other fallback component
    }
  
    const { name, lastname, email } = userData.user;

  const maintainLIST = data.map(item => ({
    id: item.request_id,
    userID: item.user_id,
    name: item.name,
    lastName: item.lastName,
    status: item.request_status,
    property: item.property_id,
    room: item.room_id,
  }));

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - maintainLIST.length) : 0;

  const filteredUsers = applySortFilter(maintainLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">

        <Stack direction={'row'} sx={{justifyContent: 'space-between'}}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            สวัสดี, {name}
          </Typography>

          {/* <Typography variant="h4" sx={{ mb: 5 }}>
            {formattedDateTime} 
          </Typography> */}

        </Stack>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="อัตราการใช้น้ำและไฟฟ้าในหอพักทั้งหมด"
              subheader="รายการ 6 เดือนที่ผ่านมา"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
              ]}
              chartData={[
                {
                  name: 'ค่าน้ำ',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 21, 44, 22, 30],
                },
                {
                  name: 'ค่าไฟ',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 22, 30],
                },
                // {
                //   name: 'Team B',
                //   type: 'area',
                //   fill: 'gradient',
                //   data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                // },
                // {
                //   name: 'Team C',
                //   type: 'line',
                //   fill: 'solid',
                //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                // },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="สถานะผู้เช่าปัจจุบัน"
              chartData={[
                { label: 'อาศัยอยู่', value: 4344 },
                // { label: 'Asia', value: 5435 },
                { label: 'ติดจอง', value: 1443 },
                { label: 'ออก', value: 1550 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                // theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <Card>
              {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
              {/* <TableHead>
                
              </TableHead> */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" sx={{ my: 2, ml: 3 }}>
                    สถานะห้อง
                  </Typography>
                  <Typography variant="h6" sx={{ my: 2, mr: 3 }}>
                    ห้องทั้งหมด : {roomData.length} ห้องว่าง : {roomData.filter(room => room.room_status === 'free').length}
                  </Typography>
                 </Stack>

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
                        const { id, requestText, userID, name, lastName, status, property, room} = row;
                        const selectedUser = selected.indexOf(name) !== -1;

                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} /> */}
                            </TableCell>
{/* 
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={name} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {requestText}
                                </Typography>
                              </Stack>
                            </TableCell> */}

                            <TableCell align="left">{room}</TableCell>

                            <TableCell align="left">{property}</TableCell>

                            <TableCell align="left">{name} {lastName}</TableCell>

                            <TableCell align="left">{status}</TableCell>

                            <TableCell align="left">{property}</TableCell>

                            {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
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
                                ไม่มีข้อมูล
                              </Typography>

                              <Typography variant="body2">
                                ไม่มีข้อมูล &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> ลองใส่ข้อมูลที่ต้องการค้นหาอีกครั้ง
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
            {/* <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="รายการเข้า-ออกหอพัก"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
