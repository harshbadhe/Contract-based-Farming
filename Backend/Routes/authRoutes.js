const express = require('express');
const multer = require('multer');

const {
  // ...existing...
  sendFinalContractRequest,
  getFinalContractRequestsForBuyer,
  rejectFinalContractRequest,
} = require('../Controller/contractController');


const {
  registerUser
} = require('../Controller/authController');
const {
  loginUser
} = require('../Controller/loginController');
const {
  addProduceListing
} = require('../Controller/produceController');
const {
  getMyListings
} = require('../Controller/listingController');
const {
  getBuyProduces
} = require('../Controller/buyController');
const {
  getGiveContract,
  createContractRequest,
  getContractRequestsForFarmer,
  updateContractRequestStatus,
  getContractRequestsForBuyer,
  getContractRequestById,
  getChatMessages,
  postChatMessage,
  handleNegotiationAction, // ✅ new controller
} = require('../Controller/contractController');
const {
  getProduceDetails
} = require('../Controller/detailsController');
const {
  addToCart,
  getCartItems,
  removeFromCart
} = require('../Controller/cartController');
const {
  submitHarvestIntent,
  getHarvestIntents,
  getHarvestById,
  addRating,
  getRatingsForIntent,
  checkIfRated
} = require('../Controller/harvestIntentController');
const {
  placeOrder,
  getOrdersByEmail,
  getFarmerOrdersByEmail,
  getOrderById,
  updateOrderStatus,
  confirmDelivery
} = require('../Controller/orderController');
const {
  postProblem,
  getProblems,
  addReply
} = require('../Controller/problemController');

const router = express.Router();

// ✅ Upload configs
const upload = multer({ dest: 'uploads/' });
const upload1 = multer({ dest: 'uploads/', limits: { files: 6 } });
const intentUpload = multer({ dest: 'uploads/' });
const fields = [
  { name: 'photo', maxCount: 1 },
  { name: 'landPhotos', maxCount: 6 },
];

// ✅ Produce routes
router.post('/sell-produce', upload1.array('images', 6), addProduceListing);
router.post('/harvest-intent', intentUpload.fields(fields), submitHarvestIntent);

// ✅ Auth routes
router.post('/register', upload.single('photo'), registerUser);
router.post('/login', loginUser);
router.get('/my-listings', getMyListings);

// ✅ Rating routes
router.post('/harvest/rate', addRating);
router.get('/harvest/ratings/:intentId', getRatingsForIntent);
router.get('/harvest/has-rated/:intentId', checkIfRated);

// ✅ Buyer/Farmer routes
router.get('/buy-produces', getBuyProduces);
router.get('/give-contract', getGiveContract);
router.get('/harvest-intents', getHarvestIntents);
router.get('/details/:name', getProduceDetails);
router.get('/harvest-details/:id', getHarvestById);

// ✅ Cart routes
router.post('/add-to-cart', addToCart);
router.get('/get-cart', getCartItems);
router.delete('/remove-from-cart', removeFromCart);

// ✅ Problems routes
router.post('/post-problem', upload.single('image'), postProblem);
router.get('/get-problems', getProblems);
router.post('/problems/:id/reply', addReply);

// ✅ Order routes
router.post('/order', placeOrder);
router.get('/orders/:email', getOrdersByEmail);
router.get('/farmer-orders-by-email/:email', getFarmerOrdersByEmail);
router.get('/order/:id', getOrderById);
router.patch('/order/:id/status', updateOrderStatus);
router.patch('/order/:id/confirm', confirmDelivery);

// ✅ Contract request routes
router.post('/contract-request', createContractRequest);
router.get('/contract-requests/:email', getContractRequestsForFarmer);
router.patch('/contract-request/:id/status', updateContractRequestStatus);
router.get('/contract-requests-by-buyer/:email', getContractRequestsForBuyer);
router.get('/contract-request/:id', getContractRequestById);

// ✅ Negotiation route (🔥 new one)
router.post('/contract-request/:id/negotiation', handleNegotiationAction);

// ✅ Chat routes
router.get('/chat-messages/:contractId', getChatMessages);
router.post('/chat-message', postChatMessage);

router.post("/final-contract", sendFinalContractRequest);
router.get("/final-contracts-for-buyer/:email", getFinalContractRequestsForBuyer);
router.delete("/final-contract/:id/reject", rejectFinalContractRequest);





module.exports = router;
