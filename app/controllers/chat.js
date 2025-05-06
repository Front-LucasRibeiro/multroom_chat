const Mensagem = require('../models/Mensagem'); // Ajuste o caminho conforme necessário

module.exports.iniciaChat = async function (application, req, res) {
  var dadosForm = req.body;

  req.assert('apelido', 'Nome ou apelido é obrigatório.').notEmpty();
  req.assert('apelido', 'Nome ou apelido deve conter entre 3 e 15 caracteres.').len(3, 15);

  var erros = req.validationErrors();

  if (erros) {
    res.render('index', { validacao: erros })
    return; // usar o return para finalizar o processo e o código seguinte não for processado
  }

  application.get('io').emit(
    'msgParaCliente',
    { apelido: dadosForm.apelido, mensagem: 'acabou de entrar no chat' }
  )

  const historico = await Mensagem.find().sort({ data: 1 }).limit(50); // últimos 50

  res.render('chat', { dadosForm: dadosForm, historico: historico })
} 