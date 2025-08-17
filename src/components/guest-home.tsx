import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, Card, CardContent, Chip, Container, Stack, Typography} from '@mui/material';
import {AdminPanelSettings as AdminIcon, CopyAll as CopyAllIcon, Favorite as FavoriteIcon, WhatsApp as WhatsAppIcon} from '@mui/icons-material';
import './guest-home.css';
import accountBalanceIcon from '../assets/images/account-balance.svg';

interface PaymentMethodProps {
    method: string;
    ref: string
    name: string;
    copyToClipboard: (text: string) => void
}

const PaymentMethod = ({method, ref, name, copyToClipboard}: PaymentMethodProps) => {
    return <>
        <div className="payment-method" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px'
        }} onClick={() => {
            navigator.clipboard.writeText(ref).then(() => copyToClipboard(ref));
        }}>
            <CopyAllIcon style={{marginBottom: '1rem', color: '#007bff'}}/>
            <span className="payment-method-label"
                  style={{marginBottom: '0.5rem', color: '#007bff'}}>{ref} - {method}</span>
            <p className="payment-method-name">{name}</p>
        </div>
    </>
}

export const GuestHome = () => {
    const [showToast, setShowToast] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setToastMessage("Copied: " + text);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setToastMessage('');
            }, 3000);
        }, () => {
            alert("Oops, unable to copy");
        });
    }

    const hideToast = () => {
        setShowToast(false)
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: {xs: 'scroll', md: 'fixed'},
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
            <Box className="stars-container"
                 sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, pointerEvents: 'none'}}/>

            {/* Floating Particles Container */}
            <Box className="particles-container"
                 sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, pointerEvents: 'none'}}/>
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
                            backdropFilter: 'blur(5px)',
                            backgroundColor: 'rgba(255, 255, 255, 0)',
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
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                                zIndex: -1
                            }
                        }}
                    >
                        <CardContent sx={{p: {xs: 3, sm: 4, md: 6}, textAlign: 'center'}}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                className="hero-title"
                                sx={{
                                    fontWeight: 450,
                                    fontSize: {xs: '2rem', sm: '2.5rem', md: '3.5rem'},
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
                                    mb: {xs: 3, md: 4},
                                    fontSize: {xs: '1.1rem', sm: '1.3rem', md: '1.5rem'},
                                    fontWeight: 400,
                                    color: '#34495E',
                                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
                                    lineHeight: 1.4
                                }}>
                                Join us in celebrating this special day
                            </Typography>
                            <div className="payment-instructions">
                                <Typography variant={'h5'} sx={{
                                    mb: {xs: 3, md: 4},
                                    fontSize: {xs: '1.1rem', sm: '1.3rem', md: '1.5rem'},
                                    fontWeight: 400,
                                    color: '#34495E',
                                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
                                    lineHeight: 1.4
                                }}>
                                    Payment Instructions
                                </Typography>
                                <div className="payment-methods">
                                    <PaymentMethod method="YAS/TIGOPESA" ref='0657471721' name='VICTOR NATALIS MATABA'
                                                   copyToClipboard={copyToClipboard}/>
                                    <PaymentMethod method="MPESA" ref='0762228745' name='FRANK MATABA'
                                                   copyToClipboard={copyToClipboard}/>
                                    <PaymentMethod method="NMB" ref='20810055844' name='VICTOR NATALIS MATABA'
                                                   copyToClipboard={copyToClipboard}/>
                                </div>
                                {showToast && <div id="toast" onClick={hideToast}>
                                    <img src={accountBalanceIcon} alt="cash"/>
                                    <span id="toastMessage">{toastMessage}</span>
                                </div>}
                            </div>

                            <Stack
                                direction={{xs: 'column', sm: 'row'}}
                                spacing={{xs: 2, sm: 3}}
                                justifyContent="center"
                                sx={{mt: {xs: 3, md: 4}}}>
                                <Button
                                    component={Link}
                                    to="/pledges"
                                    variant="contained"
                                    size="large"
                                    startIcon={<FavoriteIcon/>}
                                    className="pulse-button"
                                    sx={{
                                        py: {xs: 1.5, sm: 2},
                                        px: {xs: 3, sm: 4},
                                        fontSize: {xs: '1rem', sm: '1.1rem'},
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 3,
                                        background: 'linear-gradient(45deg, #E74C3C, #C0392B)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#FFFFFF',
                                        minWidth: {xs: '200px', sm: 'auto'},
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
                                <Button
                                    component="a"
                                    href="https://chat.whatsapp.com/invite/victorandestherwedding"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="outlined"
                                    size="large"
                                    startIcon={<WhatsAppIcon />}
                                    sx={{
                                        py: {xs: 1.3, sm: 1.8},
                                        px: {xs: 3, sm: 4},
                                        fontSize: {xs: '0.9rem', sm: '1rem'},
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(5px)',
                                        color: '#128C7E',
                                        borderColor: '#128C7E',
                                        minWidth: {xs: '180px', sm: 'auto'},
                                        '&:hover': {
                                            backgroundColor: 'rgba(18, 140, 126, 0.05)',
                                            borderColor: '#25D366',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Join us on WhatsApp
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
                    p: {xs: 1, sm: 2},
                    display: 'flex',
                    justifyContent: {xs: 'center', sm: 'flex-end'}
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
                        fontSize: {xs: '0.8rem', sm: '0.875rem'},
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
