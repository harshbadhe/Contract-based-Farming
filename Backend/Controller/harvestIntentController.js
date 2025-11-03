const { admin, bucket } = require('../Firebase/admin');
const path = require('path');
const fs = require('fs');

const submitHarvestIntent = async (req, res) => {
  try {
    const { fullName, address, acres, crops, harvestDate, email } = req.body;
    const photo = req.files?.photo?.[0];
    const landPhotos = req.files?.landPhotos || [];

    if (!fullName || !address || !acres || !crops || !harvestDate || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let photoUrl = '';
    if (photo) {
      const fileName = `profilePhotos/${Date.now()}-${photo.originalname}`;
      await bucket.upload(photo.path, { destination: fileName, metadata: { contentType: photo.mimetype } });
      await bucket.file(fileName).makePublic();
      photoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      fs.unlinkSync(photo.path);
    }

    const landPhotoUrls = [];
    for (const file of landPhotos) {
      const dest = `landPhotos/${Date.now()}-${file.originalname}`;
      await bucket.upload(file.path, { destination: dest, metadata: { contentType: file.mimetype } });
      await bucket.file(dest).makePublic();
      landPhotoUrls.push(`https://storage.googleapis.com/${bucket.name}/${dest}`);
      fs.unlinkSync(file.path);
    }

    const doc = {
      fullName,
      address,
      acres,
      crops,
      harvestDate,
      email, // ✅ Save farmer's email
      photoUrl,
      landPhotoUrls,
      createdAt: new Date(),
    };

    await admin.firestore().collection('harvestIntents').add(doc);
    res.status(201).json({ message: 'Harvest intent submitted!' });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to submit harvest intent' });
  }
};

const getHarvestIntents = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('harvestIntents').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,       // Include document ID here
      ...doc.data()
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching harvest intents:', err.message);
    res.status(500).json({ error: 'Failed to fetch harvest intents' });
  }
};

const getHarvestById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await admin.firestore().collection('harvestIntents').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Harvest not found' });
    }

    // FIX: Include document ID in response!
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Error getting harvest detail:', err.message);
    res.status(500).json({ error: 'Failed to get harvest detail' });
  }
};


const addRating = async (req, res) => {
  const { intentId, userEmail, rating } = req.body;

  if (!intentId || !userEmail || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const ratingsRef = admin.firestore().collection('ratings');
    const existing = await ratingsRef
      .where('intentId', '==', intentId)
      .where('userEmail', '==', userEmail)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: 'You already rated this user.' });
    }

    await ratingsRef.add({ intentId, userEmail, rating: Number(rating), createdAt: new Date() });

    res.status(201).json({ message: 'Rating submitted.' });
  } catch (err) {
    console.error('Rating error:', err.message);
    res.status(500).json({ error: 'Failed to submit rating.' });
  }
};

const getRatingsForIntent = async (req, res) => {
  const { intentId } = req.params;

  try {
    const ratingsSnapshot = await admin.firestore()
      .collection('ratings')
      .where('intentId', '==', intentId)
      .get();

    const ratings = ratingsSnapshot.docs.map(doc => doc.data());

    if (!ratings.length) return res.status(200).json({ average: 0, count: 0 });

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / ratings.length;

    res.status(200).json({ average: avg.toFixed(1), count: ratings.length });
  } catch (err) {
    console.error('Error fetching ratings:', err.message);
    res.status(500).json({ error: 'Failed to fetch ratings.' });
  }
};

const checkIfRated = async (req, res) => {
  const { intentId, userEmail } = req.query;

  if (!intentId || !userEmail) {
    return res.status(400).json({ error: 'intentId and userEmail are required' });
  }

  try {
    const snapshot = await admin.firestore()
      .collection('ratings')
      .where('intentId', '==', intentId)
      .where('userEmail', '==', userEmail)
      .get();

    res.json({ hasRated: !snapshot.empty });
  } catch (err) {
    console.error('Check rating error:', err);
    res.status(500).json({ error: 'Failed to check rating' });
  }
};




module.exports = {
  submitHarvestIntent,
  getHarvestIntents,
  getHarvestById,
    addRating,
  getRatingsForIntent,checkIfRated
};
