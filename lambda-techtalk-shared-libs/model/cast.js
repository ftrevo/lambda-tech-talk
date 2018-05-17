// --------------- Import de dependências --------------- //
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

//Schema de Ator/Atriz
const CastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O campo Nome é obrigatório.'],
    unique: true,
    trim: true
  },
  birth: {
    type: Date,
    required: [true, 'O campo Data de Nascimento é obrigatório.']
  }
}, { versionKey: false, timestamps: true });

CastSchema.plugin(unique, { message: 'Ator/Atriz já cadastrado(a).' });

module.exports = mongoose.models.Cast || mongoose.model('Cast', CastSchema);
