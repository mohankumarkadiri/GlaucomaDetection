import React, { useState, useMemo, useLayoutEffect } from 'react';
import {
    Box,
    TextField,
    Card,
    CardContent,
    Typography,
    Container,
    Grid,
    Rating,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';
import {
    Search,
    LocationOn,
    Phone,
    AccessTime,
    Language,
    Security
} from '@mui/icons-material';
import EYE_SPECIALISTS from '../assets/doctors.json';

const EyeSpecialists = () => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Eye Specialists'))
        // eslint-disable-next-line
    }, [])


    const states = useMemo(() =>
        [...new Set(EYE_SPECIALISTS.map(doctor => doctor.state))],
        []
    );

    const districts = useMemo(() =>
        [...new Set(EYE_SPECIALISTS.filter(doctor =>
            !selectedState || doctor.state === selectedState
        ).map(doctor => doctor.district))],
        [selectedState]
    );

    const filteredDoctors = useMemo(() => {
        return EYE_SPECIALISTS.filter(doctor => {
            const matchesSearch = searchTerm === '' ||
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesState = !selectedState || doctor.state === selectedState;
            const matchesDistrict = !selectedDistrict || doctor.district === selectedDistrict;
            return matchesSearch && matchesState && matchesDistrict;
        });
    }, [searchTerm, selectedState, selectedDistrict]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h3" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: theme.palette.success.main,
                    textAlign: 'center',
                    mb: 4
                }}>
                    Find Your Eye Care Specialist
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            color='warning'
                            label="Search by name or specialty"
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth color='warning'>
                            <InputLabel>State</InputLabel>
                            <Select
                                value={selectedState}
                                label="State"
                                onChange={(e) => {
                                    setSelectedState(e.target.value);
                                    setSelectedDistrict('');
                                }}
                                sx={{
                                    color: 'success.main'
                                }}
                            >
                                <MenuItem value="">All States</MenuItem>
                                {states.map(state => (
                                    <MenuItem key={state} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth color='warning'>
                            <InputLabel>District</InputLabel>
                            <Select
                                value={selectedDistrict}
                                label="District"
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedState}
                                sx={{
                                    color: 'success.main'
                                }}
                            >
                                <MenuItem value="">All Districts</MenuItem>
                                {districts.map(district => (
                                    <MenuItem key={district} value={district}>{district}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Grid container spacing={3}>
                    <AnimatePresence>
                        {filteredDoctors.map((doctor) => (
                            <Grid item xs={12} key={doctor?.name}>
                                <motion.div
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, y: 20 }}
                                    layoutId={doctor.name}
                                >
                                    <Card
                                        elevation={3}
                                        sx={{
                                            borderRadius: 2,
                                            background: 'linear-gradient(to right, #ffffff 0%, #f8f9fa 100%)',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                transition: 'all 0.3s ease-in-out',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 90,
                                                            height: 90,
                                                            bgcolor: 'success.main',
                                                            fontSize: '1.8rem',
                                                            fontWeight: 'bold',
                                                            border: '4px solid #fff',
                                                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        {`${doctor.name.split(' ')[1].substring(0, 2)}`}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xs={12} md={10}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                        <Box>
                                                            <Typography
                                                                variant="h5"
                                                                component="h2"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: 'success.main',
                                                                    mb: 0.5
                                                                }}
                                                            >
                                                                {doctor.name}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '1.1rem',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {doctor.specialty}
                                                            </Typography>
                                                        </Box>
                                                        <Box textAlign="right">
                                                            <Rating
                                                                value={doctor.rating}
                                                                precision={0.1}
                                                                readOnly
                                                                sx={{
                                                                    '& .MuiRating-icon': {
                                                                        color: 'warning.main'
                                                                    }
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'success.main',
                                                                    fontWeight: 500,
                                                                    mt: 0.5
                                                                }}
                                                            >
                                                                {doctor.experience} years experience
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        display="flex"
                                                        gap={3}
                                                        mb={3}
                                                        sx={{
                                                            backgroundColor: 'grey.50',
                                                            borderRadius: 2,
                                                            p: 2
                                                        }}
                                                    >
                                                        <Box display="flex" alignItems="center">
                                                            <LocationOn color="success" sx={{ mr: 1 }} />
                                                            <Typography variant="body2" fontWeight={500}>{doctor.address}</Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center">
                                                            <Phone sx={{ mr: 1, color: 'success.main' }} />
                                                            <Typography variant="body2" fontWeight={500}>{doctor.phone}</Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center">
                                                            <AccessTime sx={{ mr: 1, color: 'warning.main' }} />
                                                            <Typography variant="body2" fontWeight={500}>Next: {doctor.nextAvailable}</Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box display="flex" gap={4} flexWrap="wrap">
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    mb: 1,
                                                                    color: 'success.main',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                <Language sx={{ mr: 1 }} /> Languages
                                                            </Typography>
                                                            <Box display="flex" gap={1}>
                                                                {doctor.languages.map(lang => (
                                                                    <Chip
                                                                        key={lang}
                                                                        label={lang}
                                                                        size="small"
                                                                        sx={{
                                                                            borderRadius: '8px',
                                                                            backgroundColor: 'primary.50',
                                                                            color: 'success.main',
                                                                            fontWeight: 500,
                                                                            '&:hover': {
                                                                                backgroundColor: 'primary.100'
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    mb: 1,
                                                                    color: 'success.main',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                <Security sx={{ mr: 1 }} /> Insurance
                                                            </Typography>
                                                            <Box display="flex" gap={1}>
                                                                {doctor.insurance.map(ins => (
                                                                    <Chip
                                                                        key={ins}
                                                                        label={ins}
                                                                        size="small"
                                                                        sx={{
                                                                            borderRadius: '8px',
                                                                            backgroundColor: 'success.50',
                                                                            color: 'success.main',
                                                                            fontWeight: 500,
                                                                            '&:hover': {
                                                                                backgroundColor: 'success.100'
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </motion.div>
        </Container>
    );
};

export default EyeSpecialists;