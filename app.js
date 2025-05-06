var app = require('./config/server');

var server = app.listen(80, function () {
  console.log('servidor online');
})

const Mensagem = require('./app/models/Mensagem');

// recebendo requições no socket 
var io = require('socket.io').listen(server);

app.set('io', io);

// criando conexao por websocket 
io.on('connection', async function (socket) {
  console.log('usuario conectou')

  // Carregar histórico de mensagens
  try {
    const mensagens = await Mensagem.find().sort({ data: 1 }); // Ordena as mensagens pela data (do mais antigo para o mais recente)
    socket.emit('historicoParaCliente', mensagens);
  } catch (err) {
    console.error('Erro ao carregar o histórico:', err);
  }

  socket.on('disconnect', function () {
    console.log('o usuario desconectou')
  })

  // recebendo mensagem do cliente e enviando de volta 
  socket.on('msgParaServidor', async function (data) {
    // salvar no banco
    try {
      await Mensagem.create({
        apelido: data.apelido,
        mensagem: data.mensagem
      });
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
    }

    // dialogo 
    socket.emit('msgParaCliente', {
      apelido: data.apelido,
      mensagem: data.mensagem
    });

    socket.broadcast.emit('msgParaCliente', {
      apelido: data.apelido,
      mensagem: data.mensagem
    });

    // participantes 
    if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
      socket.emit(
        'participantesParaCliente',
        { apelido: data.apelido }
      );

      socket.broadcast.emit(
        'participantesParaCliente',
        { apelido: data.apelido }
      );
    }
  })
});
