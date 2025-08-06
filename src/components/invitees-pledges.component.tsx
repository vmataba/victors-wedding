import {Invitee} from "../models/invitee.model";
import {useEffect, useMemo, useState} from "react";
import {loadInvitees, registerInvitee, updateInvitee} from "../services/invitee.service";
import {useAuth} from "../contexts/AuthContext";
import {links} from "../config/links.config";
import {viewInvitationCard} from '../services/invitation-card.service';
// Import the proper Material UI Grid v5 component
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid as MuiGrid,
    IconButton,
    InputAdornment,
    LinearProgress,
    List,
    ListItem,
    Paper,
    Snackbar,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    FileDownload as FileDownloadIcon,
    Payment as PaymentIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import {useParams} from "react-router-dom";

// Override Material UI Grid to add 'item' property support for TypeScript
type GridProps = React.ComponentProps<typeof MuiGrid> & {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
};

const Grid = (props: GridProps) => <MuiGrid {...props} />;

export const InviteePledges = () => {
    const {authState} = useAuth();
    const isAdmin = authState.isAuthenticated && authState.admin !== null;

    const [pledges, setPledges] = useState<Invitee[]>([]);
    const [filteredPledges, setFilteredPledges] = useState<Invitee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [totalPledged, setTotalPledged] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [showFullPhone, setShowFullPhone] = useState<{ [key: string]: boolean }>({});
    const {cardId} = useParams<{ cardId: string }>();


    const [newPledge, setNewPledge] = useState({
        id: new Date().getTime().toString(),
        name: '',
        phone: '',
        pledgeAmount: 0,
        paidAmount: 0,
        paymentInstallments: [] as number[]
    });

    const [selectedPledge, setSelectedPledge] = useState<Invitee | null>(null);
    const [newPayment, setNewPayment] = useState(0);
    const [formErrors, setFormErrors] = useState({
        name: '',
        phone: '',
        pledgeAmount: ''
    });


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });
    const [whatsappDialog, setWhatsappDialog] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (!cardId) {
            return;
        }
        viewInvitationCard(cardId).then(card => {
            if (card) {
                setNewPledge({
                    ...newPledge,
                    name: card.name,
                    phone: card.phone
                })
            }
        })
    });

    // Load invitees data
    useEffect(() => {
        setIsLoading(true);
        loadInvitees()
            .then(invitees => {
                // Sort invitees by pledgeAmount in descending order
                const sortedInvitees = [...invitees].sort((a, b) =>
                    (b.pledgeAmount || 0) - (a.pledgeAmount || 0)
                );
                setPledges(sortedInvitees);
                setFilteredPledges(sortedInvitees);
            })
            .catch(error => {
                console.error('Error loading invitees:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load invitees. Please try again.',
                    severity: 'error'
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const filtered = pledges.filter(pledge =>
            pledge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pledge.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Maintain sorting by pledgeAmount in descending order
        const sortedFiltered = [...filtered].sort((a, b) =>
            (b.pledgeAmount || 0) - (a.pledgeAmount || 0)
        );
        setFilteredPledges(sortedFiltered);
    }, [searchTerm, pledges]);

    useEffect(() => {
        const totalPledged = pledges.reduce((acc, pledge) => acc + (pledge.pledgeAmount || 0), 0);
        const totalPaid = pledges.reduce((acc, pledge) => acc + (pledge.paidAmount || 0), 0);
        setTotalPledged(totalPledged);
        setTotalPaid(totalPaid);
    }, [pledges]);

    // Validate form inputs
    const validateForm = () => {
        const errors = {
            name: '',
            phone: '',
            pledgeAmount: ''
        };
        let isValid = true;

        // Name validation
        if (!newPledge.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }

        // Phone validation (basic format check)
        if (newPledge.phone && !/^\+?[0-9\s-]{9,15}$/.test(newPledge.phone)) {
            errors.phone = 'Please enter a valid phone number';
            isValid = false;
        }

        // Pledge amount validation
        if (newPledge.pledgeAmount < 100) {
            errors.pledgeAmount = 'Enter a valid pledge amount';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Check if form is valid
    const isFormValid = useMemo(() => {
        return (
            newPledge.name.trim() !== '' &&
            (!newPledge.phone || /^\+?[0-9\s-]{9,15}$/.test(newPledge.phone)) &&
            newPledge.phone !== '' &&
            newPledge.pledgeAmount >= 0
        );
    }, [newPledge]);

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setNewPledge({
            id: '',
            name: '',
            phone: '',
            pledgeAmount: 0,
            paidAmount: 0,
            paymentInstallments: []
        });
        setFormErrors({
            name: '',
            phone: '',
            pledgeAmount: ''
        });
    };

    // Handle editing a pledge
    const handleEditPledge = (pledge: Invitee) => {
        setIsEditing(true);
        setNewPledge({
            id: pledge.id,
            name: pledge.name,
            phone: pledge.phone || '',
            pledgeAmount: pledge.pledgeAmount || 0,
            paidAmount: pledge.paidAmount || 0,
            paymentInstallments: pledge.paymentInstallments || []
        });
        setOpenDialog(true);
    };

    // Handle adding or updating a pledge
    const handleAddOrUpdatePledge = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const pledgeData: Invitee = {
                ...newPledge,
                id: newPledge.id
            };

            if (isEditing) {
                await updateInvitee(pledgeData);
                setPledges(pledges.map(p => p.id === pledgeData.id ? pledgeData : p));
                setSnackbar({
                    open: true,
                    message: 'Pledge updated successfully!',
                    severity: 'success'
                });
            } else {
                await registerInvitee(pledgeData);
                setPledges([...pledges, pledgeData]);
                setSnackbar({
                    open: true,
                    message: 'Pledge added successfully!',
                    severity: 'success'
                });
                // Show WhatsApp invitation dialog for new pledges
                setWhatsappDialog(true);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving pledge:', error);
            setSnackbar({
                open: true,
                message: `Failed to ${isEditing ? 'update' : 'add'} pledge. Please try again.`,
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getProgressPercentage = (paid: number, pledged: number) => {
        return pledged > 0 ? (paid / pledged) * 100 : 0;
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'success';
        if (percentage >= 50) return 'warning';
        return 'error';
    };

    // Function to handle adding a payment installment
    const handleAddPayment = async () => {
        if (!selectedPledge || newPayment <= 0) return;

        setIsLoading(true);
        try {
            const paymentInstallments = selectedPledge.paymentInstallments || [];
            const updatedInstallments = [...paymentInstallments, newPayment];
            const totalPaid = updatedInstallments.reduce((sum, amount) => sum + amount, 0);

            const updatedPledge: Invitee = {
                ...selectedPledge,
                paymentInstallments: updatedInstallments,
                paidAmount: totalPaid
            };

            await updateInvitee(updatedPledge);

            // Update the pledges state
            setPledges(pledges.map(p => p.id === updatedPledge.id ? updatedPledge : p));

            setSnackbar({
                open: true,
                message: 'Payment added successfully!',
                severity: 'success'
            });

            setPaymentDialog(false);
            setNewPayment(0);
        } catch (error) {
            console.error('Error adding payment:', error);
            setSnackbar({
                open: true,
                message: 'Failed to add payment. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to toggle phone number visibility
    const togglePhoneVisibility = (pledgeId: string) => {
        setShowFullPhone(prev => ({
            ...prev,
            [pledgeId]: !prev[pledgeId]
        }));
    };

    // Function to export pledges to CSV
    const handleExportToCSV = () => {
        // Create CSV header
        const header = ['Name', 'Phone', 'Pledge Amount (TZS)', 'Paid Amount (TZS)', 'Balance (TZS)', 'Payment Status', 'Payment %'];

        // Create CSV rows from invitees data
        const rows = pledges.map(pledge => {
            const paidAmount = pledge.paidAmount || 0;
            const pledgeAmount = pledge.pledgeAmount || 0;
            const balance = pledgeAmount - paidAmount;
            const paymentStatus = paidAmount >= pledgeAmount ? 'Fully Paid' :
                paidAmount > 0 ? 'Partially Paid' : 'Not Paid';
            const paymentPercentage = pledgeAmount > 0 ?
                Math.round((paidAmount / pledgeAmount) * 100) + '%' : '0%';

            return [
                pledge.name,
                pledge.phone || 'N/A',
                pledgeAmount.toLocaleString(),
                paidAmount.toLocaleString(),
                balance.toLocaleString(),
                paymentStatus,
                paymentPercentage
            ];
        });

        // Combine header and rows
        const csvContent = [
            header.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create a blob and download link
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'Pledges_Report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Container maxWidth="lg" sx={{
            py: 4,
            px: {xs: 2, sm: 3, md: 4} // Responsive padding
        }}>
            {/* Background with wedding theme */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.light, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.light, 0.1)} 50%, 
            ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    zIndex: -2,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha('#FFD700', 0.1)} 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, ${alpha('#FF69B4', 0.1)} 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, ${alpha('#DDA0DD', 0.1)} 0%, transparent 50%)`,
                        animation: 'sparkle 6s ease-in-out infinite alternate'
                    }
                }}
            />

            {/* Header */}
            <Box sx={{
                position: 'relative',
                mb: 4,
                py: 2,
                px: {xs: 1, sm: 2},
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Decorative elements */}
                <Box sx={{
                    position: 'absolute',
                    left: {xs: 0, sm: '10%'},
                    top: 0,
                    width: '20px',
                    height: '20px',
                    backgroundImage: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.8)}, transparent)`,
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)',
                    animation: 'sparkle 3s ease-in-out infinite alternate'
                }}/>
                <Box sx={{
                    position: 'absolute',
                    right: {xs: 0, sm: '10%'},
                    bottom: 0,
                    width: '20px',
                    height: '20px',
                    backgroundImage: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.8)}, transparent)`,
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(100, 149, 237, 0.5)',
                    animation: 'sparkle 2.5s ease-in-out infinite alternate-reverse'
                }}/>

                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        textAlign: 'center',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
                        backgroundSize: '300% 300%',
                        animation: 'gradientShift 8s ease infinite',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        letterSpacing: {xs: '0.5px', md: '1px'},
                        textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontSize: {xs: '2rem', sm: '2.5rem', md: '3rem'},
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            width: '60px',
                            height: '3px',
                            background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main}, transparent)`,
                            transform: 'translateX(-50%)'
                        }
                    }}
                >
                    Wedding Pledges
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 2,
                        color: alpha(theme.palette.text.secondary, 0.85),
                        fontStyle: 'italic',
                        fontSize: {xs: '0.85rem', sm: '1rem'}
                    }}
                >
                    Celebrate with us by contributing to our special day
                </Typography>
            </Box>

            {/* Global Styles for animations */}
            <Box sx={{
                '@keyframes gradientShift': {
                    '0%': {backgroundPosition: '0% 50%'},
                    '50%': {backgroundPosition: '100% 50%'},
                    '100%': {backgroundPosition: '0% 50%'}
                },
                '@keyframes sparkle': {
                    '0%': {opacity: 0.4, transform: 'scale(0.8)'},
                    '100%': {opacity: 1, transform: 'scale(1.2)'}
                }
            }}/>

            {/* Statistics Cards - Removed */}

            {/* Search Bar */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)}, ${alpha('#FFFFFF', 0.7)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary"/>
                            </InputAdornment>
                        ),
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }
                    }}
                />
            </Paper>

            {/* Pledges List */}
            <Paper
                elevation={0}
                sx={{
                    background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)}, ${alpha('#FFFFFF', 0.7)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.dark, 0.08)}`
                }}>
                {/* Decorative elements */}
                <Box sx={{
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)}, transparent 70%)`,
                    zIndex: 0
                }}/>
                <Box sx={{
                    position: 'absolute',
                    right: 60,
                    bottom: 40,
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.1)}, transparent 70%)`,
                    zIndex: 0
                }}/>
                {/* Floating Action Button at the top right of pledges list */}
                <Fab
                    color="primary"
                    aria-label="add pledge"
                    onClick={() => setOpenDialog(true)}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: {xs: 16, sm: 20},
                        right: {xs: 16, sm: 24},
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                            transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                >
                    <AddIcon fontSize="small"/>
                </Fab>

                <Box sx={{
                    p: {xs: 2, sm: 3},
                    pt: {xs: 4, sm: 5},  // Added extra top padding to accommodate the FAB
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {xs: 'flex-start', sm: 'center'},
                        justifyContent: 'space-between',
                        gap: {xs: 1, sm: 2}
                    }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.text.primary,
                                mb: {xs: 1, sm: 0}
                            }}
                        >
                            Showing {filteredPledges.length} of {pledges.length} Pledges
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', sm: 'row'},
                            gap: 1,
                            alignItems: {xs: 'flex-start', sm: 'center'},
                            mt: {md: 4, sm: 0}
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body2" sx={{mr: 1, whiteSpace: 'nowrap'}}>
                                    Total Pledged:
                                </Typography>
                                <Chip
                                    label={totalPledged.toLocaleString('en-US', {style: 'currency', currency: 'TZS'})}
                                    color="primary"
                                    size="small"
                                    sx={{fontWeight: 'bold'}}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body2" sx={{mr: 1, whiteSpace: 'nowrap'}}>
                                    Total Paid:
                                </Typography>
                                <Chip
                                    label={totalPaid.toLocaleString('en-US', {style: 'currency', currency: 'TZS'})}
                                    color="success"
                                    size="small"
                                    sx={{fontWeight: 'bold'}}
                                    variant="outlined"
                                />
                            </Box>
                            {isAdmin && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<FileDownloadIcon/>}
                                    onClick={handleExportToCSV}
                                    sx={{
                                        ml: {xs: 0, sm: 2},
                                        borderColor: alpha(theme.palette.success.main, 0.5),
                                        color: theme.palette.success.main,
                                        '&:hover': {
                                            borderColor: theme.palette.success.main,
                                            backgroundColor: alpha(theme.palette.success.main, 0.1)
                                        }
                                    }}
                                >
                                    Export Excel
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{p: {xs: 1, sm: 2}, display: 'grid', gap: {xs: 1, sm: 1.5}, width: '100%'}}>
                    {filteredPledges.map((pledge, index) => {
                        const progressPercentage = getProgressPercentage(pledge.paidAmount || 0, pledge.pledgeAmount || 0);
                        const progressColor = getProgressColor(progressPercentage);

                        return (
                            <Paper
                                key={pledge.id || index}
                                elevation={0}
                                sx={{
                                    p: {xs: 1.5, sm: 2},
                                    borderRadius: 1.5,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)}, ${alpha('#FFFFFF', 0.85)})`,
                                    backdropFilter: 'blur(5px)',
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                                        borderColor: alpha(theme.palette.primary.main, 0.15)
                                    }
                                }}
                            >
                                {/* Minimal decorative element */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    width: '3px',
                                    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    borderTopLeftRadius: 1.5,
                                    borderBottomLeftRadius: 1.5
                                }}/>

                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, width: '100%'}}>
                                    {/* Avatar and Name */}
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, flex: '0 0 auto'}}>
                                        <Avatar
                                            sx={{
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                width: 36,
                                                height: 36,
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {pledge.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box sx={{minWidth: 0}}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem',
                                                    color: theme.palette.text.primary,
                                                    lineHeight: 1.2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {pledge.name}
                                            </Typography>
                                            {pledge.phone && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        color: alpha(theme.palette.text.secondary, 0.8),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mt: 0.2
                                                    }}
                                                >
                                                    <PhoneIcon sx={{fontSize: '0.7rem'}}/>
                                                    {isAdmin ? (
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                            {showFullPhone[pledge.id] ? pledge.phone : `${pledge.phone.substring(0, 3)}***`}
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    togglePhoneVisibility(pledge.id);
                                                                }}
                                                                sx={{p: 0.2}}
                                                            >
                                                                {showFullPhone[pledge.id] ?
                                                                    <VisibilityOffIcon sx={{fontSize: '0.7rem'}}/> :
                                                                    <VisibilityIcon sx={{fontSize: '0.7rem'}}/>
                                                                }
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        `${pledge.phone.substring(0, 3)}***`
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Pledge Amount */}
                                    <Box sx={{flex: '0 0 auto', textAlign: 'right', minWidth: 100}}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.primary.main,
                                                fontSize: '0.9rem',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {pledge.pledgeAmount?.toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }) || 'TZS 0'}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: '0.7rem',
                                                color: alpha(theme.palette.text.secondary, 0.7)
                                            }}
                                        >
                                            Pledged
                                        </Typography>
                                    </Box>

                                    {/* Progress and Actions */}
                                    <Box sx={{flex: 1, minWidth: 120}}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 0.5
                                        }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                    color: progressColor === 'success' ? theme.palette.success.main :
                                                        progressColor === 'warning' ? theme.palette.warning.main :
                                                            theme.palette.error.main
                                                }}
                                            >
                                                {Math.round(progressPercentage)}% paid
                                            </Typography>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                                {progressPercentage >= 100 && (
                                                    <CheckCircleIcon
                                                        sx={{
                                                            fontSize: '1rem',
                                                            color: theme.palette.success.main
                                                        }}
                                                    />
                                                )}
                                                <IconButton
                                                    size="small"
                                                    aria-label="edit pledge"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditPledge(pledge);
                                                    }}
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.15)
                                                        }
                                                    }}
                                                >
                                                    <EditIcon sx={{fontSize: '0.8rem'}}/>
                                                </IconButton>

                                                {isAdmin && (
                                                    <IconButton
                                                        size="small"
                                                        aria-label="add payment"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedPledge(pledge);
                                                            setPaymentDialog(true);
                                                        }}
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            bgcolor: alpha(theme.palette.success.main, 0.08),
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.success.main, 0.15)
                                                            }
                                                        }}
                                                    >
                                                        <PaymentIcon sx={{fontSize: '0.8rem'}}/>
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(progressPercentage, 100)}
                                            color={progressColor}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: alpha(theme.palette.grey[300], 0.2),
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 3
                                                }
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                textAlign: 'right',
                                                mt: 0.3,
                                                fontSize: '0.65rem',
                                                color: alpha(theme.palette.text.secondary, 0.7)
                                            }}
                                        >
                                            {(pledge.paidAmount || 0).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })} paid
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>

                {filteredPledges.length === 0 && (
                    <Box sx={{p: 8, textAlign: 'center'}}>
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: alpha(theme.palette.grey[200], 0.6),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                mb: 3,
                                animation: 'pulse 2s infinite ease-in-out'
                            }}
                        >
                            <PersonIcon
                                sx={{
                                    fontSize: 70,
                                    color: alpha(theme.palette.grey[500], 0.8)
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                mb: 1.5
                            }}
                        >
                            No pledges found
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: alpha(theme.palette.text.secondary, 0.7),
                                maxWidth: 400,
                                mx: 'auto'
                            }}
                        >
                            {searchTerm ? 'Try adjusting your search terms or clear the search field' : 'Start by adding your first pledge using the + button above'}
                        </Typography>
                    </Box>
                )}

                {/* Add global animation keyframes */}
                <Box sx={{
                    '@keyframes pulse': {
                        '0%': {transform: 'scale(1)', opacity: 0.8},
                        '50%': {transform: 'scale(1.05)', opacity: 1},
                        '100%': {transform: 'scale(1)', opacity: 0.8}
                    }
                }}/>
            </Paper>


            {/* Add Pledge Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={window.innerWidth < 600} // Fullscreen on mobile
                PaperProps={{
                    sx: {
                        background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)}, ${alpha('#FFFFFF', 0.9)})`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: {xs: 0, sm: 3}, // No border radius on mobile fullscreen
                        m: {xs: 0, sm: 2}, // No margin on mobile fullscreen
                        width: '100%',
                        height: {xs: '100%', sm: 'auto'}
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    py: {xs: 2, sm: 2.5},
                    px: {xs: 2, sm: 3}
                }}>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '1.1rem', sm: '1.25rem'}
                        }}
                    >
                        {isEditing ? 'Update Pledge' : 'Add New Pledge'}
                    </Typography>
                    <IconButton
                        onClick={() => setOpenDialog(false)}
                        sx={{
                            color: theme.palette.grey[700],
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.grey[400], 0.1)
                            }
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Grid spacing={3}>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField
                                placeholder={'Enter your name'}
                                fullWidth
                                label="Name"
                                variant="outlined"
                                value={newPledge.name}
                                onChange={(e) => setNewPledge({...newPledge, name: e.target.value})}
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="primary"/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{mt: 2}}>
                            <Box sx={{mb: 1, ml: 1}}>
                                <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                    Phone Number
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                placeholder="Ex: 0755 XXX XXX"
                                variant="outlined"
                                value={newPledge.phone}
                                onChange={(e) => setNewPledge({...newPledge, phone: e.target.value})}
                                error={!!formErrors.phone}
                                helperText={formErrors.phone}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon color="primary"/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{mt: 2}}>
                            <Box sx={{mb: 1, ml: 1}}>
                                <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                    Pledge Amount (TZS)
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="1,000,000.00"
                                value={
                                    // If being edited or empty, show plain number
                                    newPledge.pledgeAmount === 0 ? '' :
                                        // Otherwise format with commas for thousands separators
                                        new Intl.NumberFormat('en-US').format(newPledge.pledgeAmount)
                                }
                                onChange={(e) => {
                                    // Remove all non-numeric characters except for decimal point
                                    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                                    // Handle potential multiple decimal points
                                    const parts = rawValue.split('.');
                                    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
                                    setNewPledge({
                                        ...newPledge,
                                        pledgeAmount: formattedValue ? Number(formattedValue) : 0
                                    });
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            TZS
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!formErrors.pledgeAmount}
                                helperText={formErrors.pledgeAmount}
                            />
                        </Grid>

                        {isAdmin && (
                            <Grid item xs={12} sx={{mt: 2}}>
                                <Box sx={{mb: 1, ml: 1}}>
                                    <Typography variant="subtitle1" color="success" fontWeight="medium">
                                        Paid Amount (TZS)
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="500,000.00"
                                    value={
                                        newPledge.paidAmount === 0 ? '' :
                                            new Intl.NumberFormat('en-US').format(newPledge.paidAmount)
                                    }
                                    onChange={(e) => {
                                        // Remove all non-numeric characters except for decimal point
                                        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                                        // Handle potential multiple decimal points
                                        const parts = rawValue.split('.');
                                        const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
                                        setNewPledge({
                                            ...newPledge,
                                            paidAmount: formattedValue ? Number(formattedValue) : 0
                                        });
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                TZS
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{p: 3, pt: 1}}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{mr: 1}}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddOrUpdatePledge}
                        variant="contained"
                        disabled={isLoading || !isFormValid}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : null}
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                            }
                        }}
                    >
                        {isLoading ? 'Saving...' : isEditing ? 'Update Pledge' : 'Add Pledge'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Payment Dialog for Admins */}
            {isAdmin && (
                <Dialog
                    open={paymentDialog}
                    onClose={() => setPaymentDialog(false)}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)}, ${alpha('#FFFFFF', 0.9)})`,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 3,
                            m: 2,
                            width: 'calc(100% - 32px)',
                            maxWidth: '400px'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: `linear-gradient(45deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        py: 2,
                        px: 3
                    }}>
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <PaymentIcon fontSize="small"/>
                            Add Payment
                        </Typography>
                        <IconButton
                            onClick={() => setPaymentDialog(false)}
                            sx={{
                                color: theme.palette.grey[700],
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.grey[400], 0.1)
                                }
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{pt: 3}}>
                        {selectedPledge && (
                            <>
                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {selectedPledge.name}
                                    </Typography>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Pledged Amount:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium" color="primary.main">
                                            {(selectedPledge.pledgeAmount || 0).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 0.5}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Paid Amount:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium" color="success.main">
                                            {(selectedPledge.paidAmount || 0).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 0.5}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Balance:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium" color="error.main">
                                            {((selectedPledge.pledgeAmount || 0) - (selectedPledge.paidAmount || 0)).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{mt: 2}}>
                                    <Typography variant="subtitle2" color="primary" sx={{mb: 1, ml: 1}}>
                                        Payment Amount (TZS)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="100,000.00"
                                        value={
                                            newPayment === 0 ? '' :
                                                new Intl.NumberFormat('en-US').format(newPayment)
                                        }
                                        onChange={(e) => {
                                            // Remove all non-numeric characters except for decimal point
                                            const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                                            // Handle potential multiple decimal points
                                            const parts = rawValue.split('.');
                                            const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
                                            setNewPayment(formattedValue ? Number(formattedValue) : 0);
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    TZS
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                {selectedPledge.paymentInstallments && selectedPledge.paymentInstallments.length > 0 && (
                                    <Box sx={{mt: 3}}>
                                        <Typography variant="subtitle2" sx={{mb: 1}}>
                                            Payment History
                                        </Typography>
                                        <List sx={{
                                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                                            borderRadius: 1,
                                            maxHeight: '150px',
                                            overflow: 'auto'
                                        }}>
                                            {selectedPledge.paymentInstallments.map((payment, index) => (
                                                <ListItem key={index} sx={{py: 0.5}}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '100%'
                                                    }}>
                                                        <Typography variant="body2">
                                                            Payment #{index + 1}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {payment.toLocaleString('en-US', {
                                                                style: 'currency',
                                                                currency: 'TZS',
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                            </>
                        )}
                    </DialogContent>

                    <DialogActions sx={{p: 3, pt: 1}}>
                        <Button
                            onClick={() => setPaymentDialog(false)}
                            variant="outlined"
                            sx={{mr: 1}}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddPayment}
                            variant="contained"
                            disabled={isLoading || newPayment <= 0}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : null}
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.primary.dark})`
                                }
                            }}
                        >
                            {isLoading ? 'Adding...' : 'Add Payment'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        border: snackbar.severity === 'success'
                            ? `1px solid ${alpha(theme.palette.success.main, 0.5)}`
                            : snackbar.severity === 'error'
                                ? `1px solid ${alpha(theme.palette.error.main, 0.5)}`
                                : 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    icon={snackbar.severity === 'success' ? <CheckCircleIcon/> : undefined}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* WhatsApp Group Invitation Dialog */}
            <Dialog
                open={whatsappDialog}
                onClose={() => setWhatsappDialog(false)}
                aria-labelledby="whatsapp-dialog-title"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        background: 'linear-gradient(135deg, #075e54 0%, #128C7E 100%)',
                        color: 'white',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'url("./images/whatsapp-bg.png")',
                            backgroundSize: '200px',
                            opacity: 0.05,
                            zIndex: 0
                        }
                    }
                }}
            >
                <DialogTitle id="whatsapp-dialog-title" sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    pb: 1,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1}}>
                        <img
                            src="./images/whatsapp-icon.svg"
                            alt="WhatsApp"
                            style={{width: '32px', height: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}
                        />
                        Join Our WhatsApp Group
                    </Box>
                </DialogTitle>
                <DialogContent sx={{position: 'relative', zIndex: 1}}>
                    <Typography variant="body1" sx={{textAlign: 'center', mb: 2}}>
                        Thank you for your pledge! Join our WhatsApp group to stay updated about the wedding
                        preparations and connect with other guests.
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        my: 2,
                        '& img': {
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '3px solid white'
                        }
                    }}>
                        <img src="./images/11.gif" alt="Wedding"/>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    pb: 3,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <Button
                        onClick={() => setWhatsappDialog(false)}
                        variant="outlined"
                        sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Later
                    </Button>
                    <Button
                        onClick={() => {
                            window.open(links.whatsapp, '_blank');
                            setWhatsappDialog(false);
                        }}
                        variant="contained"
                        sx={{
                            backgroundColor: '#25D366',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#1da851'
                            }
                        }}
                        startIcon={<img
                            src="./images/whatsapp-icon.svg"
                            alt="WhatsApp"
                            style={{width: '20px', height: '20px', filter: 'brightness(0) invert(1)'}}
                        />}
                    >
                        Join Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};