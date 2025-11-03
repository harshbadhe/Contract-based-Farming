const { admin, bucket } = require('../Firebase/admin');
const path = require('path');
const fs = require('fs');

const registerUser = async (req, res) => {
  const { name, email, password, address, city, role } = req.body;
  const file = req.file;

  
    console.log('🔥 Register API hit');
    console.log('📦 req.body:', req.body);
    console.log('🖼️ req.file:', req.file);

  if (!name || !email || !password || !address || !city || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Upload photo to Firebase Storage
    let photoURL = '';
    if (file) {
      const storageFileName = `users/${userRecord.uid}_${Date.now()}${path.extname(file.originalname)}`;
      await bucket.upload(file.path, {
        destination: storageFileName,
        metadata: {
          contentType: file.mimetype,
        },
      });

      // ✅ Make image public
      await bucket.file(storageFileName).makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFileName}`;
      photoURL = publicUrl;
    }

    // 3. Save user details in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      address,
      city,
      role,
      photo: photoURL,
      createdAt: new Date(),
    });

    // 4. Clean temp file
    if (file) fs.unlinkSync(file.path);

    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };
