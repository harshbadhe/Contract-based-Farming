// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from '../src/Pages/LoginPage'
import RegisterPage from '../src/Pages/RegisterPage';
import FarmerLandingPage from '../src/Pages/FarmerLandingPage';
import BuyerLandingPage from '../src/Pages/BuyerLandingPage';
import SellProducePage from '../src/Pages/SellProducePage';
import FarmerListingsPage from '../src/Pages/FarmerListingsPage';
import BuyProducesPage from '../src/Pages/BuyProducesPage';
import GiveContractPage from '../src/Pages/GiveContractPage';
import ProduceDetailsPage from '../src/Pages/ProduceDetailsPage';
import CartPage from '../src/Pages/CartPage';
import ProblemsPage from '../src/Pages/ProblemsPage';
import ProblemDetailsPage from '../src/Pages/ProblemDetailsPage';
import HarvestIntentPage from '../src/Pages/HarvestIntentPage';
import HarvestDetailsPage from '../src/Pages/HarvestDetailsPage';
import BuyNowPage from './Pages/BuyNowPage';
import BuyerMyOrdersPage from './Pages/BuyerMyOrdersPage';
import FarmerMyOrdersPage from './Pages/FarmerMyOrdersPage';
import BuyerOrderDetailsPage from './Pages/BuyerOrderDetailsPage';
import FarmerOrderDetailsPage from './Pages/FarmerOrderDetailsPage';

import BuyerRequestForm from './Pages/BuyerRequestForm';
import BuyerInterestForm from './Pages/BuyerInterestForm';
import BuyerContractDetails from './Pages/BuyerContractDetails';
import FarmerContractDetails from './Pages/FarmerContractDetails';

import CreateFinalContractForm from './Pages/CreateFinalContractForm';

import FarmerFinalContractsPage from "./Pages/FarmerFinalContractsPage";
import BuyerFinalContractsPage from "./Pages/BuyerFinalContractsPage";

// import MyListingsPage from './pages/MyListingsPage'; ← future
// import MyOrdersPage from './pages/MyOrdersPage'; ← future

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerLandingPage />} />
        <Route path="/farmer/sell-produces" element={<SellProducePage />} />
         <Route path="/farmer/going-to-harvest" element={<HarvestIntentPage />} />

        {/* Buyer Routes */}
        <Route path="/buyer" element={<BuyerLandingPage />} />

        <Route path="/farmer/mylistings" element={<FarmerListingsPage />} />
        <Route path="/buyer/buy-produces" element={<BuyProducesPage />} />
        <Route path="/buyer/give-contract" element={<GiveContractPage />} />
        <Route path="/buyer/details/:name" element={<ProduceDetailsPage />} />
        <Route path="/buyer/give-contract/:id" element={<HarvestDetailsPage />} />
        
        <Route path="/buyer/cart" element={<CartPage />} />
        <Route path="/farmer/problems" element={<ProblemsPage />} />
        <Route path="/buyer/problems" element={<ProblemsPage />} />
         <Route path="/farmer/problems/:id" element={<ProblemDetailsPage />} />
        <Route path="/buyer/problems/:id" element={<ProblemDetailsPage />} />

        <Route path="/buy-now/:name" element={<BuyNowPage />} />
        <Route path="/buyer/my-orders" element={<BuyerMyOrdersPage />} />
          <Route path="/farmer/my-orders" element={<FarmerMyOrdersPage />} />
          <Route path="/buyer/order/:id" element={<BuyerOrderDetailsPage />} />
          <Route path="/farmer/order/:id" element={<FarmerOrderDetailsPage />} />

         


         

        <Route path="/buyer/contract-request/:harvestId" element={<BuyerRequestForm />} />
        <Route path="/buyer/request-form/:intentId" element={<BuyerInterestForm />} />
        
           <Route path="/farmer/contract-details/:id" element={<FarmerContractDetails />} />
         <Route path="/buyer/contract-details/:id" element={<BuyerContractDetails />} />

         <Route path="/farmer/final-contracts" element={<FarmerFinalContractsPage />} />
         <Route path="/buyer/final-contracts" element={<BuyerFinalContractsPage />} /> 


           <Route
          path="/create-final-contract"
          element={<CreateFinalContractForm />}
        />






       


      </Routes>
    </Router>
  );
};

export default App;
