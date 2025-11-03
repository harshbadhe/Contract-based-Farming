const { admin } = require('../Firebase/admin');

const getProduceDetails = async (req, res) => {
  const name = decodeURIComponent(req.params.name);

  try {
    const collections = ['buyProduces', 'giveContract'];

    for (const col of collections) {
      const snapshot = await admin.firestore()
        .collection(col)
        .where('name', '==', name)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        return res.status(200).json(snapshot.docs[0].data());
      }
    }

    res.status(404).json({ error: 'Item not found' });
  } catch (err) {
    console.error('Error fetching details:', err.message);
    res.status(500).json({ error: 'Failed to get details' });
  }
};

module.exports = { getProduceDetails };
