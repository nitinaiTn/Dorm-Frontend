import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { Grid, Button, Container, Stack, Typography, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Alert, Snackbar
  } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
// import POSTS from '../_mock/blog';
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
  const [openSnack, setOpenSnack] = useState(false);
  const [data, setData] = useState([])
  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("")

  const handleClickOpen = () =>{
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenSnack = () =>{
    setOpenSnack(true)
  }

  const handleCloseSnack = () => {
    setOpenSnack(false)
  }

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://dorm-api.vercel.app/api/post");
      const data = await res.json();
      setData(data);
      console.log(data)
    }
    fetchData();
  }, []);

  const postLIST = data.map(item => ({
    id: item.post_id,
    cover: `/assets/images/covers/cover_${item + 1}.jpg`,
    title: item.post_title,
    postText: item.post_text,
    createdAt: item.date_created,
    view: faker.datatype.number(),
    // comment: faker.datatype.number(),
    share: faker.datatype.number(),
    favorite: faker.datatype.number(),
    author: {
      name: item.name,
      avatarUrl: `/assets/images/avatars/avatar_${item + 1}.jpg`,
    },
  }));

  const handleClick = async () => {
    setLoading(true);
    try {
      const data = {
        "user_id": 2,
        "post_title": inputTitle,
        "post_text": inputText
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
      handleOpenSnack()
      handleClose()  
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
            แจ้งข่าวสาร
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
            value={inputTitle}
            onChange={e => setInputTitle(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="outlined-multiline-static"
            label="เนื้อหาโพสต์"
            multiline
            rows={4}
            fullWidth
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleClick}>โพสต์</Button>
        </DialogActions>
        </Dialog>

        <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleCloseSnack}
            anchorOrigin= {{vertical: 'top', horizontal: 'right'}}
          >
            <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
              เพิ่มสำเร็จ
            </Alert>
          </Snackbar>

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={postLIST} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}

        <Grid container spacing={3}>
          {postLIST.map((postLIST, index) => (
            <BlogPostCard key={postLIST.post_id} post={postLIST} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
