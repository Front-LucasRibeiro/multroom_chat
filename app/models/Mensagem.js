const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mensagemSchema = new Schema({
  apelido: String,
  mensagem: String,
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mensagem', mensagemSchema);
