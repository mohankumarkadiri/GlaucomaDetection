import React, { useState } from 'react';
import {
    Modal,
    Typography,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    HelpOutline,
    HealthAndSafety 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import precautions from '../assets/precautions.json';

const GlaucomaPrecautions = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip title="Glaucoma Precautions">
                <IconButton 
                    onClick={() => setOpen(true)} 
                    color="error"
                    component={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <HelpOutline />
                </IconButton>
            </Tooltip>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 300,
                                damping: 20 
                            }}
                        >
                            <Paper
                                elevation={12}
                                sx={{
                                    width: '100%',
                                    maxWidth: 600,
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    borderRadius: 4,
                                    p: 3,
                                    background: 'linear-gradient(145deg, #f0f4f8, #e6eaf3)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Typography 
                                    variant="h4" 
                                    color="success" 
                                    gutterBottom 
                                    sx={{ 
                                        textAlign: 'center', 
                                        fontWeight: 'bold',
                                        mb: 3 
                                    }}
                                >
                                    <HealthAndSafety sx={{ mr: 2, verticalAlign: 'middle' }} />
                                    Glaucoma Care Guide
                                </Typography>

                                {precautions.map((precaution, index) => (
                                    <motion.div
                                        key={precaution.title}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100 
                                        }}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            marginBottom: 16,
                                            padding: 16,
                                            backgroundColor: '#ffffff',
                                            borderRadius: 12,
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <div style={{ marginRight: 16 }}>
                                            {precaution.icon}
                                        </div>
                                        <div>
                                            <Typography 
                                                variant="h6" 
                                                color="success"
                                                sx={{ fontWeight: 'bold', mb: 1 }}
                                            >
                                                {precaution.title}
                                            </Typography>
                                            <Typography variant="body2">
                                                {precaution.description}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ fontStyle: 'italic', mt: 1 }}
                                            >
                                                Recommendation: {precaution.recommendation}
                                            </Typography>
                                        </div>
                                    </motion.div>
                                ))}
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>
        </>
    );
};

export default GlaucomaPrecautions;