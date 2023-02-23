import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Card, CardActions, CardContent, Button, Snackbar, Alert, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// components

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const [floor, setfloor] = useState('');
  const [selectedfloor, setSelectedfloor] = useState('');
  const [room, setRoom] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [meterState, setMeterState] = useState('');
  const [selectedMeterState, setSelectedMeterState] = useState('');

  const handleChangefloor = (event) => {
    const value = event.target.value;
    setfloor(value);
  };

  const handleChangeRoom = (event) => {
    setRoom(event.target.value);
  };

  const handleChangeDueDate = (event) => {
    setDueDate(event.target.value);
  };

  const handleChangeMeter = (event) => {
    setMeterState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSelectedfloor(floor);
    setSelectedRoom(room);
    setSelectedMeterState(meterState);
    setSelectedDueDate(dueDate);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Setting | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Stack>
              <Typography variant='h5' sx={{ pb: 3 }}>ตั้งค่าหอพัก</Typography>
              <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  แก้ไขสำเร็จ
                </Alert>
              </Snackbar>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Card >
              <CardContent>
                <Stack
                  alignItem="center"
                  justifyContent="start"
                  spacing={2}
                >
                  <Typography variant='h6'>สถานะตั้งค่าปัจจุบัน </Typography>
                  <Typography>จำนวนชั้น : {selectedfloor || '4'}</Typography>
                  <Typography>จำนวนห้องต่อชั้น : {selectedRoom || '10'}</Typography>
                  <Typography>รูปแบบการติดตั้งมิตเตอร์ : {selectedMeterState || 'Owner'}</Typography>
                  <Typography>วันเวลาออกใบชำระหนี้ค่าห้องพัก : {selectedDueDate || '25'}</Typography>
                  <Typography>ค่าสาธารณูปโภค: </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <Card sx={{ my: 5 }}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItem="center"
                  justifyContent="start"
                  spacing={2}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ mt: 2 }}>จำนวนชั้น</Typography>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Floor</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={floor}
                          label="Floor"
                          onChange={handleChangefloor}
                          style={{ width: '100px' }}
                        >
                          {Array.from({ length: 101 }, (_, index) => (
                            <MenuItem key={index} value={index}>{index}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ mt: 2 }}>จำนวนห้องต่อชั้น</Typography>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Rooms Per Floor</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={room}
                          label="Room"
                          onChange={handleChangeRoom}
                          style={{ width: '180px' }}
                        >
                          {Array.from({ length: 51 }, (_, index) => (
                            <MenuItem key={index} value={index}>{index}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ mt: 2 }}>รูปแบบการติดตั้งมิตเตอร์</Typography>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Meter</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={meterState}
                          label="Meter"
                          onChange={handleChangeMeter}
                        >
                          <MenuItem value={'AdminAll'}>มิเตอร์น้ำ มิเตอร์ไฟ จัดการโดยผู้ดูแลทั้งหมด</MenuItem>
                          <MenuItem value={'waterAdmin_elecUser'}>มิเตอร์น้ำ จัดการโดยผู้ดูแล มิเตอร์ไฟ จัดการโดยผู้ใช้งาน</MenuItem>
                          <MenuItem value={'waterUser_elecAdmin'}>มิเตอร์น้ำ จัดการโดยผู้ใช้งาน มิเตอร์ไฟ จัดการโดยผู้ดูแล</MenuItem>
                          <MenuItem value={'UserAll'}>มิเตอร์น้ำ มิเตอร์ไฟ จัดการโดยผู้ใช้งานทั้งหมด</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Typography sx={{ mt: 2 }}>วันเวลาออกใบชำระหนี้ค่าห้องพัก</Typography>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">dueDate</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={dueDate}
                          label="dueDate"
                          onChange={handleChangeDueDate}
                          style={{ width: '100px' }}
                        >
                          {Array.from({ length: 32 }, (_, index) => (
                            <MenuItem key={index} value={index}>{index}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                  </Stack>
                </Stack>
              </CardContent>
              <CardActions >
                <Button onClick={handleSubmit}>ยืนยัน</Button>
                <Button>ลบ</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
