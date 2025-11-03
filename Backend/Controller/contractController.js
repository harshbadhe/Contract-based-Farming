// src/Controller/contractController.js
const { admin } = require('../Firebase/admin');

// GET all giveContract listings
const getGiveContract = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('giveContract').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching giveContract:', error.message);
    res.status(500).json({ error: 'Failed to fetch giveContract listings' });
  }
};

// POST create or update a contract request
const createContractRequest = async (req, res) => {
  try {
    const { intentId, buyerName, buyerEmail, crop, expectedPrice, acres } = req.body;

    if (!intentId || !buyerName || !buyerEmail || !crop || !expectedPrice || !acres) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // ✅ Fetch farmerEmail from correct collection
    const docSnap = await admin.firestore().collection('harvestIntents').doc(intentId).get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Harvest intent not found' });
    }

    const farmerEmail = docSnap.data().email || docSnap.data().farmerEmail;

    // ✅ Save contract request
    await admin.firestore().collection('contractRequests').add({
      intentId,
      buyerName,
      buyerEmail,
      farmerEmail,
      crop,
      expectedPrice,
      acres,
      status: 'Pending',
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Contract request sent to farmer.' });
  } catch (err) {
    console.error('Contract request error:', err);
    res.status(500).json({ error: 'Failed to send contract request.' });
  }
};

const getContractRequestsForFarmer = async (req, res) => {
  try {
    const { email } = req.params;
    const snapshot = await admin.firestore()
      .collection('contractRequests')
      .where('farmerEmail', '==', email)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching contract requests:', error.message);
    res.status(500).json({ error: 'Failed to fetch contract requests' });
  }
};

// PATCH /api/auth/contract-request/:id/status
const updateContractRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    await admin.firestore().collection('contractRequests').doc(id).update({ status });

    res.status(200).json({ message: 'Contract request status updated' });
  } catch (error) {
    console.error('Error updating contract request status:', error.message);
    res.status(500).json({ error: 'Failed to update status' });
  }
};


// GET all contract requests for a specific buyer
const getContractRequestsForBuyer = async (req, res) => {
  try {
    const { email } = req.params;
    const snapshot = await admin.firestore()
      .collection('contractRequests')
      .where('buyerEmail', '==', email)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching contract requests for buyer:', error.message);
    res.status(500).json({ error: 'Failed to fetch contract requests for buyer' });
  }
};

const getContractRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await admin.firestore().collection('contractRequests').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Contract request not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching contract request:', error.message);
    res.status(500).json({ error: 'Failed to fetch contract request' });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { contractId } = req.params;
    const snapshot = await admin.firestore()
      .collection('chatMessages')
      .where('contractId', '==', contractId)
      .orderBy('timestamp', 'asc')
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
};

// Post a new chat message
const postChatMessage = async (req, res) => {
  try {
    const { contractId, senderEmail, receiverEmail, messageText, timestamp } = req.body;

    if (!contractId || !senderEmail || !receiverEmail || !messageText || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await admin.firestore().collection('chatMessages').add({
      contractId,
      senderEmail,
      receiverEmail,
      messageText,
      timestamp: new Date(timestamp),
    });

    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error posting chat message:', error);
    res.status(500).json({ error: 'Failed to send chat message' });
  }
};

const handleNegotiationAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, action } = req.body;

    if (!id || !role || !action) {
      return res.status(400).json({ error: 'id, role and action are required' });
    }
    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ error: 'role must be farmer or buyer' });
    }
    if (!['done', 'not_done'].includes(action)) {
      return res.status(400).json({ error: 'action must be done or not_done' });
    }

    const docRef = admin.firestore().collection('contractRequests').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Contract request not found' });
    }

    const data = docSnap.data() || {};

    // Prepare updates
    const updates = { updatedAt: new Date() };

    if (action === 'not_done') {
      // If any party says Not Done, cancel the negotiation immediately
      updates.status = 'Cancelled';
      if (role === 'farmer') {
        updates.farmerNegotiation = false;
      } else {
        updates.buyerNegotiation = false;
      }
      // optional: record which side cancelled
      updates.cancelledBy = role;
      await docRef.update(updates);
      const updatedDoc = (await docRef.get()).data();
      return res.status(200).json({ message: 'Negotiation cancelled', data: updatedDoc });
    }

    // action === 'done'
    if (role === 'farmer') updates.farmerNegotiation = true;
    if (role === 'buyer') updates.buyerNegotiation = true;

    await docRef.update(updates);

    // Re-read to check both flags
    const newSnap = await docRef.get();
    const newData = newSnap.data() || {};

    const farmerDone = !!newData.farmerNegotiation;
    const buyerDone = !!newData.buyerNegotiation;

    if (farmerDone && buyerDone) {
      await docRef.update({ status: 'Negotiation Done', updatedAt: new Date() });
      const finalSnap = await docRef.get();
      return res.status(200).json({ message: 'Negotiation completed by both parties', data: finalSnap.data() });
    }

    // Only one side done so far
    return res.status(200).json({ message: 'Recorded negotiation action', data: newData });
  } catch (err) {
    console.error('handleNegotiationAction error:', err);
    res.status(500).json({ error: 'Failed to process negotiation action' });
  }
};

const sendFinalContractRequest = async (req, res) => {
  try {
    const { orderId, intentId, buyerEmail, farmerEmail, farmerWallet, cropName, price, acres, deliveryDate } = req.body;

    if (!buyerEmail || !farmerEmail || !farmerWallet || !cropName || !price || !acres) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await admin.firestore().collection("finalContractRequests").add({
      orderId,
      intentId,
      buyerEmail,
      farmerEmail,
      farmerWallet,
      cropName,
      price,
      acres,
      deliveryDate,
      status: "Pending Buyer Approval",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "✅ Final contract request sent to buyer." });
  } catch (err) {
    console.error("Error sending final contract:", err);
    res.status(500).json({ error: "Failed to send final contract request." });
  }
};

// GET: Buyer gets all final contract requests
const getFinalContractRequestsForBuyer = async (req, res) => {
  try {
    const { email } = req.params;
    const snapshot = await admin.firestore()
      .collection("finalContractRequests")
      .where("buyerEmail", "==", email)
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching final contracts for buyer:", error);
    res.status(500).json({ error: "Failed to fetch final contract requests" });
  }
};

// DELETE: Buyer rejects final proposal
const rejectFinalContractRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await admin.firestore().collection("finalContractRequests").doc(id).delete();
    res.status(200).json({ message: "Final contract request rejected and removed." });
  } catch (error) {
    console.error("Error rejecting final contract request:", error);
    res.status(500).json({ error: "Failed to reject final contract request" });
  }
};



// Save txHash after on-chain creation


module.exports = {
  getGiveContract,
  createContractRequest,getContractRequestsForFarmer , updateContractRequestStatus,getContractRequestsForBuyer, getContractRequestById
   ,getChatMessages,
  postChatMessage,handleNegotiationAction, sendFinalContractRequest,
  getFinalContractRequestsForBuyer,
  rejectFinalContractRequest,
};
