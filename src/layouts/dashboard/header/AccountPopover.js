import { useState, useEffect, useContext } from 'react';
import {useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import {UserContext} from '../../../App'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: 'Home',
  //   icon: 'eva:home-fill',
  // },
  // {
  //   label: 'Profile',
  //   icon: 'eva:person-fill',
  // },
  {
    label: 'ตั้งค่าโปรไฟล์',
    icon: 'eva:settings-2-fill',
  },
];

function LetterAvatar({ name, lastname }) {
  const getInitials = (name, lastname) => {
    const firstName = name ? name.charAt(0) : '';
    const lastName = lastname ? lastname.charAt(0) : '';
    return firstName + lastName;
  };

  const initials = getInitials(name, lastname);

  return (
    <Avatar>
      {initials}
    </Avatar>
  );
}

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const {userData} = useContext(UserContext)

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // Check if userData has been initialized before rendering the component
  if (!userData) {
    return null; // or some other fallback component
  }

  const { name, lastname, email } = userData.user;

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <LetterAvatar name={name} lastname={lastname} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {name} {lastname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => { handleClose(); navigate('', { replace: true }); }} sx={{ m: 1 }}>
          ออกจากระบบ
        </MenuItem>
      </Popover>
    </>
  );
}
