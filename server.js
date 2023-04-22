const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const path = require("path");

const app = express();

app.get('/', (req, res) => {
    // res.
    // return 'test';
    res.sendFile(path.join(__dirname, '/index.html'));
});

const server = http.createServer(app);

const webSocketServer = new WebSocket.WebSocketServer({
    // host: '127.0.0.1',
    // port: 9000,
    server: server
});

webSocketServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log('Новый пользователь');
    // отправка приветственного сообщения клиенту
    wsClient.send('Привет');
    wsClient.on('message', function(message) {
        try {
            // сообщение пришло текстом, нужно конвертировать в JSON-формат
            const jsonMessage = JSON.parse(message);
            switch (jsonMessage.action) {
                case 'ECHO':
                    wsClient.send(jsonMessage.data);
                    break;
                case 'PING':
                    setTimeout(function() {
                        wsClient.send('PONG');
                    }, 2000);
                    break;
                default:
                    console.log('Неизвестная команда');
                    break;
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    });
    wsClient.on('close', function() {
        // отправка уведомления в консоль
        console.log('Пользователь отключился');
    });
}

server.listen(8001, /*'127.0.0.1',*/ function () {
    console.log('Server started on 127.0.0.1:8001');
});
