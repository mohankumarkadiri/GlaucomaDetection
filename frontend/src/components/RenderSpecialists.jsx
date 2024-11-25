import { motion } from 'framer-motion';
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    IconButton,
    Rating,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Language as LanguageIcon,
    HealthAndSafety as HealthIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Mail as MailIcon,
} from '@mui/icons-material';

export default function RenderSpecialists({ specialists }) {
    const theme = useTheme();

    return specialists.map((specialist, index) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
        >
            <Card
                sx={{
                    p: 3,
                    mb: 2,
                    background: theme.palette.background.paper,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                        boxShadow: theme.shadows[10],
                    }
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: theme.palette.success.main,
                                    fontSize: '3rem',
                                    mb: 1
                                }}
                            >
                                {specialist?.name.charAt(0)}
                            </Avatar>
                            <Box textAlign="center">
                                <Typography variant="h5" color="success" gutterBottom>
                                    {specialist?.name}
                                </Typography>
                                <Chip
                                    label={specialist?.specialty}
                                    color="success"
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                                <Rating
                                    value={specialist?.rating}
                                    readOnly
                                    precision={0.1}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <HealthIcon color="success" />
                                <Typography variant="body2">
                                    {specialist?.experience} Years Experience
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Right Column - Details */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={2}>
                            {/* Availability */}
                            <Box>
                                <Typography variant="subtitle1" color="success" sx={{ mb: 1, fontWeight: 600 }}>
                                    Next Available
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <ScheduleIcon color="action" />
                                    <Typography variant="body1">
                                        {specialist?.nextAvailable}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Contact & Location */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LocationIcon color="action" />
                                            <Typography variant="body2">
                                                {specialist?.address}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PhoneIcon color="action" />
                                            <Typography variant="body2">
                                                {specialist?.phone}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LanguageIcon color="action" />
                                            <Typography variant="body2">
                                                {specialist?.languages.join(', ')}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Divider />

                            {/* Insurance */}
                            <Box>
                                <Typography variant="subtitle1" color="success" sx={{ mb: 1, fontWeight: 600 }}>
                                    Accepted Insurance
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {specialist?.insurance.map((ins, idx) => (
                                        <Chip
                                            key={idx}
                                            label={ins}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Box display="flex" gap={2} mt={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<ScheduleIcon />}
                                    color="success"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Book Appointment
                                </Button>
                                <IconButton color="success" sx={{ border: 1, borderColor: 'divider' }}>
                                    <MailIcon />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </motion.div>
    ));
};