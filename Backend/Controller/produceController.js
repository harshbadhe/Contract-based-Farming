const { admin, bucket } = require('../Firebase/admin');
const path = require('path');
const fs = require('fs');



const addProduceListing = async (req, res) => {
  const { name, category, quantity, price, description, harvestDate, mode, email } = req.body;
  const files = req.files;

  if (!name || !category || !quantity || !price || !description || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    let imageURLs = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageFileName = `produce/${Date.now()}_${i}_${path.extname(file.originalname)}`;

        await bucket.upload(file.path, {
          destination: storageFileName,
          metadata: {
            contentType: file.mimetype,
          },
        });

        await bucket.file(storageFileName).makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFileName}`;
        imageURLs.push(publicUrl);
        fs.unlinkSync(file.path);
      }
    }

    const collectionName = mode === 'ready' ? 'buyProduces' : 'giveContract';

    await admin.firestore().collection(collectionName).add({
      name,
      category,
      quantity,
      price,
      description,
      harvestDate: mode === 'pre' ? harvestDate : null,
      images: imageURLs,
      mainImage: imageURLs[0],
      farmerEmail: email, // ✅ Store email here
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Produce listing added successfully.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addProduceListing };



