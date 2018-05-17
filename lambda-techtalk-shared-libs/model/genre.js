// --------------- Import de dependências --------------- //
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

//Schema de Urgência
const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O campo Nome é obrigatório.'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'O campo Descrição é obrigatório.']
  }
}, { versionKey: false, timestamps: true });

GenreSchema.plugin(unique, { message: 'Gênero já cadastrado.' });

module.exports = mongoose.models.Genre || mongoose.model('Genre', GenreSchema);
