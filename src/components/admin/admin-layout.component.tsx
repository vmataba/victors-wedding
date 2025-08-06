import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Tooltip,
    Paper
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    Assessment as AssessmentIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountIcon,
    AdminPanelSettings as AdminIcon,
    CardGiftcard as PledgeIcon,
    ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const drawerWidth = 280;

interface SidebarItem {
    text: string;
    icon: React.ReactElement;
    path: string;
    description: string;
}

const sidebarItems: SidebarItem[] = [
    {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/admin/dashboard',
        description: 'Overview and quick access'
    },
    {
        text: 'Manage Admins',
        icon: <AdminIcon />,
        path: '/admin/admins',
        description: 'Add, edit, and remove admins'
    },
    {
        text: 'Invitation Cards',
        icon: <PeopleIcon />,
        path: '/admin/invitees',
        description: 'Create and manage wedding invitation cards'
    },
    {
        text: 'Invitees Report',
        icon: <AssessmentIcon />,
        path: '/admin/reports',
        description: 'View detailed reports and analytics'
    },
    {
        text: 'Pledges & Gifts',
        icon: <PledgeIcon />,
        path: '/admin/pledges',
        description: 'Manage wedding pledges and gifts'
    }
];

export const AdminLayout: React.FC = () => {
    const { authState, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

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

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar Header */}
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Avatar
                    sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        fontSize: '1.5rem'
                    }}
                >
                    {authState.admin?.name?.charAt(0) || 'A'}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {authState.admin?.name || 'Admin'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Wedding Admin Panel
                </Typography>
            </Box>

            <Divider />

            {/* Navigation Items */}
            <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Tooltip key={item.text} title={item.description} placement="right">
                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        mx: 1,
                                        backgroundColor: isActive ? 'rgba(103, 126, 234, 0.1)' : 'transparent',
                                        color: isActive ? 'primary.main' : 'text.primary',
                                        '&:hover': {
                                            backgroundColor: isActive 
                                                ? 'rgba(103, 126, 234, 0.15)' 
                                                : 'rgba(0, 0, 0, 0.04)',
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: isActive ? 'primary.main' : 'text.secondary',
                                            minWidth: 40
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 400,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>

            <Divider />

            {/* Footer */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Victor's Wedding Admin
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                    v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    ml: { lg: `${drawerWidth}px` },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'text.primary',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
                elevation={0}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { lg: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {sidebarItems.find(item => item.path === location.pathname)?.text || 'Admin Panel'}
                    </Typography>

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <AccountIcon />
                        </Avatar>
                    </IconButton>
                    
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
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
                            <LogoutIcon sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', lg: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <Toolbar />
                <Box sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};
