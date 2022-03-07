var express = require('express');
const {authenticateToken, getUserId} = require("../jwt");
const db = require('../db');
const ttn = require('../ttn');
var router = express.Router();

router.post('/add', authenticateToken, function(req, res, next) {
    const id = getUserId(req.headers['authorization']);
    db.execute(
        'INSERT INTO devices (dev_eui, user_id, name, locker, alarm, created_at, modified_at) VALUES (?, ?, ?, ?, ?, now(), now())',
        [req.body.deviceId, id, req.body.name, 0, 0],
        function(err, results, fields) {
            console.log(err);
            console.log(results);
            if (!err){
                db.execute(
                    'SELECT * FROM devices WHERE dev_eui = ?',
                    [req.body.deviceId],
                    function(err, results, fields) {
                        if (!err){
                            res.json({
                                status: 'success',
                                device : [results[0]]
                            });
                        }else res.json({ status: 'error', message : 'Unable to get device'});
                    }
                );
            }else res.json({ status: 'error', message : 'Unable to add new device'});
        }
    );
});

router.post('/delete', authenticateToken, function(req, res, next) {
    const id = getUserId(req.headers['authorization']);
    db.execute(
        'DELETE FROM devices WHERE dev_eui = ? AND user_id = ?',
        [req.body.deviceId, id],
        function(err, results, fields) {
            console.log(results);
            if(!err){
                res.json({
                    status: 'success',
                    message: 'Device successfully deleted'
                });
            }else res.json({status: 'error', message: 'Can\'t delete device'});
        }
    );
});

router.post('/locker', authenticateToken, function(req, res, next) {
    const id = getUserId(req.headers['authorization']);

    db.execute(
        'UPDATE SET locker = ? WHERE id = ? AND user_id = ?; INSERT INTO down_messages SET device_id = ?, key = ?, value = ?',
        [req.body.locker, req.body.deviceId, id, req.body.deviceId, 'locker', req.body.locker],
        function(err, devices, fields) {
            if(!err){
                res.json({
                    status: 'success',
                    message: 'Successfully set locker to ' + req.body.locker
                });
            }else res.json({status: 'error', message: 'Can\'t update locker'});

        }
    );
});

router.post('/alarm', authenticateToken, function(req, res, next) {
    const id = getUserId(req.headers['authorization']);
    ttn.
    db.execute(
        'UPDATE SET alarm = ? WHERE id = ? AND user_id = ?; INSERT INTO down_messages SET device_id = ?, key = ?, value = ?',
        [req.body.alarm, req.body.deviceId, id, req.body.deviceId, 'alarm', req.body.alarm],
        function(err, devices, fields) {
            if(!err){
                res.json({
                    status: 'success',
                    message: 'Successfully set alarm to ' + req.body.alarm
                });
            }else res.json({status: 'error', message: 'Can\'t delete device'});

        }
    );
});

module.exports = router;
