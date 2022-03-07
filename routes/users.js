const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db');
const {authenticateToken, generateToken, getUserId} = require("../jwt");

/* GET users listing. */
router.post('/login', function(req, res, next) {
    let hashPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

      db.execute(
          'SELECT * FROM users WHERE email = ?',
          [req.body.email],
          function(err, users, fields) {
            if(users.length !== 0){
                if(users[0].password.toUpperCase() === hashPassword.toUpperCase()){
                    db.execute(
                        'SELECT * FROM devices WHERE user_id = ?',
                        [users[0].id],
                        function(err, devices, fields) {
                            res.json({
                                status: 'success',
                                jwt: generateToken(users[0].id),
                                email: users[0].email,
                                firstName: users[0].first_name,
                                lastName: users[0].last_name,
                                devices : [devices[0]]
                            });
                        }
                    );
                }else res.json({status: 'error', message: 'Incorrect password'});
            }else res.json({status: 'error', message: 'Account not found'});
          }
      );
});

router.post('/register', function(req, res, next) {
    let hashPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

    db.execute(
        'INSERT INTO users (first_name, last_name, email, password, created_at, modified_at) VALUES (?, ?, ?, ?, now(), now())',
        [req.body.firstName, req.body.lastName, req.body.email, hashPassword],
        function(err, results, fields) {
            if (!err){
                res.json({
                    status: 'success',
                    jwt: generateToken(results.insertId),
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    devices : [null]
                });
            }else res.json({ status: 'error', message : 'Unable to add account'});
        }
    );
});

router.post('/edit', authenticateToken, function(req, res, next) {
    if (req.body.firstName !== undefined || req.body.lastName !== undefined || req.body.email !== undefined || req.body.password !== undefined) {
        let hashPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

        const id = getUserId(req.headers['authorization']);

        db.execute(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, modified_at = now() WHERE id = ?',
            [req.body.firstName, req.body.lastName, req.body.email, hashPassword, id],
            function (err, results, fields) {
                if (!err) {
                    db.execute(
                        'SELECT * FROM devices WHERE `user_id` = ?',
                        [id],
                        function (err, devices, fields) {
                            res.json({
                                status: 'success',
                                email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                devices: [devices[0]]
                            });
                        }
                    );
                } else res.json({status: 'error', message: 'Can\'t add account'});

            }
        );
    } else res.json({status: 'error', message: 'Missing required parameters'});
});

router.post('/delete', authenticateToken, function(req, res, next) {
    let hashPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

    const id = getUserId(req.headers['authorization']);

    db.execute(
        'SELECT * FROM users WHERE `id` = ?',
        [id],
        function(err, users, fields) {
            if(users.length !== 0){
                if(users[0].password === hashPassword){
                    db.execute(
                        'DELETE FROM users WHERE `id` = ?',
                        [id],
                        function(err, devices, fields) {
                            if(!err){
                                res.json({
                                    status: 'success',
                                    message: 'Account successfully deleted'
                                });
                            }else res.json({status: 'error', message: 'Can\'t delete account'});

                        }
                    );
                }else res.json({status: 'error', message: 'Incorrect password'});
            }else res.json({status: 'error', message: 'Account not found'});
        }
    );
});

module.exports = router;
