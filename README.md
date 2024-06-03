# WhatsApp Business API with Node.js and React

This project demonstrates how to create a WhatsApp messaging service using the WhatsApp Business API, Node.js for the server, and React for the client-side application.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- npm (Node Package Manager) installed
- WhatsApp Business API credentials (access token, phone number ID, etc.)


## Setting Up the Server

1. Navigate to the server directory:

    ```sh
    cd wtsp_proj/Whatsapp-Business-API-NodeJS/server
    ```

2. Install the server dependencies:

    ```sh
    npm install express axios cors
    ```

3. Create and edit the `whatsApp.js` file:

    ```javascript
    const express = require('express');
    const axios = require('axios');
    const cors = require('cors'); // Import cors

    const app = express();
    const port = 5000;

    app.use(cors()); // Use cors middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Replace 'YOUR_ACCESS_TOKEN' with your actual WhatsApp Business API access token
    const accessToken = 'YOUR_ACCESS_TOKEN';

    app.post('/send-message', (req, res) => {
      const phone = req.body.phoneNumber; 
      const to = `212${phone.substring(1)}`; 
      console.log('the phone number from req.body is ', to);

      // Replace 'temp_appointments' with your actual template name
      const templateName = 'temp_appointments'; 
      
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
    ```

4. Run the server:

    ```sh
    node whatsApp.js
    ```

## Setting Up the Client

1. Navigate to the frontend directory:

    ```sh
    cd wtsp_proj/Whatsapp-Business-API-NodeJS/frontend
    ```

2. Create a new React application (if you haven't already):

    ```sh
    npx create-react-app frontend
    cd frontend
    ```

3. Install React dependencies:

    ```sh
    npm install axios
    ```

4. Create and edit the `DataFetcher.js` file in `src/components/`:

    ```jsx
    import React, { useState } from 'react';
    import axios from 'axios';

    function DataFetcher() {
      const [phoneNumber, setPhoneNumber] = useState('');
      const [response, setResponse] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        axios.post('http://localhost:5000/send-message', { phoneNumber })
          .then(response => {
            setResponse(response.data);
            setLoading(false);
          })
          .catch(error => {
            setError(error);
            setLoading(false);
          });
      };

      return (
        <div>
          <h2>Send WhatsApp Message</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Phone Number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </label>
            <button type="submit">Send Message</button>
          </form>

          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {response && (
            <div>
              <h3>Response:</h3>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    }

    export default DataFetcher;
    ```

5. Update `App.js` to include `DataFetcher` component:

    ```jsx
    import React from 'react';
    import './App.css';
    import DataFetcher from './components/DataFetcher';

    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <h1>React Client-Side App</h1>
            <DataFetcher />
          </header>
        </div>
      );
    }

    export default App;
    ```

6. Run the React application:

    ```sh
    npm start
    ```

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Enter the phone number you want to send a message to in the input field.
3. Click the "Send Message" button.
4. The response from the server will be displayed below the form.

## Troubleshooting

- Ensure your server is running on port 5000 and your React app on port 3000.
- If you encounter CORS issues, ensure that the `cors` middleware is properly configured in your Express server.




