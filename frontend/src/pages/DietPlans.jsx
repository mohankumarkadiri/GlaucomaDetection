import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';


const DietPlans = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Diet Plans'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>Diet Plans</div>
    );
}

export default DietPlans;