const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessToken = 'EAAPid8qdYZBwBOwhmTRMjzTZBo7nosx7F2TOAvwRzga3AYvZArhZCWcZAVgV7o360FclIw5QWqWvfSwYdtnZCtCCwZAtDNmZBp8a4hKIeKxxUhWellaPZBmMNT483ZADubgIF4CJNZB0ZBGI6brZAePHPeDmL4O3dlNi6OPZBS2wlZCZAS8qnjGcC3PgwxZBN20QDD5vHGI2lTceK5V1pPKHXfIF1Wv6HPPRcxt9IcGyDmbIZD';

app.post('/send-message', (req, res) => {//this is our  EndPoint to send messages
  const phone = req.body.phoneNumber; 
  const to = `212${phone.substring(1)}`; 
  console.log('the phone number from req.body is ',to);
  const templateName = 'temp_appointments'; // Update with your actual template name
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en_US' // English (US) language code
      }
    }
  };

  axios.post('https://graph.facebook.com/v19.0/287252971133516/messages', data, { // Update with your phone number ID
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    res.json({
      success: true,
      data: response.data
    });
  })
  .catch(error => {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: error.response ? error.response.data.error.message : 'Error sending message'
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
