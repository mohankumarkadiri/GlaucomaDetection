import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/authSlice';


const MeditationGuide = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setCurrentPage('Meditation Guide'))
        // eslint-disable-next-line
    }, [])

    return (
        <div>Meditation Guide</div>
    );
}

export default MeditationGuide;