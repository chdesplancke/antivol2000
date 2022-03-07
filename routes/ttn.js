const express = require('express');
const router = express.Router();
const db = require('../db');
const ttn = require('../ttn');

router.post('/messages', function(req, res, next) {
    console.log(req.headers)
    const body = req.body;
    const device_id = body.end_device_ids.dev_eui;
    const received_at = body.uplink_message.received_at;
    const longitude = body.uplink_message.rx_metadata[0].location.longitude;
    const latitude = body.uplink_message.rx_metadata[0].location.latitude;
    const inclinaison = body.uplink_message.decoded_payload.inclinaison;
    const vitesse = body.uplink_message.decoded_payload.vitesse;
    const alarm = body.uplink_message.decoded_payload.alarm;
    const locker = body.uplink_message.decoded_payload.locker;
    console.log(device_id, received_at, longitude, latitude, inclinaison, vitesse, alarm, locker);

    //ttn.sendMessage(device_id, {message: "hello"});
    /*
    db.execute(
        'INSERT INTO messages (type, device_id, received_at, longitude, latitude, inclinaison, vitesse, alarm, locker) VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?)',
        [device_id, received_at, longitude, latitude, gyroscope, accelerometer, alarm, locker],
        function(err, users, fields) {
            (!err ? res.sendStatus(200) : res.sendStatus(400));
        }
    );
    */
    res.sendStatus(200);
});

router.post('/down', function (req, res, next){
    console.log(req.body);
    ttn.sendMessage(req.body.deveui, req.body.payload);
    res.sendStatus(200);
});

router.post('/up', function(req, res, next) {
    console.log(req.body.uplink_message.decoded_payload);
    res.sendStatus(200);
});

module.exports = router;
