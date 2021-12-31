const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {handleError, notFound} = require('./middleware/errorMiddleware');
const connectDb = require('./config/db');

// port number
const PORT = process.env.PORT || 5000;

// configure .env file
dotenv.config();

// Connecting to MongoDB
connectDb();

// create express app
const app = express();

// API Security
app.use(helmet());

// handle CORS errors
app.use(cors());

// log all requests to the console
app.use(morgan('dev'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes
app.use('/v1/user', require('./routes/userRoutes'));

// Handle errors
app.use(handleError);
app.use(notFound);

// listen to port 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
