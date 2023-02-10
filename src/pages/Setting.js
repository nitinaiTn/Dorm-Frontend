import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Card, CardActions, CardContent, Button} from '@mui/material';
// components

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

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
          <Card >
            <CardContent>
              <Typography>
                Hello Title
              </Typography>
              <Typography>
                Hello Content
              </Typography>
            </CardContent>
            <CardActions>
              <Button sx = {{ml: 1}}>Done</Button>
              <Button>Cancle</Button>
            </CardActions>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
