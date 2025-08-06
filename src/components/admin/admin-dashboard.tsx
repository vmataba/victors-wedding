import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    AppBar,
    Toolbar,
    Avatar,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    Assessment as AssessmentIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountIcon
} from '@mui/icons-material';

export const AdminDashboard = () => {
    const {authState, logout} = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleClose();
    };

    const dashboardCards = [
        {
            title: 'Manage Admins',
            description: 'Register new admins and manage existing ones',
            icon: <PersonAddIcon sx={{fontSize: 40}}/>,
            link: '/admin/admins',
            color: '#2196F3'
        },
        {
            title: 'Manage Invitees',
            description: 'Register invitees and view their information',
            icon: <PeopleIcon sx={{fontSize: 40}}/>,
            link: '/admin/invitees',
            color: '#4CAF50'
        },
        {
            title: 'Invitees Report',
            description: 'View detailed reports and pledges',
            icon: <AssessmentIcon sx={{fontSize: 40}}/>,
            link: '/admin/reports',
            color: '#FF9800'
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/images/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 1
                }
            }}
        >
            {/* Header */}
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'text.primary',
                    position: 'relative',
                    zIndex: 2
                }}
                elevation={0}
            >
                <Toolbar>
                    <DashboardIcon sx={{mr: 2, color: 'primary.main'}}/>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1, fontWeight: 600}}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{mr: 2, color: 'text.secondary'}}>
                        Welcome, {authState.admin?.name}
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar sx={{bgcolor: 'primary.main'}}>
                            <AccountIcon/>
                        </Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{mr: 1}}/>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Dashboard Content */}
            <Container maxWidth="lg" sx={{position: 'relative', zIndex: 2, py: 4}}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 700,
                        mb: 4,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    Wedding Management System
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', md: 'repeat(3, 1fr)'},
                        gap: 4
                    }}
                >
                    {dashboardCards.map((card, index) => (
                        <Box key={index}>
                            <Card
                                elevation={12}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backdropFilter: 'blur(10px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: 4,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                <CardContent sx={{flexGrow: 1, textAlign: 'center', p: 3}}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            mb: 2,
                                            color: card.color
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        gutterBottom
                                        sx={{fontWeight: 600}}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{lineHeight: 1.6}}
                                    >
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{p: 3, pt: 0}}>
                                    <Button
                                        component={Link}
                                        to={card.link}
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            backgroundColor: card.color,
                                            py: 1.5,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: card.color,
                                                filter: 'brightness(0.9)'
                                            }
                                        }}
                                    >
                                        Access {card.title.split(' ')[1]}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};
