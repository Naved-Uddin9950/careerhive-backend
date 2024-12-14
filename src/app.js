import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/User.route.js';
import recruiterRoutes from './routes/Recruiter.route.js';
import jobseekerRoutes from './routes/Jobseeker.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { constants } from './utils/constants.js';

dotenv.config();
const app = express();
const PORT = constants.port || 3001;
const DB_CONNECTION_STRING = constants.connection_string;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// app.use(cors({
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

mongoose
    .connect(DB_CONNECTION_STRING)
    .then(() => console.log('Database connected.'))
    .catch((err) => console.log('Error connecting to Database:', err));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/jobseeker', jobseekerRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Server is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;