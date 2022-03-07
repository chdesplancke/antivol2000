const axios = require('axios');

exports.sendMessage = function (dev_eui, payload_fields){
    const config = {
        headers: { Authorization: `Bearer ${process.env.TTN_KEY}` }
    };
    const body = {
        "downlinks":[
            {
                "frm_payload":payload_fields,
                "f_port":1,
                "priority":"NORMAL"
            }
        ]
    }
    console.log('https://eu1.cloud.thethings.network/api/v3/as/applications/' + process.env.TTN_APP_ID + '/webhooks/api/devices/eui-' + dev_eui + '/down/push');
    axios.post('https://eu1.cloud.thethings.network/api/v3/as/applications/' + process.env.TTN_APP_ID + '/webhooks/api/devices/eui-' + dev_eui + '/down/push', body, config)
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            //console.log(error);
        });
};