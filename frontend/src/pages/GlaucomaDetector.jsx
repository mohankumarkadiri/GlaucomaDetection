import React, { useState, useRef, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Error from '../common/Error';
import config from '../config';
import {
    Box,
    Typography,
    Stack,
    Container,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
    LinearProgress,
    Fade,
    useTheme
} from '@mui/material';
import {
    UploadFile as UploadIcon,
    Warning as WarningIcon,
    LocalHospital as HospitalIcon,
    CheckCircleOutline as HealthyIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import GlaucomaPrecautions from '../components/GlaucomaPrecautions';
import RenderSpecialists from '../components/RenderSpecialists';

import EYE_SPECIALISTS from '../assets/doctors.json';

const USER_LOCATION = {
    district: 'Coorg',
    state: 'Karnataka'
};

const GlaucomaDetector = () => {
    
    const [detectionResult, setDetectionResult] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [specialistDialogOpen, setSpecialistDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const theme = useTheme();

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Glaucoma Detector'))
        // eslint-disable-next-line
    }, [])

    const performDetection = async (file) => {
        setIsProcessing(true);
        setError(null);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${config.SERVER_BASE_ADDRESS}/api/predict`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });

            const { label, confidence } = response.data;

            setDetectionResult({
                status: label,
                confidence: parseFloat(confidence).toFixed(2)
            });
        } catch (error) {
            console.error("Detection failed:", error);
            setError(`Failed to analyze image. Please try again. Reason: ${error?.response?.data?.message || error?.message}`);
            setDetectionResult(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setDetectionResult(null);
        setError(null);

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        performDetection(file);
    };

    function getFilteredDoctors(district, state) {
        const districtMatches = EYE_SPECIALISTS.filter(doctor => doctor?.district?.toLowerCase() === district?.toLowerCase());
        const stateMatches = EYE_SPECIALISTS.filter(
            doctor =>
                doctor?.state?.toLowerCase() === state?.toLowerCase() &&
                doctor?.district?.toLowerCase() !== district?.toLowerCase()
        );

        const filteredDoctors = [...districtMatches, ...stateMatches];

        return filteredDoctors?.length > 0 ? filteredDoctors : EYE_SPECIALISTS;
    }


    const renderLocalSpecialists = () => {
        const localSpecialists = getFilteredDoctors(USER_LOCATION.district, USER_LOCATION.state);

        return <RenderSpecialists specialists={localSpecialists} />
    };



    return (
        <Container maxWidth="lg" sx={{ height: '100%' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ height: '100%' }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        height: '100%',
                        background: '#f9f9f9',
                    }}
                >
                    <Box p={4} sx={{ height: '100%', margin: 0 }}>
                        <Stack spacing={4} alignItems="center" sx={{ height: '100%', margin: 0 }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ width: '100%', margin: 0 }}
                            >
                                <Paper
                                    elevation={0}
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        border: `2px dashed ${theme.palette.success.main}`,
                                        borderRadius: 3,
                                        bgcolor: 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <UploadIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                                    <Typography variant="h5" color="success.main" gutterBottom>
                                        Upload Retinal Scan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Click to select
                                    </Typography>
                                </Paper>
                            </motion.div>

                            {error && (
                                <Box sx={{ height: '100%' }}>
                                    <Error errors={error} />
                                </Box>
                            )}

                            <Fade in={isProcessing}>
                                <Box sx={{ width: '100%', marginTop: '20px !important' }}>
                                    <LinearProgress color="success" />
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                        Analyzing image...
                                    </Typography>
                                </Box>
                            </Fade>

                            <AnimatePresence>
                                {imagePreview && detectionResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        style={{ width: '100%', margin: 0 }}
                                    >
                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    flex: 1,
                                                    overflow: 'hidden',
                                                    background: 'transparent',
                                                    boxShadow: 'none !important'
                                                }}
                                            >
                                                <img
                                                    src={imagePreview}
                                                    alt="Retinal Scan"
                                                    style={{
                                                        width: '100%',
                                                        height: '270px',
                                                        objectFit: 'cover',
                                                        borderRadius: '7px',
                                                    }}
                                                />
                                            </Paper>

                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    flex: 1,
                                                    p: 3,
                                                    borderRadius: 2,
                                                    bgcolor: detectionResult.status === 'Glaucoma'
                                                        ? 'error.lighter'
                                                        : 'success.lighter'
                                                }}
                                            >
                                                <Stack spacing={3}>
                                                    <Box display="flex" alignItems="center" justifyContent="center">
                                                        {detectionResult.status === 'Glaucoma' ? (
                                                            <WarningIcon sx={{ fontSize: 40, color: 'error.main', mr: 1 }} />
                                                        ) : (
                                                            <HealthyIcon sx={{ fontSize: 40, color: 'success.main', mr: 1 }} />
                                                        )}
                                                        <Typography variant="h5" color={detectionResult.status === 'Glaucoma' ? 'error.main' : 'success.main'}>
                                                            {detectionResult.status === 'Glaucoma' ? 'Glaucoma Detected' : 'Healthy Scan'}
                                                            <GlaucomaPrecautions />
                                                        </Typography>
                                                    </Box>

                                                    <Box textAlign="center">
                                                        <Typography variant="h6" gutterBottom>
                                                            Confidence Score
                                                        </Typography>
                                                        <Typography variant="h4" color="success">
                                                            {detectionResult.confidence}%
                                                        </Typography>
                                                    </Box>

                                                    {detectionResult.status === 'Glaucoma' && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="large"
                                                            startIcon={<HospitalIcon />}
                                                            onClick={() => setSpecialistDialogOpen(true)}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Find Local Specialists
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Paper>
                                        </Stack>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Stack>
                    </Box>
                </Paper>
            </motion.div>

            {/* Specialists Dialog */}
            <Dialog
                open={specialistDialogOpen}
                onClose={() => setSpecialistDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Recommended  Eye Specialists based on your location : <b>{USER_LOCATION.district}, {USER_LOCATION.state}</b>
                        </Typography>
                        <IconButton onClick={() => setSpecialistDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {renderLocalSpecialists()}
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default GlaucomaDetector;