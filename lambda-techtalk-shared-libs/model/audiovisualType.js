// --------------- Import de dependências --------------- //
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

//Schema de Tipo de Produção Audiovisual
const AudiovisualTypeSchema = new mongoose.Schema({
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

AudiovisualTypeSchema.plugin(unique, { message: 'Tipo de Produção Audiovisual já cadastrada.' });

module.exports = mongoose.models.AudiovisualType || mongoose.model('AudiovisualType', AudiovisualTypeSchema);
