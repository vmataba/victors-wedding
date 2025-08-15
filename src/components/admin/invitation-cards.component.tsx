import React, { useState, useEffect, useRef } from 'react';
import { InvitationCard } from '../../models/invitation-card.mode';
import { 
    loadInvitationCards, 
    createInvitationCard, 
    updateInvitationCard, 
    removeInvitationCard 
} from '../../services/invitation-card.service';
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
    Paper,
    Stack,
    Fab,
    Tooltip,
    Divider,
    Avatar,
    InputAdornment,
    Snackbar,
    alpha,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CardGiftcard as CardIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    Share as ShareIcon,
    ContentCopy as CopyIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";

export const InvitationCards = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    
    const [invitationCards, setInvitationCards] = useState<InvitationCard[]>([]);
    const [filteredCards, setFilteredCards] = useState<InvitationCard[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState<InvitationCard | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [copiedCardName, setCopiedCardName] = useState('');

    useEffect(() => {
        fetchInvitationCards();
    }, []);
    
    // Filter cards based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCards(invitationCards);
            return;
        }
        
        const query = searchQuery.toLowerCase();
        const filtered = invitationCards.filter(card => 
            card.name.toLowerCase().includes(query) || 
            card.phone.toLowerCase().includes(query)
        );
        
        setFilteredCards(filtered);
    }, [searchQuery, invitationCards]);

    const fetchInvitationCards = async () => {
        try {
            const cards = await loadInvitationCards();
            setInvitationCards(cards || []);
            setFilteredCards(cards || []);
        } catch (error) {
            console.error('Error fetching invitation cards:', error);
            setError('Failed to load invitation cards');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.phone) {
            setError('Name and phone number are required');
            return;
        }

        try {
            if (editingCard) {
                // Update existing card
                const updatedCard: InvitationCard = {
                    ...editingCard,
                    name: formData.name,
                    phone: formData.phone
                };
                await updateInvitationCard(updatedCard);
                setSuccess('Invitation card updated successfully!');
            } else {
                // Create new card
                const newCard: InvitationCard = {
                    id: Date.now().toString(),
                    name: formData.name,
                    phone: formData.phone
                };
                await createInvitationCard(newCard);
                setSuccess('Invitation card created successfully!');
            }

            setFormData({ name: '', phone: '' });
            setShowForm(false);
            setEditingCard(null);
            fetchInvitationCards();
        } catch (error) {
            console.error('Error saving invitation card:', error);
            setError('Failed to save invitation card');
        }
    };

    const handleEdit = (card: InvitationCard) => {
        setEditingCard(card);
        setFormData({
            name: card.name,
            phone: card.phone
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this invitation card?')) {
            try {
                await removeInvitationCard(id);
                setSuccess('Invitation card deleted successfully!');
                fetchInvitationCards();
            } catch (error) {
                console.error('Error deleting invitation card:', error);
                setError('Failed to delete invitation card');
            }
        }
    };

    const handleViewCard = (card: InvitationCard) => {
        // Open the invitation card in a new tab
        const url = `/victors-wedding/invitation-card/${btoa(card.id)}`;
        window.open(url, '_blank');
    };
    
    const handleCopyLink = (card: InvitationCard) => {
        const baseUrl = window.location.origin;
        const cardUrl = `${baseUrl}/victors-wedding/invitation-card/${btoa(card.id)}`;
        
        navigator.clipboard.writeText(cardUrl)
            .then(() => {
                setCopiedCardName(card.name);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 3000);
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                setError('Failed to copy link to clipboard');
            });
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    
    const clearSearch = () => {
        setSearchQuery('');
    };

    const resetForm = () => {
        setFormData({ name: '', phone: '' });
        setEditingCard(null);
        setShowForm(false);
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
                    Invitation Cards
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Create and manage wedding invitation cards for your guests.
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

            {/* Search and Add Card Section */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}>
                <Box sx={{ flex: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={clearSearch}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-end' } }}>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setShowForm(!showForm)}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            fontWeight: 600,
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        Create New Card
                    </Button>
                </Box>
            </Box>
            
            {/* Cards Count */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {searchQuery ? `Found ${filteredCards.length} cards` : `All Cards (${invitationCards.length})`}
                </Typography>
            </Box>

            {/* Invitation Cards List */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
                {filteredCards.map((card) => (
                    <Box key={card.id}>
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
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <CardIcon />
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {card.name}
                                        </Typography>
                                        <Chip
                                            label="Invitation Card"
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {card.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {card.phone}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* Main Action Buttons - Always Vertical on Mobile */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', md: 'row' },
                                        gap: 1.5,
                                        width: '100%'
                                    }}>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewCard(card)}
                                            sx={{ 
                                                textTransform: 'none',
                                                borderRadius: 1.5,
                                                py: { xs: 1, sm: 0.75 }
                                            }}
                                        >
                                            View Card
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            startIcon={<CopyIcon />}
                                            onClick={() => handleCopyLink(card)}
                                            sx={{ 
                                                textTransform: 'none',
                                                borderRadius: 1.5,
                                                py: { xs: 1, sm: 0.75 }
                                            }}
                                        >
                                            Copy Link
                                        </Button>
                                    </Box>
                                    
                                    {/* Edit/Delete Buttons */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        mt: { xs: 0.5, sm: 1 }
                                    }}>
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(card)}
                                            sx={{ 
                                                textTransform: 'none',
                                                color: theme.palette.primary.main,
                                                fontWeight: 500,
                                                fontSize: '0.85rem',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                                                }
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(card.id)}
                                            sx={{ 
                                                textTransform: 'none',
                                                color: theme.palette.error.main,
                                                fontWeight: 500,
                                                fontSize: '0.85rem',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.error.main, 0.08)
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {filteredCards.length === 0 && !loading && (
                <Paper
                    elevation={2}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }}
                >
                    <CardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        No Invitation Cards Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery ? 'No cards match your search criteria.' : 'Create your first invitation card to get started.'}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setShowForm(true)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Create First Card
                    </Button>
                </Paper>
            )}

            {/* Create/Edit Card Dialog */}
            <Dialog
                open={showForm}
                onClose={resetForm}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <CardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
                        {editingCard ? 'Edit Invitation Card' : 'Create New Invitation Card'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Guest Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                            required
                            variant="outlined"
                            placeholder="Enter guest's full name"
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            margin="normal"
                            required
                            variant="outlined"
                            placeholder="Enter phone number"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 2 }}>
                        <Button
                            onClick={resetForm}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                        >
                            {editingCard ? 'Update Card' : 'Create Card'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Floating Action Button for Mobile */}
            <Fab
                color="primary"
                aria-label="create invitation card"
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
            {/* Copy Success Snackbar */}
            <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={() => setCopySuccess(false)}
                message={`Link for ${copiedCardName} copied to clipboard!`}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.success.contrastText
                    }
                }}
            />
        </Box>
    );
};
