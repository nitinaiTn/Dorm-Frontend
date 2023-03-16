import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState, useContext } from 'react';
// // @mui
import {
  Container, Stack, Typography, Card, CardActions, CardContent, Button,
  Snackbar, Alert, TextField, Grid, FormControl, InputLabel, Select, MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
// components
import { UserContext } from '../App';


export default function ProductsPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ property_id: '', owner_id: '', number_of_floors: '', number_of_rooms: '', meter_state: '', Unit_bath_water: '', Unit_bath_elect: '' });
  const [key, setKey] = useState(0); // add key state variable
  const [postToEdit, setPostToEdit] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const { userData } = useContext(UserContext)

  useEffect(() => {
    // Fetch the list of posts when the component mounts
    fetch(`https://dorm-api.vercel.app/api/property/${userData.user.user_id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .then(() => { console.log('Succec fetch') })
  }, [key]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create a new post object with the provided title and content
    const post = {
      property_id: newPost.property_id,
      owner_id: newPost.owner_id,
      address: "711/33 moo 8 ",
      number_of_floors: newPost.number_of_floors,
      number_of_rooms: newPost.number_of_rooms,
      NameProperty: "Dorm1",
      meter_state: newPost.meter_state,
      Unit_bath_water: newPost.Unit_bath_water,
      Unit_bath_elect: newPost.Unit_bath_elect
    };
    // Send a POST request to the create post endpoint
    fetch('https://dorm-api.vercel.app/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new post to the posts state
        setPosts([...posts, data]);
        // Clear the form fields
        setNewPost({ user_id: '', post_title: '', post_text: '' });
        setKey((prevKey) => prevKey + 1); // update key to force refresh
      });
  };

  const handleDelete = (propertyId) => {
    // Send a DELETE request to the API endpoint
    fetch(`https://dorm-api.vercel.app/api/property/${propertyId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        // Remove the deleted post from the posts state
        const updatedPosts = posts.filter(post => post.property_id !== propertyId);
        setPosts(updatedPosts);
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  }

  const handleEditSubmit = (event) => {
    event.preventDefault();
  
    fetch(`https://dorm-api.vercel.app/api/property/${postToEdit.property_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postToEdit),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the posts state with the updated post
        const updatedPosts = posts.map((post) =>
          post.property_id === data.property_id ? data : post
        );
        setPosts(updatedPosts);
        setPostToEdit(null);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
  };

  const handleDeleteConfirm = () => {
    fetch(`https://dorm-api.vercel.app/api/property/${postToDelete}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Remove the deleted post from the state
        const updatedPosts = posts.filter(post => post.property_id !== postToDelete);
        setPosts(updatedPosts);
        // Close the dialog
        setPostToDelete(null);
      })
      .catch(error => console.error(error));
  };

  if (!userData) {
    return null; // or some other fallback component
  }

  const { name, lastname, email, userID } = userData.user;
  console.log(userData.user)

  return (
    <div>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h2" gutterBottom>
          ตั้งค่าหอพัก
        </Typography>

        <Button variant="outlined" sx={{ mb: 3 }}>create</Button>

        <Dialog open={Boolean(postToEdit)} onClose={() => setPostToEdit(null)}>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditSubmit}>
              <TextField
                label="Property ID"
                value={postToEdit?.property_id || ''}
                onChange={(e) =>
                  setPostToEdit((prev) => ({ ...prev, property_id: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Number of Floors"
                value={postToEdit?.number_of_floors || ''}
                onChange={(e) =>
                  setPostToEdit((prev) => ({ ...prev, number_of_floors: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Number of Rooms"
                value={postToEdit?.number_of_rooms || ''}
                onChange={(e) =>
                  setPostToEdit((prev) => ({ ...prev, number_of_rooms: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Meter State"
                value={postToEdit?.meter_state || ''}
                onChange={(e) =>
                  setPostToEdit((prev) => ({ ...prev, meter_state: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Unit Bath Water"
                value={postToEdit?.Unit_bath_water || ''}
                onChange={(e) =>
                  setPostToEdit((prev) => ({ ...prev, Unit_bath_water: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Unit Bath Elect"
                value={postToEdit?.Unit_bath_elect || ''}
                onChange={(e) =>
                  setPostToEdit((prev) => ({ ...prev, Unit_bath_elect: e.target.value }))
                }
                fullWidth
                required
              />
              <DialogActions>
                <Button onClick={() => setPostToEdit(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(postToDelete)}
          onClose={() => setPostToDelete(null)}
        >
          <DialogTitle>ลบหอพัก?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณแน่ใจว่าต้องการลบหอพักนี้ไหม?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPostToDelete(null)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item key={post.property_id} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" component="h2">
                    เลขหอพัก {post.property_id}
                  </Typography>
                  <Typography variant="body2" component="h2">
                    จำนวนชั้น {post.number_of_floors}
                  </Typography>
                  <Typography variant="body2" component="p">
                    จำนวนห้อง {post.number_of_rooms}
                  </Typography>
                  <Typography variant="body2" component="h2">
                    สถานะมิตเตอร์ {post.meter_state}
                  </Typography>
                  <Typography variant="body2" component="h2">
                    ค่าน้ำ หน่วยละ {post.Unit_bath_water} บาท
                  </Typography>
                  <Typography variant="body2" component="p">
                    ค่าไฟ หน่วยละ {post.Unit_bath_elect} บาท
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => setPostToEdit(post)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(post.property_id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">
          User_id:
          <input
            id="title-input"
            type="text"
            value={newPost.user_id}
            onChange={(event) =>
              setNewPost({ ...newPost, user_id: event.target.value })
            }
          />
        </label>
        <br />
        <label htmlFor="content-input">
          post_title:
          <textarea
            id="content-input"
            value={newPost.post_title}
            onChange={(event) =>
              setNewPost({ ...newPost, post_title: event.target.value })
            }
          />
        </label>
        <br />
        <label htmlFor="content-input">
          post_text:
          <textarea
            id="content-input"
            value={newPost.post_text}
            onChange={(event) =>
              setNewPost({ ...newPost, post_text: event.target.value })
            }
          />
        </label>
        <br />
        <button type="submit">Add Post</button>
      </form> */}
    </div >

  );
}



// import { Helmet } from 'react-helmet-async';
// import { useState } from 'react';
// // @mui
// import { Container, Stack, Typography, Card, CardActions, CardContent, Button, Snackbar, Alert, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// // components

// export default function ProductsPage() {
//   const [openFilter, setOpenFilter] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [floor, setfloor] = useState('');
//   const [selectedfloor, setSelectedfloor] = useState('');
//   const [room, setRoom] = useState('');
//   const [selectedRoom, setSelectedRoom] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [selectedDueDate, setSelectedDueDate] = useState('');
//   const [meterState, setMeterState] = useState('');
//   const [selectedMeterState, setSelectedMeterState] = useState('');

//   const handleChangefloor = (event) => {
//     const value = event.target.value;
//     setfloor(value);
//   };

//   const handleChangeRoom = (event) => {
//     setRoom(event.target.value);
//   };

//   const handleChangeDueDate = (event) => {
//     setDueDate(event.target.value);
//   };

//   const handleChangeMeter = (event) => {
//     setMeterState(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setSelectedfloor(floor);
//     setSelectedRoom(room);
//     setSelectedMeterState(meterState);
//     setSelectedDueDate(dueDate);
//   };

//   const handleClick = () => {
//     setOpen(true);
//   };

//   const handleClose = (event, reason) => {
//     setOpen(false);
//   };

//   const handleOpenFilter = () => {
//     setOpenFilter(true);
//   };

//   const handleCloseFilter = () => {
//     setOpenFilter(false);
//   };

//   return (
//     <>
//       <Helmet>
//         <title> Dashboard: Setting | Minimal UI </title>
//       </Helmet>

//       <Container maxWidth="xl">
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6} lg={8}>
//             <Stack>
//               <Typography variant='h5' sx={{ pb: 3 }}>ตั้งค่าหอพัก</Typography>
//               <Snackbar
//                 open={open}
//                 autoHideDuration={2000}
//                 onClose={handleClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//               >
//                 <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
//                   แก้ไขสำเร็จ
//                 </Alert>
//               </Snackbar>
//             </Stack>
//           </Grid>

//           <Grid item xs={12} md={6} lg={8}>
//             <Card >
//               <CardContent>
//                 <Stack
//                   alignItem="center"
//                   justifyContent="start"
//                   spacing={2}
//                 >
//                   <Typography variant='h6'>สถานะตั้งค่าปัจจุบัน </Typography>
//                   <Typography>จำนวนชั้น : {selectedfloor || '4'}</Typography>
//                   <Typography>จำนวนห้องต่อชั้น : {selectedRoom || '10'}</Typography>
//                   <Typography>รูปแบบการติดตั้งมิตเตอร์ : {selectedMeterState || 'Owner'}</Typography>
//                   <Typography>วันเวลาออกใบชำระหนี้ค่าห้องพัก : {selectedDueDate || '25'}</Typography>
//                   <Typography>ค่าสาธารณูปโภค: </Typography>
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6} lg={12}>
//             <Card sx={{ my: 5 }}>
//               <CardContent>
//                 <Stack
//                   direction="row"
//                   alignItem="center"
//                   justifyContent="start"
//                   spacing={2}
//                 >
//                   <Stack spacing={2}>
//                     <Stack direction="row" spacing={2}>
//                       <Typography sx={{ mt: 2 }}>จำนวนชั้น</Typography>
//                       <FormControl fullWidth>
//                         <InputLabel id="demo-simple-select-label">Floor</InputLabel>
//                         <Select
//                           labelId="demo-simple-select-label"
//                           id="demo-simple-select"
//                           value={floor}
//                           label="Floor"
//                           onChange={handleChangefloor}
//                           style={{ width: '100px' }}
//                         >
//                           {Array.from({ length: 101 }, (_, index) => (
//                             <MenuItem key={index} value={index}>{index}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Stack>

//                     <Stack direction="row" spacing={2}>
//                       <Typography sx={{ mt: 2 }}>จำนวนห้องต่อชั้น</Typography>
//                       <FormControl fullWidth>
//                         <InputLabel id="demo-simple-select-label">Rooms Per Floor</InputLabel>
//                         <Select
//                           labelId="demo-simple-select-label"
//                           id="demo-simple-select"
//                           value={room}
//                           label="Room"
//                           onChange={handleChangeRoom}
//                           style={{ width: '180px' }}
//                         >
//                           {Array.from({ length: 51 }, (_, index) => (
//                             <MenuItem key={index} value={index}>{index}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Stack>

//                     <Stack direction="row" spacing={2}>
//                       <Typography sx={{ mt: 2 }}>รูปแบบการติดตั้งมิตเตอร์</Typography>
//                       <FormControl fullWidth>
//                         <InputLabel id="demo-simple-select-label">Meter</InputLabel>
//                         <Select
//                           labelId="demo-simple-select-label"
//                           id="demo-simple-select"
//                           value={meterState}
//                           label="Meter"
//                           onChange={handleChangeMeter}
//                         >
//                           <MenuItem value={'AdminAll'}>มิเตอร์น้ำ มิเตอร์ไฟ จัดการโดยผู้ดูแลทั้งหมด</MenuItem>
//                           <MenuItem value={'waterAdmin_elecUser'}>มิเตอร์น้ำ จัดการโดยผู้ดูแล มิเตอร์ไฟ จัดการโดยผู้ใช้งาน</MenuItem>
//                           <MenuItem value={'waterUser_elecAdmin'}>มิเตอร์น้ำ จัดการโดยผู้ใช้งาน มิเตอร์ไฟ จัดการโดยผู้ดูแล</MenuItem>
//                           <MenuItem value={'UserAll'}>มิเตอร์น้ำ มิเตอร์ไฟ จัดการโดยผู้ใช้งานทั้งหมด</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Stack>

//                     <Stack direction="row" spacing={2}>
//                       <Typography sx={{ mt: 2 }}>วันเวลาออกใบชำระหนี้ค่าห้องพัก</Typography>
//                       <FormControl fullWidth>
//                         <InputLabel id="demo-simple-select-label">dueDate</InputLabel>
//                         <Select
//                           labelId="demo-simple-select-label"
//                           id="demo-simple-select"
//                           value={dueDate}
//                           label="dueDate"
//                           onChange={handleChangeDueDate}
//                           style={{ width: '100px' }}
//                         >
//                           {Array.from({ length: 32 }, (_, index) => (
//                             <MenuItem key={index} value={index}>{index}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Stack>

//                   </Stack>
//                 </Stack>
//               </CardContent>
//               <CardActions >
//                 <Button onClick={handleSubmit}>ยืนยัน</Button>
//                 <Button>ลบ</Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// }
