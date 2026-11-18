require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start
testConnection().catch(console.error);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
