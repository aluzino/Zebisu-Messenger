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
            if (event.message.text == 'Hola' || event.message.text == 'hola') {
                menuOpciones(event.sender.id);
            } else if (event.message.text == 'Recarga' || event.message.text == 'recarga' || event.message.text == 'r' || event.message.text == 'R') {
                seleccionarCompania(event.sender.id);
            } else if (event.message['quick_reply']) {
                var p = event.message.quick_reply.payload;
                p = JSON.parse(p.replace(/\'/g, "\""));
                if (p.paso == 'COMPANIA') {
                    seleccionarMonto(event.sender.id, p);
                }
            }
        }
    }
    res.sendStatus(200);
});

function menuOpciones(recipientId) {

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
                        "title": "Virgin",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Virgin' }"
                    },
                    {
                        "content_type": "text",
                        "title": "Tuenti",
                        "payload": "{ 'paso': 'COMPANIA', 'compania': 'Tuenti' }"
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
                "text": "Pick a color:",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "$10",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '10' }"
                }, {
                    "content_type": "text",
                    "title": "$20",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '20' }"
                }, {
                    "content_type": "text",
                    "title": "$30",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '30' }"
                }, {
                    "content_type": "text",
                    "title": "$50",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '50' }"
                }, {
                    "content_type": "text",
                    "title": "$100",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '100' }"
                }, {
                    "content_type": "text",
                    "title": "$200",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '200' }"
                }, {
                    "content_type": "text",
                    "title": "$500.00",
                    "payload": "{ 'paso': 'MONTO', 'compania': '" + p.compania + "', 'monto': '500' }"
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