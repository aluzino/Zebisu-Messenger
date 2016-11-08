var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function(req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function(req, res) {
    var events = req.body.entry[0].messaging;
    console.log(events);
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (event.message.text == 'ID') {
                mensaje(event.sender.id, 'Tu id para activar el servicio es: ' + event.sender.id);
            } else if (event.message.text == 'Hola' || event.message.text == 'hola') {
                menuOpciones(event.sender.id);
            } else if (event.message.text == 'Recarga' || event.message.text == 'recarga' || event.message.text == 'r' || event.message.text == 'R') {
                seleccionarCompania(event.sender.id);
            } else if (event.message['quick_reply']) {
                var p = event.message.quick_reply.payload;
                p = JSON.parse(p.replace(/\'/g, "\""));
                console.log(p);

                if (p.paso == 'RECARGA') {
                    seleccionarCompania(event.sender.id);
                } else if (p.paso == 'COMPANIA') {
                    seleccionarMonto(event.sender.id, p);
                } else if (p.paso == 'MONTO') {
                    confirmarRecarga(event.sender.id, p);
                } else {
                    mensaje(event.sender.id, 'No tenemos nada para la opcion seleccionada 😔');
                }
            }
        }
    }
    res.sendStatus(200);
});

function menuOpciones(recipientId) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            "message": {
                "text": "Hola, como podemos ayudarte?",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Recargas",
                    "payload": "{ 'paso': 'RECARGA' }"
                }, {
                    "content_type": "text",
                    "title": "Datos",
                    "payload": ""
                }, {
                    "content_type": "text",
                    "title": "Consultar saldo",
                    "payload": ""
                }, {
                    "content_type": "text",
                    "title": "Ultimas 5 compras",
                    "payload": ""
                }]
            }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


function seleccionarCompania(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            "message": {
                "text": "Selecciona la compañia:",
                "quick_replies": [{
                        "content_type": "text",
                        "title": "Telcel",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Telcel' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Movistar",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Movistar' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Unefon",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Unefon' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Nextel",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Nextel' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Virgin",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Virgin' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Tuenti",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Tuenti' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Alo",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Alo' }"
                    }
                ]
            }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


function seleccionarMonto(recipientId, p) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            "message": {
                "text": "Selecciona un monto:",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "$10",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 10 }"
                }, {
                    "content_type": "text",
                    "title": "$20",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 20 }"
                }, {
                    "content_type": "text",
                    "title": "$30",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 30 }"
                }, {
                    "content_type": "text",
                    "title": "$50",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 50 }"
                }, {
                    "content_type": "text",
                    "title": "$100",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 100 }"
                }, {
                    "content_type": "text",
                    "title": "$200",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 200 }"
                }, {
                    "content_type": "text",
                    "title": "$300",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 300 }"
                }, {
                    "content_type": "text",
                    "title": "$500",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': 500' }"
                }]
            }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function confirmarRecarga(recipientId, p) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            "message": {
                "text": "Confirmar recarga:",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Confirmar",
                    "payload": "{ 'paso': 'CONFR', 'compania': '" + p.compania + "', 'monto': '" + p.monto + "', 'confirmar': true }"
                }, {
                    "content_type": "text",
                    "title": "Declinar",
                    "payload": "{ 'paso': 'CONFR', 'compania': '" + p.compania + "', 'monto': '" + p.monto + "', 'confirmar': false }"
                }]
            }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function mensaje(recipientId, texto) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            "message": {
                "text": texto
            }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}