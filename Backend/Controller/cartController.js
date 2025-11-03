const { admin } = require('../Firebase/admin');

// ✅ ADD TO CART
const addToCart = async (req, res) => {
  console.log('🔥 Incoming add-to-cart request:', req.body);

  try {
    const { buyerEmail, name, price, quantity, imageUrl } = req.body;

    if (!buyerEmail || !name || !price || !quantity || !imageUrl) {
      console.log('❌ Missing fields:', { buyerEmail, name, price, quantity, imageUrl });
      return res.status(400).json({ error: 'All fields are required' });
    }

    const cartItem = {
      buyerEmail,
      name,
      price,
      quantity,
      imageUrl,
      createdAt: new Date(),
    };

    await admin.firestore().collection('carts').add(cartItem);
    res.status(201).json({ message: 'Added to cart successfully!' });
  } catch (err) {
    console.error('Error adding to cart:', err.message);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// ✅ GET CART ITEMS
const getCartItems = async (req, res) => {
  try {
    const buyerEmail = req.query.buyerEmail;
    if (!buyerEmail) {
      return res.status(400).json({ error: 'Buyer email is required' });
    }

    const snapshot = await admin.firestore()
      .collection('carts')
      .where('buyerEmail', '==', buyerEmail)
      .get();

    const items = [];
    snapshot.forEach(doc => items.push(doc.data()));

    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching cart items:', err.message);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

// ✅ REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { buyerEmail, name, imageUrl } = req.body;

    if (!buyerEmail || !name || !imageUrl) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const snapshot = await admin.firestore()
      .collection('carts')
      .where('buyerEmail', '==', buyerEmail)
      .where('name', '==', name)
      .where('imageUrl', '==', imageUrl)
      .get();

    const batch = admin.firestore().batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    console.error('Error removing item:', err.message);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

module.exports = { addToCart, getCartItems, removeFromCart };
