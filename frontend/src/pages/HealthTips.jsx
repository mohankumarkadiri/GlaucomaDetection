import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';


const HealthTips = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Health Tips'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>Health Tips</div>
    );
}

export default HealthTips;