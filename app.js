var app = require('./config/server');

var server = app.listen(80, function () {
  console.log('servidor online');
})

// recebendo requições no socket 
var io = require('socket.io').listen(server);

app.set('io', io);

// criando conexao por websocket 
io.on('connection', function (socket) {
  console.log('usuario conectou')

  socket.on('disconnect', function () {
    console.log('o usuario desconectou')
  })

  // recebendo mensagem do cliente e enviando de volta 
  socket.on('msgParaServidor', function (data) {

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
