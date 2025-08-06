import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Invitee, RegistrationType} from '../../models/invitee.model';
import {loadInvitees, registerInvitee, removeInvitee} from '../../services/invitee.service';
import {useAuth} from '../../contexts/AuthContext';
import {
    Box,
    Container,
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
    AppBar,
    Toolbar,
    Avatar,
    Divider,
    Stack,
    InputAdornment,
    Fab,
    Tooltip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    PersonAdd as PersonAddIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    AttachMoney as MoneyIcon,
    Payment as PaymentIcon,
    Groups as GroupsIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';

export const Invitees = () => {
    const [invitees, setInvitees] = useState<Invitee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pledgeAmount: '',
        paymentInstallments: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {authState} = useAuth();

    useEffect(() => {
        fetchInvitees();
    }, []);

    const fetchInvitees = async () => {
        try {
            const inviteesList = await loadInvitees();
            setInvitees(inviteesList || []);
        } catch (error) {
            console.error('Error fetching invitees:', error);
            setError('Failed to load invitees');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (!formData.name || !formData.phone) {
            setError('Name and phone are required');
            setSubmitting(false);
            return;
        }

        try {
            const newInvitee: Invitee = {
                id: Date.now().toString(),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                pledgeAmount: formData.pledgeAmount ? parseFloat(formData.pledgeAmount) : undefined,
                paymentInstallments: formData.paymentInstallments 
                    ? formData.paymentInstallments.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
                    : undefined,
                paidAmount: 0,
                registrationType: RegistrationType.SELF,
                adminId: authState.admin?.id
            };

            await registerInvitee(newInvitee);
            setSuccess('Invitee registered successfully!');
            setFormData({name: '', phone: '', pledgeAmount: '', paymentInstallments: ''});
            setShowForm(false);
            fetchInvitees();
        } catch (error) {
            console.error('Error registering invitee:', error);
            setError('Failed to register invitee');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const resetForm = () => {
        setFormData({name: '', phone: '', pledgeAmount: '', paymentInstallments: ''});
        setError('');
        setSuccess('');
        setShowForm(false);
    };

    const totalPledgeAmount = invitees.reduce((sum, invitee) => sum + (invitee.pledgeAmount || 0), 0);
    const totalPaidAmount = invitees.reduce((sum, invitee) => sum + (invitee.paidAmount || 0), 0);
    const paginatedInvitees = invitees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this invitee?')) {
            try {
                await removeInvitee(id);
                setSuccess('Invitee deleted successfully!');
                fetchInvitees();
            } catch (error) {
                console.error('Error deleting invitee:', error);
                setError('Failed to delete invitee');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
                <CircularProgress size={60}/>
            </Box>
        );
    }

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
                    <IconButton
                        component={Link}
                        to="/admin/dashboard"
                        edge="start"
                        sx={{mr: 2}}
                    >
                        <ArrowBackIcon/>
                    </IconButton>
                    <GroupsIcon sx={{mr: 2, color: 'primary.main'}}/>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1, fontWeight: 600}}>
                        Invitees Management
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setViewMode('cards')}
                            sx={{textTransform: 'none'}}
                        >
                            Cards
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setViewMode('table')}
                            sx={{textTransform: 'none'}}
                        >
                            Table
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{position: 'relative', zIndex: 2, py: 4}}>
                {/* Alerts */}
                {error && (
                    <Alert severity="error" sx={{mb: 3}}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{mb: 3}}>
                        {success}
                    </Alert>
                )}

                {/* Statistics Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'},
                        gap: 3,
                        mb: 4
                    }}
                >
                    <Card elevation={8} sx={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <Avatar sx={{bgcolor: 'primary.main', mx: 'auto', mb: 1}}>
                                <GroupsIcon/>
                            </Avatar>
                            <Typography variant="h4" sx={{fontWeight: 700, color: 'primary.main'}}>
                                {invitees.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Invitees
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={8} sx={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <Avatar sx={{bgcolor: 'success.main', mx: 'auto', mb: 1}}>
                                <MoneyIcon/>
                            </Avatar>
                            <Typography variant="h4" sx={{fontWeight: 700, color: 'success.main'}}>
                                ${totalPledgeAmount.toFixed(0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Pledges
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={8} sx={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <Avatar sx={{bgcolor: 'info.main', mx: 'auto', mb: 1}}>
                                <PaymentIcon/>
                            </Avatar>
                            <Typography variant="h4" sx={{fontWeight: 700, color: 'info.main'}}>
                                ${totalPaidAmount.toFixed(0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Paid
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={8} sx={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
                        <CardContent sx={{textAlign: 'center'}}>
                            <Avatar sx={{bgcolor: 'warning.main', mx: 'auto', mb: 1}}>
                                <MoneyIcon/>
                            </Avatar>
                            <Typography variant="h4" sx={{fontWeight: 700, color: 'warning.main'}}>
                                ${(totalPledgeAmount - totalPaidAmount).toFixed(0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Remaining
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Invitees List */}
                <Card
                    elevation={12}
                    sx={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}
                >
                    <CardContent sx={{p: 0}}>
                        {invitees.length === 0 ? (
                            <Box sx={{textAlign: 'center', py: 8}}>
                                <GroupsIcon sx={{fontSize: 80, color: 'text.disabled', mb: 2}}/>
                                <Typography variant="h6" color="text.secondary">
                                    No invitees found
                                </Typography>
                                <Typography variant="body2" color="text.disabled">
                                    Start by adding your first invitee
                                </Typography>
                            </Box>
                        ) : viewMode === 'cards' ? (
                            <Box sx={{p: 4}}>
                                <Typography variant="h5" gutterBottom sx={{fontWeight: 600, mb: 3}}>
                                    Registered Invitees ({invitees.length})
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'},
                                        gap: 3
                                    }}
                                >
                                    {paginatedInvitees.map((invitee) => (
                                        <Card
                                            key={invitee.id}
                                            elevation={4}
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 2}}>
                                                    <Avatar sx={{bgcolor: 'primary.main'}}>
                                                        <PersonIcon/>
                                                    </Avatar>
                                                    <Box sx={{flexGrow: 1}}>
                                                        <Typography variant="h6" sx={{fontWeight: 600}}>
                                                            {invitee.name}
                                                        </Typography>
                                                        <Chip
                                                            label={invitee.registrationType === RegistrationType.SELF ? 'Self Registered' : 'Admin Registered'}
                                                            size="small"
                                                            color={invitee.registrationType === RegistrationType.SELF ? 'success' : 'primary'}
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Stack>

                                                <Stack spacing={1}>
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                        <PhoneIcon sx={{fontSize: 16, color: 'text.secondary'}}/>
                                                        <Typography variant="body2">{invitee.phone}</Typography>
                                                    </Box>
                                                    {invitee.pledgeAmount && (
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                            <MoneyIcon sx={{fontSize: 16, color: 'success.main'}}/>
                                                            <Typography variant="body2">
                                                                Pledge: <strong>${invitee.pledgeAmount}</strong>
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    {invitee.paidAmount !== undefined && (
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                            <PaymentIcon sx={{fontSize: 16, color: 'info.main'}}/>
                                                            <Typography variant="body2">
                                                                Paid: <strong>${invitee.paidAmount}</strong>
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Stack>

                                                <Stack direction="row" spacing={1} sx={{mt: 2}}>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<DeleteIcon/>}
                                                        onClick={() => handleDelete(invitee.id)}
                                                        sx={{textTransform: 'none'}}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                                <TablePagination
                                    component="div"
                                    count={invitees.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{mt: 3}}
                                />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 600}}>Name</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Phone</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Pledge</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Paid</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Type</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedInvitees.map((invitee) => (
                                            <TableRow key={invitee.id} hover>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar sx={{bgcolor: 'primary.main', width: 32, height: 32}}>
                                                            <PersonIcon sx={{fontSize: 16}}/>
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{fontWeight: 500}}>
                                                            {invitee.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{invitee.phone}</TableCell>
                                                <TableCell>
                                                    {invitee.pledgeAmount ? (
                                                        <Typography variant="body2" sx={{color: 'success.main', fontWeight: 600}}>
                                                            ${invitee.pledgeAmount}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled">
                                                            No pledge
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{color: 'info.main', fontWeight: 600}}>
                                                        ${invitee.paidAmount || 0}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={invitee.registrationType === RegistrationType.SELF ? 'Self' : 'Admin'}
                                                        size="small"
                                                        color={invitee.registrationType === RegistrationType.SELF ? 'success' : 'primary'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(invitee.id)}
                                                    >
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={invitees.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </Container>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000
                }}
                onClick={() => setShowForm(true)}
            >
                <AddIcon/>
            </Fab>

            {/* Add Invitee Dialog */}
            <Dialog
                open={showForm}
                onClose={resetForm}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        backdropFilter: 'blur(10px)'
                    }
                }}
            >
                <DialogTitle sx={{textAlign: 'center', pb: 1}}>
                    <PersonAddIcon sx={{fontSize: 40, color: 'primary.main', mb: 1}}/>
                    <Typography variant="h5" component="div" sx={{fontWeight: 600}}>
                        Register New Invitee
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{pt: 2}}>
                        <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'}, gap: 2}}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Pledge Amount (Optional)"
                                type="number"
                                value={formData.pledgeAmount}
                                onChange={(e) => setFormData({...formData, pledgeAmount: e.target.value})}
                                variant="outlined"
                                inputProps={{min: 0, step: 0.01}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MoneyIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Payment Installments (Optional)"
                                value={formData.paymentInstallments}
                                onChange={(e) => setFormData({...formData, paymentInstallments: e.target.value})}
                                variant="outlined"
                                placeholder="e.g., 100, 150, 200"
                                helperText="Comma-separated amounts"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PaymentIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{p: 3, pt: 1}}>
                        <Button
                            onClick={resetForm}
                            disabled={submitting}
                            sx={{textTransform: 'none', borderRadius: 2}}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={16}/> : <PersonAddIcon/>}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                fontWeight: 600,
                                px: 3
                            }}
                        >
                            {submitting ? 'Registering...' : 'Register Invitee'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};