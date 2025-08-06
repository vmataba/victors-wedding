import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, Card, CardContent, Chip, Container, Stack, Typography} from '@mui/material';
import {AdminPanelSettings as AdminIcon, Favorite as FavoriteIcon} from '@mui/icons-material';
import './guest-home.css';
import backgroundImage from '../../public/images/background.jpg'

export const GuestHome = () => {
    useEffect(() => {
        // Create falling stars
        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'falling-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            star.style.opacity = Math.random().toString();
            document.querySelector('.stars-container')?.appendChild(star);
            
            setTimeout(() => {
                star.remove();
            }, 5000);
        };
        
        // Create floating particles
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            document.querySelector('.particles-container')?.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 25000);
        };
        
        const starInterval = setInterval(createStar, 300);
        const particleInterval = setInterval(createParticle, 2000);
        
        return () => {
            clearInterval(starInterval);
            clearInterval(particleInterval);
        };
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: { xs: 'scroll', md: 'fixed' },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.2) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)
                    `,
                    zIndex: 1
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
                    zIndex: 1
                }
            }}
        >
            {/* Falling Stars Container */}
            <Box className="stars-container" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, pointerEvents: 'none' }} />
            
            {/* Floating Particles Container */}
            <Box className="particles-container" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, pointerEvents: 'none' }} />
            {/* Hero Section */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 2,
                    py: 4
                }}
            >
                <Container maxWidth="md">
                    <Card
                        elevation={24}
                        className="hero-card"
                        sx={{
                            backdropFilter: 'blur(20px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 6,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                zIndex: -1
                            }
                        }}
                    >
                        <CardContent sx={{p: { xs: 3, sm: 4, md: 6 }, textAlign: 'center'}}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                className="hero-title"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                                    background: 'linear-gradient(45deg, #2C3E50, #34495E, #1A252F)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 2,
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                                }}
                            >
                                Welcome to Victor & Esther's Wedding
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: { xs: 3, md: 4 },
                                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                    fontWeight: 400,
                                    color: '#34495E',
                                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
                                    lineHeight: 1.4
                                }}
                            >
                                Join us in celebrating this special day
                            </Typography>

                            <Stack
                                direction={{xs: 'column', sm: 'row'}}
                                spacing={{ xs: 2, sm: 3 }}
                                justifyContent="center"
                                sx={{mt: { xs: 3, md: 4 }}}>
                                <Button
                                    component={Link}
                                    to="/pledges"
                                    variant="contained"
                                    size="large"
                                    startIcon={<FavoriteIcon/>}
                                    className="pulse-button"
                                    sx={{
                                        py: { xs: 1.5, sm: 2 },
                                        px: { xs: 3, sm: 4 },
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 3,
                                        background: 'linear-gradient(45deg, #E74C3C, #C0392B)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#FFFFFF',
                                        minWidth: { xs: '200px', sm: 'auto' },
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #C0392B, #A93226)',
                                            transform: 'translateY(-2px) scale(1.05)',
                                            boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    View & Add Pledges
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            {/* Admin Section */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    p: { xs: 1, sm: 2 },
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-end' }
                }}
            >
                <Chip
                    component={Link}
                    to="/admin/login"
                    icon={<AdminIcon/>}
                    label="Admin Login"
                    clickable
                    sx={{
                        backgroundColor: 'rgba(52, 73, 94, 0.8)',
                        color: '#FFFFFF',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        '&:hover': {
                            backgroundColor: 'rgba(44, 62, 80, 0.9)',
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                    }}
                />
            </Box>
        </Box>
    );
};
