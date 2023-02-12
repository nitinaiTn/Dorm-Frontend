import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Card, CardActions, CardContent, Button, Snackbar, Alert} from '@mui/material';
// components

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);

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

      <Container>
        <Stack>
          <Typography variant='h5' sx = {{pb: 3}}>ตั้งค่าหอพัก</Typography>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin= {{vertical: 'top', horizontal: 'right'}}
          >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              แก้ไขสำเร็จ
            </Alert>
          </Snackbar>
          <Card >
            <CardContent>
              <Typography>
                ใส่ตั้งค่า
              </Typography>
              <Typography>
                ทำการติดตั้ง
              </Typography>
              <Stack
                direction= "row"
                alignItem= "center"
                justifyContent= "end"
              >
                <Button onClick={handleClick}>Done</Button>
                <Button>Cancle</Button>
              </Stack>
            </CardContent>
            {/* <CardActions>
              
            </CardActions> */}
          </Card>
        </Stack>
      </Container>
    </>
  );
}
