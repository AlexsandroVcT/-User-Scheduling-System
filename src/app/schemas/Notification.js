// SCHEMAS QUE SERA NOSSA REPRESENTAÇÃO DO MONGODB

import mongoose from 'mongoose';

// Na hora que ele tiver salvando o Schema ele saiba oque ta salvando dentro do MongoDB
const NotificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  // Qual o usuario que irar receber essa notificação
  user: {
    type: Number,
    required: true,
  },
  // Se a notificação foi lida ou não
  read: {
    type: Boolean,
    required: true,
    default: false,
  },

}, {
  timestamps: true,
});

export default mongoose.model('Nofitication', NotificationSchema);
