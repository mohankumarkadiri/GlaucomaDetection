import React from 'react';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import { Provider } from 'react-redux'
import ErrorBoundary from './common/ErrorBoundary';
import { SnackbarProvider } from './hooks/SnackBarProvider';
import PageNotFound from './common/PageNotFound';
import Login from './pages/Login';
import UserRequests from './pages/UserRequests';
import Layout from './Layout';
import Users from './pages/users/Users';
import GlaucomaDetector from './pages/GlaucomaDetector';
import EyeSpecialists from './pages/EyeSpecialists';
import HealthTips from './pages/HealthTips';
import MeditationGuide from './pages/MeditationGuide';
import DietPlans from './pages/DietPlans';
import PredictionDashboard from './pages/PredictionsDashboard';
import AddressForm from './pages/AddressForm';
import store from './store';
import './App.css';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path='/' element={<Layout />}>
				<Route path='glaucomaDetector' element={<GlaucomaDetector />}></Route>
				<Route path='eyeSpecialists' element={<EyeSpecialists />}></Route>
				<Route path='healthTips' element={<HealthTips />}></Route>
				<Route path='meditationGuide' element={<MeditationGuide />}></Route>
				<Route path='dietPlans' element={<DietPlans />}></Route>
				<Route path='predictionsDashboard' element={<PredictionDashboard />}></Route>
				<Route path='users' element={<Users />}></Route>
				<Route path='UserRequests' element={<UserRequests />}></Route>
				<Route path='*' element={<PageNotFound />}></Route>
			</Route>
			<Route path='addressForm' element={<AddressForm />}></Route>
			<Route path='login' element={<Login />}></Route>
		</Route>
	)
);

export default function App() {
	return (
		<Provider store={store}>
			<SnackbarProvider>
				<ErrorBoundary>
					<RouterProvider router={router} />
				</ErrorBoundary>
			</SnackbarProvider>
		</Provider>
	);
}