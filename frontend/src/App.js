import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import ErrorBoundary from './common/ErrorBoundary';
import { SnackbarProvider } from './hooks/SnackBarProvider';
import PageNotFound from './common/PageNotFound';
import GlaucomaDetector from './pages/GlaucomaDetector';
// import Users from './Users/Users';
// import Layout from './Layout'; 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={
        <ErrorBoundary>
          <GlaucomaDetector />
        </ErrorBoundary>
      } />
      <Route path='*' element={
        <ErrorBoundary>
          <PageNotFound />
        </ErrorBoundary>
      } />
    </Route>
  )
);

export default function App() {
  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </SnackbarProvider>
  );
}