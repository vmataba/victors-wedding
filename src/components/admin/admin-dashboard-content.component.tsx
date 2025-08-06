import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Paper,
    Chip,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import {
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    Assessment as AssessmentIcon,
    AdminPanelSettings as AdminIcon,
    CardGiftcard as PledgeIcon,
    TrendingUp as TrendingUpIcon,
    Group as GroupIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { loadAdmins } from '../../services/admin.service';
import { loadInvitees } from '../../services/invitee.service';

export const AdminDashboardContent = () => {
    const { authState } = useAuth();
    const [stats, setStats] = useState({
        totalAdmins: 0,
        totalInvitees: 0,
        totalPledges: 0,
        totalAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            
            // Load admins
            const admins = await loadAdmins();
            
            // Load invitees
            const invitees = await loadInvitees();
            
            // Calculate stats (placeholder values for now)
            const totalPledges = 0; // Will be implemented when pledge system is ready
            const totalAmount = 0; // Will be implemented when pledge system is ready

            setStats({
                totalAdmins: admins?.length || 0,
                totalInvitees: invitees?.length || 0,
                totalPledges,
                totalAmount
            });
        } catch (err) {
            setError('Failed to load dashboard statistics');
            console.error('Dashboard stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            title: 'Manage Admins',
            description: 'Register new admins and manage existing ones',
            icon: <AdminIcon sx={{ fontSize: 40 }} />,
            link: '/admin/admins',
            color: '#2196F3',
            stat: stats.totalAdmins,
            statLabel: 'Total Admins'
        },
        {
            title: 'Manage Invitees',
            description: 'Register invitees and view their information',
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            link: '/admin/invitees',
            color: '#4CAF50',
            stat: stats.totalInvitees,
            statLabel: 'Total Invitees'
        },
        {
            title: 'Invitees Report',
            description: 'View detailed reports and pledges',
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            link: '/admin/reports',
            color: '#FF9800',
            stat: stats.totalPledges,
            statLabel: 'Total Pledges'
        },
        {
            title: 'Pledges & Gifts',
            description: 'Manage wedding pledges and gifts',
            icon: <PledgeIcon sx={{ fontSize: 40 }} />,
            link: '/admin/pledges',
            color: '#9C27B0',
            stat: `$${stats.totalAmount.toLocaleString()}`,
            statLabel: 'Total Amount'
        }
    ];

    const quickStats = [
        {
            title: 'Total Invitees',
            value: stats.totalInvitees,
            icon: <GroupIcon />,
            color: '#4CAF50',
            change: '+12%'
        },
        {
            title: 'Active Pledges',
            value: stats.totalPledges,
            icon: <PledgeIcon />,
            color: '#2196F3',
            change: '+8%'
        },
        {
            title: 'Total Amount',
            value: `$${stats.totalAmount.toLocaleString()}`,
            icon: <MoneyIcon />,
            color: '#FF9800',
            change: '+15%'
        },
        {
            title: 'Response Rate',
            value: '87%',
            icon: <TrendingUpIcon />,
            color: '#9C27B0',
            change: '+5%'
        }
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Welcome back, {authState.admin?.name}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Here's what's happening with Victor's wedding management today.
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                {quickStats.map((stat, index) => (
                    <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {stat.title}
                                    </Typography>
                                    <Chip
                                        label={stat.change}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                            color: '#4CAF50',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Box sx={{ color: stat.color, opacity: 0.7 }}>
                                    {stat.icon}
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                ))}
            </Box>

            {/* Main Dashboard Cards */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {dashboardCards.map((card, index) => (
                    <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', lg: '1 1 22%' } }}>
                        <Card
                            elevation={3}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
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
                                    variant="h6"
                                    component="h3"
                                    gutterBottom
                                    sx={{ fontWeight: 600 }}
                                >
                                    {card.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.6, mb: 2 }}
                                >
                                    {card.description}
                                </Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                                        {card.stat}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {card.statLabel}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 3, pt: 0 }}>
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
                                    Open {card.title.split(' ')[1]}
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Recent Activity Section */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Activity
                </Typography>
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Recent activity will be displayed here as you use the system.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};
