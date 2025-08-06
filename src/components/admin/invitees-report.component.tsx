import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { loadInvitees } from '../../services/invitee.service';
import { Invitee } from '../../models/invitee.model';

export const InviteesReport = () => {
    const [invitees, setInvitees] = useState<Invitee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvitees();
    }, []);

    const fetchInvitees = async () => {
        try {
            const inviteesList = await loadInvitees();
            setInvitees(inviteesList || []);
        } catch (error) {
            console.error('Error fetching invitees:', error);
            setError('Failed to load invitees report');
        } finally {
            setLoading(false);
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
                    Invitees Report
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View detailed reports and analytics for wedding invitees and their pledges.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Report Content */}
            <Paper
                elevation={2}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }}
            >
                <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Report Dashboard Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Detailed invitees reports and analytics will be available here.
                    Currently showing {invitees.length} total invitees.
                </Typography>
            </Paper>
        </Box>
    );
};