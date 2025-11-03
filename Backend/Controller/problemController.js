// Controller/problemController.js
const { admin, bucket } = require('../Firebase/admin');
const path = require('path');
const fs = require('fs');

const postProblem = async (req, res) => {
  try {
    const { userEmail, message } = req.body;
    let imageUrl = null;

    if (!userEmail || !message) {
      return res.status(400).json({ error: 'userEmail and message are required.' });
    }

    if (req.file) {
      const filename = `problems/${Date.now()}_${path.extname(req.file.originalname)}`;
      await bucket.upload(req.file.path, { destination: filename, metadata: { contentType: req.file.mimetype } });
      await bucket.file(filename).makePublic();
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      fs.unlinkSync(req.file.path);
    }

    const docRef = await admin.firestore().collection('problems').add({
      userEmail,
      message,
      imageUrl,
      replies: [],
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Problem posted', id: docRef.id });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to post problem' });
  }
};

const getProblems = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('problems').get();
    const problems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(problems);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

const addReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const { id } = req.params;

    if (!reply || !id) return res.status(400).json({ error: 'Reply & problem ID required' });

    const ref = admin.firestore().collection('problems').doc(id);
    await ref.update({
      replies: admin.firestore.FieldValue.arrayUnion(reply)
    });

    res.json({ message: 'Reply added' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

module.exports = { postProblem, getProblems, addReply };
