import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/lottie/no_data.json';
import { Typography } from '@mui/joy';

const NoData = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '500px',
                    height: '400px'
                }}
            />
            <Typography fontSize={31} fontFamily='Capriola' color='success'>No Data Found</Typography>
        </div>
    );
}

export default NoData;