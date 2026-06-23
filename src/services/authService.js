const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');
const { validarSenha } = require('../modules/validarSenha');

async function registrar({ nome, email, dataNascimento, senha, confirmacaoSenha }) {
  if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
    throw { status: 400, message: 'Todos os campos são obrigatórios' };
  }

  if (senha !== confirmacaoSenha) {
    throw { status: 400, message: 'As senhas não coincidem' };
  }

  const errosSenha = validarSenha(senha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join('. ') };
  }

  const emailExistente = await usuarioRepository.buscarPorEmail(email);
  if (emailExistente) {
    throw { status: 409, message: 'E-mail já cadastrado' };
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await usuarioRepository.criar({ nome, email, dataNascimento, senhaHash });
  return usuario;
}

async function login({ email, senha }) {
  if (!email || !senha) {
    throw { status: 400, message: 'E-mail e senha são obrigatórios' };
  }

  const usuario = await usuarioRepository.buscarPorEmail(email);
  if (!usuario) {
    throw { status: 401, message: 'Credenciais inválidas' };
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw { status: 401, message: 'Credenciais inválidas' };
  }

  // Retorno exato conforme especificado pelo professor
  return {
    nome: usuario.nome,
    email: usuario.email,
    dataNascimento: usuario.data_nascimento,
  };
}

async function resetarSenha({ id, novaSenha }) {
  if (!id || !novaSenha) {
    throw { status: 400, message: 'ID e nova senha são obrigatórios' };
  }

  const errosSenha = validarSenha(novaSenha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join('. ') };
  }

  const senhaAtualHash = await usuarioRepository.buscarSenhaHash(id);
  if (!senhaAtualHash) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  const senhaIgual = await bcrypt.compare(novaSenha, senhaAtualHash);
  if (senhaIgual) {
    throw { status: 400, message: 'A nova senha não pode ser igual à senha atual' };
  }

  const novaHash = await bcrypt.hash(novaSenha, 10);
  await usuarioRepository.atualizarSenha(id, novaHash);
}

module.exports = { registrar, login, resetarSenha };
