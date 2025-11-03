// 🔥 Server.js file started
const express = require('express');
const cors = require('cors');
const authRoutes = require('../Backend/Routes/authRoutes');

//const produceRoutes = require('./Routes/produceRoutes');
//const produceRoutes = require('../Backend/Routes/produceRoutes');



const app = express();
app.use(cors());

// ✅ Important: DO NOT use express.json() or express.urlencoded() before file uploads


// ✅ You can optionally add JSON parser below for other routes (no file upload)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);


//app.use('/api/produce', produceRoutes);



const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
