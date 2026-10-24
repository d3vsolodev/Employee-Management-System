import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useNavigate } from 'react-router-dom'; // Correct useNavigate
import { extractFetchError } from '../utils/apiError';
import { notifySuccess, notifyError } from '../utils/toast';

const VerifyUsername = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://employee-management-app-gdm5.onrender.com/verify-username/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      setLoading(false);

      if (response.ok) {
        notifySuccess('Username verified! Taking you to reset your password…');
        setTimeout(() => {
          navigate(`/reset-password?username=${username}`);
        }, 1000); // Redirect to reset password page after a short delay
      } else {
        const message = await extractFetchError(response, `We could not find an account for "${username}".`);
        notifyError(message);
      }
    } catch (err) {
      setLoading(false);
      notifyError('We could not reach the server (it may be waking up). Please try again in a moment.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 260px)' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 440,
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f9f9f9 0%, #f2f2f2 100%)',
          border: '1px solid rgba(58, 58, 58, 0.08)',
          boxShadow: '0 25px 70px rgba(23, 23, 23, 0.12)',
        }}
      >
        {/* Decorative gradient blobs (match app theme) */}
        <Box
          sx={{
            position: 'absolute',
            width: 190,
            height: 190,
            top: -65,
            right: -45,
            background: 'radial-gradient(circle, rgba(58, 58, 58, 0.16), transparent 60%)',
            filter: 'blur(2px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 160,
            height: 160,
            bottom: -50,
            left: -40,
            background: 'radial-gradient(circle, rgba(163, 163, 163, 0.16), transparent 60%)',
            filter: 'blur(2px)',
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                mb: 1.5,
                borderRadius: '50%',
                color: 'white',
                background: 'linear-gradient(135deg, #3a3a3a 0%, #4f4f4f 100%)',
                boxShadow: '0 12px 30px rgba(58, 58, 58, 0.35)',
              }}
            >
              <PersonSearchIcon sx={{ fontSize: 34 }} />
            </Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#171717' }}>
              Verify Username
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Enter your username to start resetting your password.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} sx={{ marginBottom: '1rem' }} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #3a3a3a 0%, #4f4f4f 100%)',
                  boxShadow: '0 12px 30px rgba(58, 58, 58, 0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #333333 0%, #474747 100%)' },
                }}
              >
                Verify Username
              </Button>
            )}
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyUsername;
