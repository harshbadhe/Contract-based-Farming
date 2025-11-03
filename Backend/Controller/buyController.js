const { admin } = require('../Firebase/admin');

const getBuyProduces = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('buyProduces').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching buy produces:', error.message);
    res.status(500).json({ error: 'Failed to fetch buy produces' });
  }
};

module.exports = { getBuyProduces };
