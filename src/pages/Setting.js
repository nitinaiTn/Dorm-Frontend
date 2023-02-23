import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Card, CardActions, CardContent, Button, Snackbar, Alert, TextField, Grid } from '@mui/material';
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
                  direction="row"
                  alignItem="center"
                  justifyContent="start"
                  spacing={2}
                >
                  <Typography>สถานะตั้งค่าหอพักปัจจุบัน</Typography>
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
                    <TextField>
                      s
                    </TextField>
                    <TextField>
                      s
                    </TextField>
                    <TextField>
                      s
                    </TextField>
                    <TextField>
                      s
                    </TextField>
                    <TextField>
                      s
                    </TextField>
                  </Stack>

                  <Stack spacing={2}>
                    <TextField>
                      s
                    </TextField>
                    <TextField>
                      d
                    </TextField>
                    <TextField>
                      d
                    </TextField>
                    <TextField>
                      d
                    </TextField>
                    <TextField>
                      d
                    </TextField>
                  </Stack>
                </Stack>
              </CardContent>
              <CardActions sx>
                <Button>Hello</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
