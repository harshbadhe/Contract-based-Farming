const { admin } = require('../Firebase/admin');

// 🔽 Place Order (includes storing farmerEmail)
const placeOrder = async (req, res) => {
  try {
    const { fullName, buyerEmail, address, pincode, quantity, name } = req.body;

    if (!fullName || !buyerEmail || !address || !pincode || !quantity || !name) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const listingSnap = await admin.firestore()
      .collection('buyProduces')
      .where('name', '==', name)
      .limit(1)
      .get();

    if (listingSnap.empty) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listingData = listingSnap.docs[0].data();

    // Defensive checks and logging
    if (!listingData.mainImage) {
      console.warn('⚠️ mainImage missing in listingData:', listingData);
    }
    if (!listingData.farmerEmail) {
      console.warn('⚠️ farmerEmail missing in listingData:', listingData);
    }
    if (!listingData.price) {
      console.warn('⚠️ price missing in listingData:', listingData);
    }

    // Fallbacks to avoid TypeError
    const pricePer10kg = listingData.price || 0;
    const mainImage = listingData.mainImage || '';
    const farmerEmail = listingData.farmerEmail || '';

    const total = quantity * (pricePer10kg / 10 + 50);

    await admin.firestore().collection('orders').add({
      name,
      fullName,
      buyerEmail,
      address,
      pincode,
      quantity,
      total,
      image: mainImage,
      farmerEmail: farmerEmail,
      createdAt: new Date(),
      status: 'Pending',
    });

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// 🔽 Get Orders by Buyer Email
const getOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const snapshot = await admin.firestore()
      .collection('orders')
      .where('buyerEmail', '==', email)
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// 🔽 Get Farmer Orders by Crop Name (optional usage)
const getFarmerOrders = async (req, res) => {
  const { cropName } = req.params;
  try {
    const snapshot = await admin.firestore()
      .collection('orders')
      .where('name', '==', cropName)
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching farmer orders:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to get farmer orders' });
  }
};

// 🔽 Get Farmer Orders by Farmer Email
const getFarmerOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const snapshot = await admin.firestore()
      .collection('orders')
      .where('farmerEmail', '==', email)
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(orders);
  } catch (err) {
    console.error('Farmer orders error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// 🔍 Get order details by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await admin.firestore().collection('orders').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching order by ID:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

// 🔄 Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await admin.firestore().collection('orders').doc(id).update({ status });
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Status update error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

const confirmDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    await admin.firestore().collection('orders').doc(id).update({
      status: 'Delivered (Confirmed)',
    });
    res.status(200).json({ message: 'Order confirmed as delivered.' });
  } catch (err) {
    console.error('Confirm delivery error:', err.message);
    res.status(500).json({ error: 'Failed to confirm delivery' });
  }
};




module.exports = {
  placeOrder,
  getOrdersByEmail,
  getFarmerOrders,
  getFarmerOrdersByEmail,
  getOrderById,
  updateOrderStatus ,
  confirmDelivery,
  

};
