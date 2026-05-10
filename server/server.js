import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edunest')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import authRoutes from './routes/authRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Socket.io for Chatbot and Live Notifications
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('chatbot_message', async (data) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
         socket.emit('chatbot_reply', { 
           message: "Developer note: Please add your GEMINI_API_KEY to the server/.env file.", 
           timestamp: new Date() 
         });
         return;
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest"
      });

      // Build a robust text prompt including history to avoid strict Gemini validation errors
      let promptText = "System Instruction: You are the AI assistant for 'EduNest', a platform that helps students find nearby coaching institutes (JEE, NEET, UPSC, etc.). Be helpful, concise, and friendly. Advise users to use the search bar or location features on the website.\n\n";
      
      if (data.history && Array.isArray(data.history)) {
        // Keep last 4 messages for context
        const recentHistory = data.history.slice(-4);
        recentHistory.forEach(msg => {
           if(msg.content) {
             promptText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
           }
        });
      }
      
      promptText += `User: ${data.message}\nAssistant:`;

      const result = await model.generateContent(promptText);
      const reply = result.response.text();

      socket.emit('chatbot_reply', { message: reply, timestamp: new Date() });
    } catch (error) {
      console.error('Gemini Error:', error.message);
      socket.emit('chatbot_reply', { 
        message: "Sorry, I am having trouble connecting to my brain right now. Try again later!", 
        timestamp: new Date() 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
