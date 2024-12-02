import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSnackbar } from '../hooks/SnackBarProvider';
import config from '../config';

const AddressForm = () => {
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const openSnackBar = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`${config.SERVER_BASE_ADDRESS}/api/user/profile`, {
                district,
                state
            }, {withCredentials: true});
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            openSnackBar(err?.response?.data?.message || err?.message);
            setLoading(false);
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 450,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: '#333',
                        mb: 3
                    }}
                >
                    Provide Address Details
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <TextField
                                fullWidth
                                label="District"
                                color='warning'
                                variant="outlined"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                required
                                error={!!error}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TextField
                                fullWidth
                                label="State"
                                color='warning'
                                variant="outlined"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                                error={!!error}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Typography
                                    color="error"
                                    variant="body2"
                                    sx={{ textAlign: 'center' }}
                                >
                                    {error}
                                </Typography>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Update Details'
                                )}
                            </Button>
                        </motion.div>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default AddressForm;