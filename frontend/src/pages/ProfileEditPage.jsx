import React, { useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from '../hooks/SnackBarProvider';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, updateProfile } from '../store/authSlice';
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    Paper,
    Grid,
} from '@mui/material';
import {
    motion,
    AnimatePresence
} from 'framer-motion';
import {
    Save as SaveIcon,
    VerifiedUser as VerifiedUserIcon,
    LocationOn as LocationIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import config from '../config';

const ProfileEditPage = () => {

    const { district, state, name, email, profile_image } = useSelector(state => state?.auth?.userInfo) || {};

    const [profile, setProfile] = useState({ district, state, name });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const openSnackbar = useSnackbar();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Edit Profile'));
        // eslint-disable-next-line
    }, [])

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                type: "tween"
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {

            await axios.put(`${config.SERVER_BASE_ADDRESS}/api/user/profile`, profile, {
                withCredentials: true,
            });

            // Update Store
            dispatch(updateProfile(profile));

            openSnackbar('Profile Updated Successfully', 'success');
        } catch (error) {
            openSnackbar(error.response?.data?.message || 'Failed to update profile', 'danger')
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                p: 2
            }}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    width: '100%',
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    src={profile_image}
                                    slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        mr: 3,
                                        border: '3px solid darkgreen'
                                    }}
                                />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {name}
                                        <VerifiedUserIcon
                                            color='success'
                                            sx={{
                                                ml: 1,
                                                verticalAlign: 'middle'
                                            }}
                                        />
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profile.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <EmailIcon color='success' sx={{ mr: 1, verticalAlign: 'middle' }} />
                                {email}
                            </Typography>
                            <Typography variant="body1">
                                <LocationIcon color='success' sx={{ mr: 1, verticalAlign: 'middle' }} />
                                {district}, {state}
                            </Typography>
                        </Box>

                        <AnimatePresence>
                            <motion.div
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Grid container spacing={2}>
                                    {['name', 'district', 'state'].map((field) => (
                                        <Grid item sm={12} key={field}>
                                            <motion.div variants={itemVariants}>
                                                <TextField
                                                    fullWidth
                                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                                    name={field}
                                                    value={profile[field]}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    margin="dense"
                                                    color='success'
                                                />
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>

                                <motion.div
                                    variants={itemVariants}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 16,
                                        marginTop: 16
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        color='success'
                                        onClick={handleSave}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default ProfileEditPage;