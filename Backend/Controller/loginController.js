// controllers/loginController.js
const { admin } = require('../Firebase/admin');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('🔥 Login API hit');
  console.log('📧 Email:', email);
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // 1. Authenticate user with Firebase Auth using email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // 2. Verify the user's password (Firebase does not directly support password validation)
    // You should use Firebase Auth on the client side (in your React app) to authenticate the user
    // If you're using Firebase Admin, you'd typically authenticate by calling the client-side auth methods.

    // 3. Generate Firebase ID Token (for session management on the frontend)
    const token = await admin.auth().createCustomToken(userRecord.uid);

    // 4. Send back the token as a response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser };
