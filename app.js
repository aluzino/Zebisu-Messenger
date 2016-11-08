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

            } else if (event.message.text == 'Recarga' || event.message.text == 'recarga' || event.message.text == 'r' || event.message.text == 'R') {
                seleccionarCompania(event.sender.id, { text: "Echo: " + event.message.text });
            } else if (event.message.quick_reply) {
                console.log(event.message.quick_reply);
            }
        }
    }
    res.sendStatus(200);
});


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
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_TELCEL"
                    },
                    {
                        "content_type": "text",
                        "title": "Movistar",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_MOVISTAR"
                    },
                    {
                        "content_type": "text",
                        "title": "Unefon",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_UNEFON"
                    },
                    {
                        "content_type": "text",
                        "title": "Virgin",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_VIRGIN"
                    },
                    {
                        "content_type": "text",
                        "title": "Tuenti",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_TUENTI"
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


function seleccionarMonto(recipientId, message) {
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
                        "title": "Red",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                    },
                    {
                        "content_type": "text",
                        "title": "Green",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
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