// Controller/listingController.js
const { admin } = require('../Firebase/admin');

const getMyListings = async (req, res) => {
  try {
    const db = admin.firestore();

    // Fetch from buyProduces (ready-to-sell)
    const buySnapshot = await db.collection('buyProduces').get();
    const buyListings = buySnapshot.docs.map(doc => doc.data());

    // Fetch from giveContract (going to harvest)
    const harvestSnapshot = await db.collection('giveContract').get();
    const harvestListings = harvestSnapshot.docs.map(doc => doc.data());

    // Combine both
    const allListings = [...buyListings, ...harvestListings];

    res.status(200).json(allListings);
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

module.exports = { getMyListings };
