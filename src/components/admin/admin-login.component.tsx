import React, {useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Container
} from '@mui/material';
import {Login as LoginIcon} from '@mui/icons-material';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password');
            setIsLoading(false);
            return;
        }

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/admin/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/images/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1
                }
            }}
        >
            <Container maxWidth="sm" sx={{position: 'relative', zIndex: 2}}>
                <Card
                    elevation={24}
                    sx={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}
                >
                    <CardContent sx={{p: 4}}>
                        <Box sx={{textAlign: 'center', mb: 3}}>
                            <LoginIcon sx={{fontSize: 48, color: 'primary.main', mb: 2}}/>
                            <Typography variant="h4" component="h1" gutterBottom
                                        sx={{fontWeight: 600, color: 'text.primary'}}>
                                Admin Login
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Welcome to Victor's Wedding Admin Panel
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                                variant="outlined"
                                sx={{mb: 2}}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                variant="outlined"
                                sx={{mb: 3}}
                            />

                            {error && (
                                <Alert severity="error" sx={{mb: 2}}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20}/> : <LoginIcon/>}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 2
                                }}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};