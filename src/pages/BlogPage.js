import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, TextField,
   Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
// import { json } from 'react-router-dom';


// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)

  const handleClickOpen = () =>{
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClick = async () => {
    console.log(new Date().toISOString());
    setLoading(true);
    try {
      // const formData = new FormData();
      // formData.append("user_id", 4);
      // formData.append("post_title", "fetch form dash");
      // formData.append("post_text", "Hwwwttt");
      // formData.append("date_created", new Date().toISOString());
      // console.log(formData)
      const data = {
        "user_id": 2,
        "post_title": "แจ้งปิดหอ",
        "post_text": "ปิดหอวันที่31"
      }
      const response = await fetch("https://dorm-api.vercel.app/api/post", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log(response.data);
      console.log("Add Succed");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
            New Post
          </Button>
        </Stack>

        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>เพิ่มโพสต์</DialogTitle>
        <DialogContent>
          <DialogContentText>
            เพิ่มเนื้อหาโพสต์ ลงในcontent
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="หัวข้อโพสต์"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="outlined-multiline-static"
            label="เนื้อหาโพสต์"
            multiline
            rows={4}
            // defaultValue="Default Value"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleClose}>โพสต์</Button>
        </DialogActions>
        </Dialog>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
