# Contract-based-Farming
# FarmaFriend – Contract-Based Farming Platform

## Introduction
FarmaFriend is a full-stack web application designed to connect farmers and buyers through a transparent and secure contract-based farming system.  
The platform enables farmers to list their crops for sale or upcoming harvests, while buyers can explore, communicate, and enter into digital contracts directly.  
It aims to reduce the role of intermediaries, improve trust, and ensure fair trade in the agricultural supply chain.

---

## Objectives
1. To provide a transparent platform where farmers and buyers can interact and establish direct contracts.
2. To ensure secure and traceable agreements using blockchain technology.
3. To simplify crop listing, contract negotiation, and order tracking.
4. To support real-time communication and problem resolution between users.

---

## Features

### Farmer Features
- Register and manage profile information including address, photo, and location.
- List crops in two categories:
  - **Sell Now** – produce ready for sale.
  - **Going to Harvest** – crops planned for future harvest (for contract offers).
- Manage buyer contract requests (Accept/Reject options).
- View and update order or contract status.
- Participate in chat communication with buyers.
- View and respond to problems raised by buyers.
- Receive and view ratings from buyers.

### Buyer Features
- Explore available listings on:
  - **Buy Produces Page** – for crops that are ready to sell.
  - **Give Contract Page** – for farmers who will harvest in the future.
- Send contract or interest requests to farmers.
- Chat directly with farmers for negotiation or clarification.
- Finalize contract details once accepted by the farmer.
- View placed orders and ongoing contracts.
- Rate farmers based on transaction experience.

### Problems Page
- A dedicated module where users can report any issue or complaint related to orders, communication, or contract handling.
- Users can create, view, and track problem reports.
- Farmers and buyers can communicate through a chat-like interface to resolve problems.
- The admin can monitor reported issues for transparency and quality control.

### Blockchain Integration
- Blockchain technology is used to record finalized contracts between farmers and buyers.
- Each contract is stored as a transaction on the blockchain, ensuring immutability and transparency.
- A smart contract is deployed using Solidity, handling the creation, acceptance, and completion of farming contracts.
- The frontend interacts with the blockchain through the **Ethers.js** library and **MetaMask** wallet integration.
- This ensures that once a contract is created, its data cannot be altered, providing reliability and trust between parties.

---

## System Architecture

The application follows an MVC (Model–View–Controller) structure:

1. **Frontend (React.js)**  
   - Provides the user interface for farmers and buyers.
   - Implements navigation between modules such as Sell Produce, Give Contract, My Listings, My Orders, Chat, Problems, and Blockchain Contracts.
   - Uses Firebase SDK for authentication and Firestore interactions.

2. **Backend (Node.js + Express.js)**  
   - Handles all API requests for authentication, produce listings, contracts, orders, problems, and chat operations.
   - Communicates with Firebase Firestore for data persistence.
   - Integrates with blockchain smart contracts using Ethers.js for contract creation and verification.

3. **Database (Firebase Firestore)**  
   - Stores user profiles, produce listings, orders, chats, ratings, and problems.
   - Uses Firebase Storage for image uploads.

4. **Blockchain Layer (Ethereum Test Network)**  
   - Smart contracts deployed using Solidity.
   - Interfaced through Ethers.js in the backend and frontend.
   - Ensures verifiable and permanent storage of finalized contract details.
