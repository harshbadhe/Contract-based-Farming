const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:  "contract-farming-bd6f2.firebasestorage.app",
  databaseURL: 'https://contract-farming-bd6f2-default-rtdb.firebaseio.com/'// ✅ your actual bucket ID here
});

const bucket = admin.storage().bucket();
module.exports = { admin, bucket };
