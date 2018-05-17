// --------------- Import de dependências --------------- //
const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

//Schema de Produção Audiovisual
const ProductionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O campo Nome é obrigatório.'],
        trim: true
    },
    releaseDate: {
        type: Date
    },
    otherInfo: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    audiovisualType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AudiovisualType',
        required: [true, 'O campo Tipo de Produção Audiovisual é obrigatório.']
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: [true, 'O campo Gênero é obrigatório.']
    },
    cast: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cast'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { versionKey: false, timestamps: true });

ProductionSchema.plugin(idValidator,
    {
        message: 'MISSING-OBJECT',
        allowDuplicates: true
    }
);

module.exports = mongoose.models.Production || mongoose.model('Production', ProductionSchema);
