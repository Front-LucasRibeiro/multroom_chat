const http = require('http');
var app = require('./config/server');
const Mensagem = require('./app/models/Mensagem');
const socketIo = require('socket.io');

// Criar o servidor HTTP
var server = http.createServer(app);

// Inicializar o Socket.IO com CORS
const io = socketIo(server, {
  cors: {
    origin: '*', // Permite todas as origens; ajuste conforme necessário
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

var server = app.listen(80, function () {
  console.log('servidor online');
})

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
