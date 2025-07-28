// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);

// Export app for tests
module.exports = app;

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => console.error('❌ MongoDB connection failed:', err));
}









// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Basic test route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // Import routes
// const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');
// const clientRoutes = require('./routes/client.routes');
// const projectRoutes = require('./routes/project.routes');

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/projects', projectRoutes);

// //Only connect & start server if this is the main entry point
// if (require.main === module) {
//   const PORT = process.env.PORT || 5000;
//   mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//       console.log('✅ MongoDB connected');
//       app.listen(PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${PORT}`);
//       });
//     })
//     .catch((err) => console.error('❌ MongoDB connection failed:', err));
// }

// //  Exporting only the app for tests
module.exports = app;
