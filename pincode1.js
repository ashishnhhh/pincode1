const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define route to handle GET requests with pincode
app.get('/pincode/:pincode', async (req, res) => {
    const pincode = req.params.pincode;

    try {
        // Make request to the API
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        
        // Extract data from the response
        const data = response.data;

        if (data && data[0].Status === "Success") {
            // Extract all city names
            const postOffices = data[0].PostOffice;
            const cities = postOffices.map(postOffice => postOffice.Name);

            // Prepare HTML content with dropdowns
            const htmlContent = `
                <h1>Pincode Details</h1>
                <label for="city">City:</label>
                <select id="city">
                    ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
                </select>
                <label for="district">District:</label>
                <select id="district">
                    <option value="${data[0].PostOffice[0].District}">${data[0].PostOffice[0].District}</option>
                </select>
                <label for="state">State:</label>
                <select id="state">
                    <option value="${data[0].PostOffice[0].State}">${data[0].PostOffice[0].State}</option>
                </select>
            `;
            
            res.send(htmlContent);
        } else {
            res.status(404).send('<p>Pincode not found</p>');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('<p>Internal server error</p>');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
