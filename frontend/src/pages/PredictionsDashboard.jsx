import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Typography,
    Container,
    Paper,
    Avatar,
    Dialog,
    DialogContent,
    Chip,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    LocalHospital as MedicalIcon,
    Visibility as ViewIcon,
    TrendingUp as ConfidenceIcon,
    Label as LabelIcon,
    Check as HighConfidenceIcon,
    Warning as MediumConfidenceIcon,
    ErrorOutline as LowConfidenceIcon,
    AccessTime as AccessTimeIcon,
    LabelImportant as LabelImportantIcon,
    Percent as PercentIcon,
} from '@mui/icons-material';
import config from '../config';

const COLOR_PALETTE = {
    Glaucoma: {
        primary: '#F44336',
        secondary: '#FFCDD2',
        gradient: 'linear-gradient(135deg, #FFABAB 0%, #FFCDD2 100%)'
    },
    Normal: {
        primary: '#308b34',
        secondary: '#C8E6C9',
        gradient: 'linear-gradient(135deg, #A5D6A7 0%, #81C784 100%)'
    }
};



const PredictionCard = ({ prediction, onViewDetails, isAdmin }) => {
    const labelConfig = COLOR_PALETTE[prediction.label] || COLOR_PALETTE.Normal;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            style={{
                background: labelConfig.gradient,
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                border: `3px solid ${labelConfig.primary}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <motion.div
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle at center, ${labelConfig.secondary}40 0%, transparent 60%)`,
                    transform: 'rotate(-15deg)',
                    zIndex: 0
                }}
                animate={{
                    rotate: [-15, -16, -15],
                    scale: [1, 1.01, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <Box position="relative" zIndex={1} display="flex" alignItems="center" gap={3}>
                <motion.div
                    whileHover={{
                        scale: 1.05,
                        rotate: 3,
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                        height: '150px',
                        borderRadius: '16px',
                    }}
                >
                    <img
                        src={prediction.image_url}
                        alt={`${prediction.label} Prediction`}
                        style={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: '16px',
                            border: `4px solid ${labelConfig.primary}`,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}
                    />
                </motion.div>

                <Box flexGrow={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: labelConfig.primary,
                            fontWeight: 'bold',
                            marginBottom: 1,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}
                    >
                        {prediction.label} Prediction
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Chip
                            icon={<ConfidenceIcon sx={{ fill: 'white' }} />}
                            label={`Confidence: ${prediction.confidence.toFixed(2)}%`}
                            sx={{
                                backgroundColor: labelConfig.primary,
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        Predicted on: {new Date(prediction.timestamp).toLocaleString()}
                    </Typography>
                    {isAdmin && (
                        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                            Tested by: {prediction.user_email}
                        </Typography>
                    )}
                </Box>

                <Tooltip title="View Detailed Insights">
                    <IconButton
                        onClick={() => onViewDetails(prediction)}
                        sx={{
                            background: labelConfig.primary,
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: labelConfig.secondary,
                                transform: 'scale(1.1) rotate(5deg)'
                            }
                        }}
                    >
                        <ViewIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </motion.div>
    );
};

const PredictionDashboard = () => {
    const [predictions, setPredictions] = useState([]);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [filters, setFilters] = useState({
        label: '',
        confidenceLevel: ''
    });

    const userInfo = useSelector(state => state?.auth?.userInfo);
    const isAdmin = userInfo?.role === 'admin';

    const fetchPredictions = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_BASE_ADDRESS}/api/predictions`,
                { withCredentials: true }
            );
            setPredictions(response.data);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    const filteredPredictions = useMemo(() => {
        return predictions.filter(pred => {
            const labelMatch = !filters.label || pred.label === filters.label;

            const confidenceMatch = !filters.confidenceLevel ||
                (filters.confidenceLevel === 'high' && pred.confidence > 90) ||
                (filters.confidenceLevel === 'medium' && pred.confidence >= 70 && pred.confidence <= 90) ||
                (filters.confidenceLevel === 'low' && pred.confidence < 70);

            return labelMatch && confidenceMatch;
        });
    }, [predictions, filters]);

    useEffect(() => {
        fetchPredictions();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4, height: '100%' }}>
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    background: 'transparent',
                    borderRadius: '24px',
                    boxShadow: 'none'
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: '#2C3E50',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <MedicalIcon color='warning' sx={{ fontSize: 40 }} />
                        AI Predictions
                    </Typography>
                    <Box display="flex" alignItems="center" gap={3}>
                        <FormControl
                            variant="outlined"
                            color='warning'
                            sx={{
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#F39C1220',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#F39C12',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#F39C12',
                                    }
                                }
                            }}
                        >
                            <InputLabel>Prediction Label</InputLabel>
                            <Select
                                value={filters.label}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    label: e.target.value
                                }))}
                                label="Prediction Label"
                                startAdornment={<LabelIcon sx={{ mr: 1, color: 'action.active' }} />}
                                renderValue={(selected) => selected || 'All Labels'}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiMenuItem-root': {
                                                '&:hover': {
                                                    backgroundColor: '#F39C1220',
                                                    color: '#F39C12'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#F39C1240',
                                                    color: '#F39C12',
                                                    '&:hover': {
                                                        backgroundColor: '#F39C1250'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>All Labels</em>
                                </MenuItem>
                                <MenuItem value="Glaucoma">Glaucoma</MenuItem>
                                <MenuItem value="Normal">Normal</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl
                            color='warning'
                            variant="outlined"
                            sx={{
                                minWidth: 250,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#F39C1220',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#F39C12',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#F39C12',
                                    }
                                }
                            }}
                        >
                            <InputLabel>Confidence Level</InputLabel>
                            <Select
                                value={filters.confidenceLevel}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    confidenceLevel: e.target.value
                                }))}
                                label="Confidence Level"
                                startAdornment={<ConfidenceIcon sx={{ mr: 1, color: 'action.active' }} />}
                                renderValue={(selected) => {
                                    switch (selected) {
                                        case 'high': return 'Confidence > 90%';
                                        case 'medium': return 'Confidence 70-90%';
                                        case 'low': return 'Confidence < 70%';
                                        default: return 'All Confidence Levels';
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiMenuItem-root': {
                                                '&:hover': {
                                                    backgroundColor: '#F39C1220',
                                                    color: '#F39C12'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#F39C1240',
                                                    color: '#F39C12',
                                                    '&:hover': {
                                                        backgroundColor: '#F39C1250'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>All Confidence Levels</em>
                                </MenuItem>
                                <MenuItem value="high">
                                    <ListItemIcon>
                                        <HighConfidenceIcon color="success" />
                                    </ListItemIcon>
                                    <ListItemText primary="High Confidence" secondary="Confidence > 90%" />
                                </MenuItem>
                                <MenuItem value="medium">
                                    <ListItemIcon>
                                        <MediumConfidenceIcon color="warning" />
                                    </ListItemIcon>
                                    <ListItemText primary="Medium Confidence" secondary="Confidence 70-90%" />
                                </MenuItem>
                                <MenuItem value="low">
                                    <ListItemIcon>
                                        <LowConfidenceIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText primary="Low Confidence" secondary="Confidence < 70%" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <AnimatePresence>
                    {filteredPredictions.length > 0 ? (
                        filteredPredictions.map(prediction => (
                            <PredictionCard
                                key={prediction.id}
                                prediction={prediction}
                                onViewDetails={setSelectedPrediction}
                                isAdmin={isAdmin}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography
                                variant="h6"
                                color="textSecondary"
                                align="center"
                                sx={{ py: 4 }}
                            >
                                No predictions
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>

            {/* Detailed View Dialog */}
            <Dialog
                open={!!selectedPrediction}
                onClose={() => setSelectedPrediction(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    component: motion.div,
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    },
                    sx: {
                        borderRadius: 4,
                        overflow: 'hidden'
                    }
                }}
            >
                {selectedPrediction && (
                    <DialogContent
                        sx={{
                            background: COLOR_PALETTE[selectedPrediction.label].gradient,
                            p: 4,
                            position: 'relative',
                            backgroundColor: COLOR_PALETTE[selectedPrediction.label].secondary,
                        }}
                    >
                        <Box
                            position="relative"
                            display="flex"
                            flexDirection={{ xs: 'column', md: 'row' }}
                            gap={4}
                            alignItems="center"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <img
                                    src={selectedPrediction.image_url}
                                    alt={`${selectedPrediction.label} Detailed View`}
                                    style={{
                                        maxWidth: '400px',
                                        width: '100%',
                                        borderRadius: '20px',
                                        boxShadow: `0 16px 32px ${COLOR_PALETTE[selectedPrediction.label].primary}40`,
                                        objectFit: 'cover',
                                        border: `4px solid ${COLOR_PALETTE[selectedPrediction.label].primary}`
                                    }}
                                />
                            </motion.div>

                            <Box flex={1}>
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    sx={{
                                        color: COLOR_PALETTE[selectedPrediction.label].primary,
                                        fontWeight: 'bold',
                                        mb: 3
                                    }}
                                >
                                    Prediction Details
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {[
                                        {
                                            icon: <LabelImportantIcon />,
                                            label: `Label: ${selectedPrediction.label}`,
                                            color: 'default'
                                        },
                                        {
                                            icon: <PercentIcon />,
                                            label: `Confidence: ${selectedPrediction.confidence.toFixed(2)}%`,
                                            color: 'default'
                                        },
                                        {
                                            icon: <AccessTimeIcon />,
                                            label: `Predicted On: ${new Date(selectedPrediction.timestamp).toLocaleString()}`,
                                            color: 'default'
                                        }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (index * 0.1) }}
                                        >
                                            <Chip
                                                icon={item.icon}
                                                label={item.label}
                                                variant="outlined"
                                                color={item.color}
                                                sx={{
                                                    mb: 1,
                                                    borderColor: COLOR_PALETTE[selectedPrediction.label].primary,
                                                    color: COLOR_PALETTE[selectedPrediction.label].primary,
                                                    '& .MuiChip-icon': {
                                                        color: COLOR_PALETTE[selectedPrediction.label].primary
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    ))}

                                    {isAdmin && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <Chip
                                                avatar={<Avatar sx={{
                                                    bgcolor: COLOR_PALETTE[selectedPrediction.label].primary,
                                                    color: 'white !important',
                                                }}>
                                                    {selectedPrediction.user_email[0].toUpperCase()}
                                                </Avatar>}
                                                label={`Tested by: ${selectedPrediction.user_email}`}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: COLOR_PALETTE[selectedPrediction.label].primary,
                                                    color: COLOR_PALETTE[selectedPrediction.label].primary
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                )}
            </Dialog>
        </Container>
    );
};

export default PredictionDashboard;