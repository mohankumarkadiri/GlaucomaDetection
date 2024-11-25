import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import LottieFile from '../assets/images/Lottie/page_not_found.json';
import { useSnackbar } from '../hooks/SnackBarProvider';
import { Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

const PageNotFound = () => {
    const openSnackbar = useSnackbar();
    useEffect(() => {
        openSnackbar('Requested Page Not Found', 'warning')
        // eslint-disable-next-line
    }, [])
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '85%',
                    height: '50%',
                }}
            />
            <Stack gap={5} alignItems={"center"}>
                <Typography level="h3" color='danger'>Page Not Found</Typography>
                <Link to={"/"}>
                    <Button>"Home Page ➺</Button>
                </Link>
            </Stack>
        </div>
    );
}

export default PageNotFound;