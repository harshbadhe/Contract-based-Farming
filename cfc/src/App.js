// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth
import LoginPage from './Pages/Auth/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage';

// Farmer
import FarmerLandingPage from './Pages/Farmer/FarmerLandingPage';
import SellProducePage from './Pages/Farmer/SellProducePage';
import FarmerListingsPage from './Pages/Farmer/FarmerListingsPage';
import HarvestIntentPage from './Pages/Farmer/HarvestIntentPage';
import HarvestDetailsPage from './Pages/Farmer/HarvestDetailsPage';

// Buyer
import BuyerLandingPage from './Pages/Buyer/BuyerLandingPage';
import BuyProducesPage from './Pages/Buyer/BuyProducesPage';
import ProduceDetailsPage from './Pages/Buyer/ProduceDetailsPage';
import BuyNowPage from './Pages/Buyer/BuyNowPage';
import CartPage from './Pages/Buyer/CartPage';
import GiveContractPage from './Pages/Buyer/GiveContractPage';

// Orders
import BuyerMyOrdersPage from './Pages/Orders/BuyerMyOrdersPage';
import BuyerOrderDetailsPage from './Pages/Orders/BuyerOrderDetailsPage';
import FarmerMyOrdersPage from './Pages/Orders/FarmerMyOrdersPage';
import FarmerOrderDetailsPage from './Pages/Orders/FarmerOrderDetailsPage';

// Contracts
import BuyerRequestForm from './Pages/Contracts/BuyerRequestForm';
import BuyerInterestForm from './Pages/Contracts/BuyerInterestForm';
import BuyerContractDetails from './Pages/Contracts/BuyerContractDetails';
import FarmerContractDetails from './Pages/Contracts/FarmerContractDetails';
import CreateFinalContractForm from './Pages/Contracts/CreateFinalContractForm';
import FarmerFinalContractsPage from './Pages/Contracts/FarmerFinalContractsPage';
import BuyerFinalContractsPage from './Pages/Contracts/BuyerFinalContractsPage';
import ContractDetailsPage from './Pages/Contracts/BuyerContractDetailsPage';
import FarmerContractDetailsPage from './Pages/Contracts/FarmerContractDetailsPage';
import ContractAgreementPage from './Pages/Contracts/ContractAgreementPage';

// Problems
import ProblemsPage from './Pages/Problems/ProblemsPage';
import ProblemDetailsPage from './Pages/Problems/ProblemDetailsPage';


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

        <Route path="/buyer/contract/:id" element={<ContractDetailsPage />} />
        <Route path="/farmer/contract/:id" element={<FarmerContractDetailsPage />} />

         <Route path="/farmer/contract-agreement/:id" element={<ContractAgreementPage />} />
         <Route path="/buyer/contract-agreement/:id" element={<ContractAgreementPage />} />






       


      </Routes>
    </Router>
  );
};

export default App;
