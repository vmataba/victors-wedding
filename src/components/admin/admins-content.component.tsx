import React, { useState, useEffect } from 'react';
import { Admin } from '../../models/admin.model';
import { loadAdmins, registerAdmin, removeAdmin } from '../../services/admin.service';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Grid,
    Paper,
    Divider,
    Stack,
    Fab,
    Tooltip
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Shield as ShieldIcon,
    Email as EmailIcon,
    Add as AddIcon
} from '@mui/icons-material';

export const AdminsContent = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { authState } = useAuth();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const adminsList = await loadAdmins();
            setAdmins(adminsList || []);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setError('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        try {
            const newAdmin: Admin = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            await registerAdmin(newAdmin);
            setSuccess('Admin registered successfully!');
            setFormData({ name: '', email: '', password: '' });
            setShowForm(false);
            fetchAdmins();
        } catch (error) {
            console.error('Error registering admin:', error);
            setError('Failed to register admin');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                await removeAdmin(id);
                setSuccess('Admin deleted successfully!');
                fetchAdmins();
            } catch (error) {
                console.error('Error deleting admin:', error);
                setError('Failed to delete admin');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Manage Admins
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Register new admins and manage existing ones for the wedding management system.
                </Typography>
            </Box>

            {/* Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            {/* Add Admin Button */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Current Admins ({admins.length})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setShowForm(!showForm)}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600
                    }}
                >
                    {showForm ? 'Cancel' : 'Add New Admin'}
                </Button>
            </Box>

            {/* Add Admin Form */}
            {showForm && (
                <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Add New Admin
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Register Admin
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setShowForm(false)}
                                sx={{ textTransform: 'none' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Admins List */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {admins.map((admin) => (
                    <Box key={admin.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' } }}>
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <ShieldIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {admin.name}
                                        </Typography>
                                        <Chip
                                            label="Admin"
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                    {authState.admin?.id !== admin.id && (
                                        <Tooltip title="Delete Admin">
                                            <IconButton
                                                onClick={() => handleDelete(admin.id)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {admin.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {admin.id}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {authState.admin?.id === admin.id && (
                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label="Current User"
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {admins.length === 0 && !loading && (
                <Paper
                    elevation={2}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }}
                >
                    <ShieldIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        No Admins Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        There are currently no admins registered in the system.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setShowForm(true)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Add First Admin
                    </Button>
                </Paper>
            )}

            {/* Floating Action Button for Mobile */}
            <Fab
                color="primary"
                aria-label="add admin"
                onClick={() => setShowForm(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'flex', md: 'none' }
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};
