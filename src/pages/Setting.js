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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { userData } = useContext(UserContext)

  useEffect(() => {
    // Fetch the list of posts when the component mounts
    fetch(`https://dorm-api.vercel.app/api/property/${userData.user.user_id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .then(() => { console.log('Succec fetch') })
  }, [key]);

  const handleSubmit = () => {
    // event.preventDefault();
    // Create a new post object with the provided title and content
    console.log(newPost)
    const post = {
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
    fetch('https://dorm-api.vercel.app/api/property', {
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
        console.log("Create Done")
      })
      .catch(error => console.error(error));
    setIsDialogOpen(false)
  };

  // const handleDelete = (propertyId) => {
  //   // Send a DELETE request to the API endpoint
  //   fetch(`https://dorm-api.vercel.app/api/property/${propertyId}`, {
  //     method: 'DELETE',
  //   })
  //     .then((response) => response.json())
  //     .then(() => {
  //       // Remove the deleted post from the posts state
  //       const updatedPosts = posts.filter(post => post.property_id !== propertyId);
  //       setPosts(updatedPosts);
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting post:', error);
  //     });
  // }

  const handleEditClick = (post) => {
    setPostToEdit(post);
  };

  const handleEditSubmit = () => {
    // event.preventDefault();
    console.log(postToEdit)
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
        console.log("Edit Succes")
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

  const meterStateList = [
    { value: 'AdminAll', label: 'มิเตอร์น้ำ มิเตอร์ไฟ จัดการโดยผู้ดูแลทั้งหมด' },
    { value: 'waterAdmin_elecUser', label: 'มิเตอร์น้ำ จัดการโดยผู้ดูแล มิเตอร์ไฟ จัดการโดยผู้ใช้งาน' },
    { value: 'waterUser_elecAdmin', label: 'มิเตอร์น้ำ จัดการโดยผู้ใช้งาน มิเตอร์ไฟ จัดการโดยผู้ดูแล' },
    { value: 'UserAll', label: 'มิเตอร์น้ำ มิเตอร์ไฟ จัดการโดยผู้ใช้งานทั้งหมด' },
  ];

  return (
    <div>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h2" gutterBottom>
          ตั้งค่าหอพัก
        </Typography>

        <Button variant="outlined" sx={{ mb: 3 }} onClick={() => setIsDialogOpen(true)}>create</Button>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>สร้างหอพักใหม่</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Owner ID"
                  value={newPost.owner_id}
                  onChange={(e) => setNewPost({ ...newPost, owner_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="จำนวนชั้น"
                  value={newPost.number_of_floors}
                  onChange={(e) => setNewPost({ ...newPost, number_of_floors: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="จำนวนห้อง"
                  value={newPost.number_of_rooms}
                  onChange={(e) => setNewPost({ ...newPost, number_of_rooms: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="meter-state-label">สถานะมิตเตอร์</InputLabel>
                <Select
                  labelId="meter-state-label"
                  value={newPost.meter_state}
                  onChange={(e) => setNewPost({ ...newPost, meter_state: e.target.value })}
                  fullWidth
                >
                  {meterStateList.map((id) => (
                    <MenuItem key={id.value} value={id.value}>
                      {id.label}
                    </MenuItem>
                  ))}
                </Select>
                {/* <TextField
                    required
                    fullWidth
                    label="Meter state"
                    value={newPost.meter_state}
                    onChange={(e) => setNewPost({ ...newPost, meter_state: e.target.value })}
                  /> */}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="หน่วยค่าน้ำ"
                  value={newPost.Unit_bath_water}
                  onChange={(e) => setNewPost({ ...newPost, Unit_bath_water: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="หน่วยค่าไฟ"
                  value={newPost.Unit_bath_elect}
                  onChange={(e) => setNewPost({ ...newPost, Unit_bath_elect: e.target.value })}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => handleSubmit()} color="primary">
                Create
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(postToEdit)} onClose={() => setPostToEdit(null)}>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Property ID"
                  variant="outlined"
                  fullWidth
                  value={postToEdit?.property_id || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      property_id: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Owner ID"
                  variant="outlined"
                  fullWidth
                  value={postToEdit?.owner_id || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      owner_id: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="จำนวนชั้น"
                  variant="outlined"
                  fullWidth
                  value={postToEdit?.number_of_floors || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      number_of_floors: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="จำนวนห้อง"
                  variant="outlined"
                  fullWidth
                  value={postToEdit?.number_of_rooms || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      number_of_rooms: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel variant="h1">สถานะมิตเตอร์</InputLabel>
                <Select
                  fullWidth
                  value={postToEdit?.meter_state || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      meter_state: event.target.value,
                    })
                  }
                >
                  {meterStateList.map((id) => (
                    <MenuItem key={id.value} value={id.value}>
                      {id.label}
                    </MenuItem>
                  ))}
                </Select>
                {/* <TextField
                    label="สถานะมิตเตอร์"
                    variant="outlined"
                    fullWidth
                    value={postToEdit?.meter_state || ''}
                    onChange={(event) =>
                      setPostToEdit({
                        ...postToEdit,
                        meter_state: event.target.value,
                      })
                    }
                  /> */}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="หน่วยค่าน้ำ"
                  variant="outlined"
                  fullWidth
                  value={postToEdit?.Unit_bath_water || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      Unit_bath_water: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="หน่วยค่าไฟฟ้า"
                  variant="outlined"
                  fullWidth
                  value={postToEdit?.Unit_bath_elect || ''}
                  onChange={(event) =>
                    setPostToEdit({
                      ...postToEdit,
                      Unit_bath_elect: event.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>

            <DialogActions>
              <Button onClick={() => setPostToEdit(null)}>ยกเลิก</Button>
              <Button onClick={() => handleEditSubmit()} variant="contained">
                บันทึก
              </Button>
            </DialogActions>

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
                  <Button size="small" color="primary" onClick={() => handleEditClick(post)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteClick(post.property_id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div >
  );
}
