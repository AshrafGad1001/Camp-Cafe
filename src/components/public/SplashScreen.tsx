'use client';

import React, { useEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if the splash screen has already been shown in this session
    const hasSeenSplash = sessionStorage.getItem('campcafe_splash_seen');
    
    if (hasSeenSplash) {
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    // Set a flag in session storage so it doesn't show again on reload
    sessionStorage.setItem('campcafe_splash_seen', 'true');

    // Start fade out after 2 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Completely unmount after transition (2s + 0.5s fade)
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <Fade in={isVisible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999, // ensures it sits above absolutely everything
          backgroundColor: '#0A2947', // Premium dark blue
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Camp Cafe Logo"
          sx={{
            width: { xs: 150, sm: 200, md: 250 },
            filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.4))',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
              '50%': {
                opacity: .8,
                transform: 'scale(1.05)',
              },
            }
          }}
        />
      </Box>
    </Fade>
  );
}
