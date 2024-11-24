import express from 'express'


const app = express();

const hostname = 'localhost';
const port = 9010;

// Route to handle GET /weather
app.get('/weather', (req, res) => {
    console.log(req.query);
    let daichi = {
        city: req.query['city'],
        district: req.query['district'],
        country: req.query['country']
    };
    res.end(JSON.stringify(daichi)); // Send JSON response
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server đang chạy tại http://${hostname}:${port}/`);
});