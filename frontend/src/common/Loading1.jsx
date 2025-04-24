import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/images/Lottie/loading_1.json';

const Loading1 = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            filter: 'hue-rotate(246deg)'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '20%',
                    height: '30%'
                }}
            />
        </div>
    );
}

export default Loading1;
