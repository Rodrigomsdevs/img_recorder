const bcrypt = require('bcrypt');
const saltRounds = 10; // Aumente este valor para maior segurança, mas isso também aumentará o tempo de processamento

async function criptografarSenha(senha) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(senha, salt);
    return hash;
  } catch (err) {
    console.error('Erro ao criptografar a senha:', err);
    throw err;
  }
}

async function verificarSenha(senha, senhaCriptografada) {
  const verified = bcrypt.compareSync(senha, senhaCriptografada);

  return verified;
}

module.exports = {
  criptografarSenha,
  verificarSenha
};