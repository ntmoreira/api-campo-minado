function gerarTabuleiro() {
  // Tabuleiro 5x5: 3 diamantes e 22 bombas (total 25 posições)
  const total = 25;
  const totalDiamantes = 3;
  const posicoes = Array(total).fill('BOMBA');

  // Posiciona 3 diamantes aleatoriamente
  let colocados = 0;
  while (colocados < totalDiamantes) {
    const idx = Math.floor(Math.random() * total);
    if (posicoes[idx] === 'BOMBA') {
      posicoes[idx] = 'DIAMANTE';
      colocados++;
    }
  }

  // Converte array plano em matriz 5x5
  const tabuleiro = [];
  for (let linha = 0; linha < 5; linha++) {
    tabuleiro.push(posicoes.slice(linha * 5, linha * 5 + 5));
  }

  return tabuleiro;
}

function calcularPremio(valorAposta, quantidadeDiamantes) {
  return valorAposta * (1 + quantidadeDiamantes * 0.33);
}

module.exports = { gerarTabuleiro, calcularPremio };
