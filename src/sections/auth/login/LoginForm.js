import { useState, useContext} from 'react';
import { json, useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import {UserContext} from '../../../App';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const {setUserData} = useContext(UserContext)

  const handleClick = async (event) => {
    event.preventDefault();
    try{
      const response = await fetch("https://dorm-api.vercel.app/api/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      });
      const data = await response.json()
      console.log(data)
      setUserData(data)
      navigate('/dashboard', { replace: true });
    }catch(err){
      console.log(err)
    }
  };
  

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Username" value = {username} onChange = {(event) => setUsername(event.target.value)} />

        <TextField
          name="password"
          label="Password"
          value = {password}
          onChange = {(event) => setPassword(event.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          ลืมรหัสผ่าน?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        เข้าสู่ระบบ
      </LoadingButton>
    </>
  );
}
