require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.ee6acje.mongodb.net/`);

mongoose.connection.on('connected', () => {
  console.log('🟢 Conectado ao MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.log('🔴 Erro na conexão com MongoDB:', err);
});

module.exports = mongoose;
