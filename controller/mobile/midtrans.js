require('dotenv').config();
const axios = require('axios');

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_URL_API = "https://app.sandbox.midtrans.com";
const MIDTRANS_URL_API2 = "https://api.sandbox.midtrans.com"

const midtransCheckout = async (order_id, gross_amount) => {
    try {
        const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64');

        const { data } = await axios.post(
            MIDTRANS_URL_API + "/snap/v1/transactions",
            {
                transaction_details: {
                    order_id,
                    gross_amount
                },
            },
            {
                headers: {
                    'Authorization': `Basic ${encodedServerKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return data;
    } catch (error) {
        console.log('Midtrans Error:', error.response?.data || error.message);
        return new Error("MIDTRANS_ERROR");
    }
};


const midtransCheck = async (order_id) => {
    try {
        const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64');

        const { data } = await axios.get(
            MIDTRANS_URL_API2 + "/v2/" + order_id + "/status",
            {
                headers: {
                    'Authorization': `Basic ${encodedServerKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return data;
    } catch (error) {
        console.log('Midtrans Error:', error?.message);
        return false
    }
};

const midtransBulkCheck = async (order_ids) => {
    try {
        const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64');

        const requests = order_ids.map(order_id =>
            axios.get(
                MIDTRANS_URL_API + "/v2/" + order_id + "/status",
                {
                    headers: {
                        'Authorization': `Basic ${encodedServerKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
        );

        const responses = await Promise.all(requests);
        return responses.map(response => response.data);
    } catch (error) {
        // console.log('Midtrans Error:', error);
        return new Error("MIDTRANS_ERROR");
    }
};

module.exports = { midtransCheckout, midtransCheck, midtransBulkCheck };