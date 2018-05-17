// --------------- Import de dependências --------------- //
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

// --------------- Import de arquivos do core --------------- //
const Util = require('../common/util');

//Schema de Usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O campo Nome é obrigatório.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O campo E-mail é obrigatório.'],
    unique: true,
    trim: true,
    validate: {
      validator: function (emailString) {
        return Util.validEmail(emailString);
      },
      message: 'E-mail inválido.'
    }
  },
  password: {
    type: String,
    required: [true, 'O campo Senha é obrigatório.']
  },
  role: {
    type: String
  },
  resetPasswordToken: {
    type: String
  }
}, { versionKey: false, timestamps: true });

UserSchema.plugin(unique, { message: 'E-mail já cadastrado.' });

UserSchema.pre('save', function (next) {
  let user = this;

  if (!user.isModified('password')) {
    return next();
  }

  user.resetPasswordToken = undefined;

  user.password = bcrypt.hashSync(user.password, 10);

  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
