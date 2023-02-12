import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { Grid, Button, Container, Stack, Typography, TextField,
   Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
  const [data, setData] = useState([])
  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("")

  const handleClickOpen = () =>{
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
    comment: faker.datatype.number(),
    share: faker.datatype.number(),
    favorite: faker.datatype.number(),
    author: {
      name: item.name,
      avatarUrl: `/assets/images/avatars/avatar_${item + 1}.jpg`,
    },
  }));

  const handleClick = async () => {
    // console.log(new Date().toISOString());
    console.log(inputText,inputTitle)
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
            // defaultValue="Default Value"
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

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={postLIST} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {postLIST.map((postLIST, index) => (
            <BlogPostCard key={postLIST.post_id} post={postLIST} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
