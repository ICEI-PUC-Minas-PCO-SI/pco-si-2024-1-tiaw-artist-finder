const urlApi = 'http://localhost:3000/usuarios'; // Assumindo que seu backend tenha um endpoint para usuários

// Função para buscar dados de um usuário específico
async function getUserData(userId) {
  try {
    const response = await fetch(`${urlApi}/${userId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }
    const user = await response.json();
    renderChart(user.stats, 'stats-bar-chart'); // Renderizar o gráfico com os dados do usuário
    return user;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
}

// Adicionar event listener ao DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  getUserData(userId);
  const userId = ''; // Substituir com o ID do usuário atual
 
});

// Função para atualizar as estatísticas de um usuário
async function updateStats(userId, rating) {
  try {
    const user = await getUserData(userId);
    if (!user) return;

    const stats = user.stats;
    const existingRating = stats.find(item => item.label === rating);

    if (existingRating) {
      existingRating.value += 1;
      const response = await fetch(`${urlApi}/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
      });

      if (response.ok) {
        console.log('Avaliação salva com sucesso!');
        return true;
      } else {
        throw new Error('Erro ao salvar avaliação');
      }
    } else {
      console.error('Avaliação não encontrada!');
      return false;
    }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
    return false;
  }
}

// Função para renderizar o gráfico de avaliações
function renderChart(userStats, chartId) {
  const labels = userStats.map(item => item.estrelas);
  const values = userStats.map(item => item.value);

  const ctx = document.getElementById(chartId).getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade de Avaliações',
        data: values,
        backgroundColor: 'rgba(62, 25, 131)',
        borderColor: 'rgba(62, 25, 131)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          },
          border: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            display: true,
            padding: 10
          },
          border: {
            display: false
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });

  // Calcular e exibir a média e a quantidade total de avaliações
  const totalAvaliacoes = values.reduce((sum, value) => sum + value, 0);
  const media = totalAvaliacoes > 0 ? values.reduce((sum, value, index) => sum + value * userStats[index].label, 0) / totalAvaliacoes : 0;

  const mediaElement = document.getElementById('media');
  mediaElement.textContent = `${media.toFixed(1)}`;

  const QTDElement = document.getElementById('qtdA');
  QTDElement.textContent = `${totalAvaliacoes} Avaliações`;
}

// SISTEMA DE ESTRELAS - INÍCIO
const ratingStars = [...document.getElementsByClassName("rating__star")];
const ratingResult = document.querySelector(".rating__result");
let selectedRating = 0; // Variável global para armazenar a avaliação selecionada

function executeRating(stars, result) {
  const starClassActive = "rating__star fas fa-star";
  const starClassUnactive = "rating__star far fa-star";
  const starsLength = stars.length;

  stars.map((star) => {
    star.onclick = () => {
      let i = stars.indexOf(star);

      if (star.className.indexOf(starClassUnactive) !== -1) {
        printRatingResult(result, i + 1);
        for (let j = 0; j <= i; ++j) stars[j].className = starClassActive;
      } else {
        printRatingResult(result, i);
        for (let j = i + 1; j < starsLength; ++j) stars[j].className = starClassUnactive;
      }

      selectedRating = i + 1; // Armazenar a avaliação selecionada
    };
  });
}

function printRatingResult(result, num = 0) {
  result.textContent = `${num}/5`;
}

// Função para salvar a avaliação do usuário
async function saveRating(userId, rating) {
  if (await updateStats(userId, rating)) {
    // Renderizar o gráfico novamente
    const user = await getUserData(userId);
    renderChart(user.stats, 'stats-bar-chart');
  }
}

// Adicionar event listener ao botão salvar
const saveButton = document.getElementById('salvarbtn');
saveButton.addEventListener('click', async () => {
  const userId = '36'; // Substituir com o ID do usuário atual
  if (selectedRating > 0) {
    await saveRating(userId, selectedRating);
  } else {
    alert('Nenhuma avaliação selecionada clique nas estrelas!');
    console.error('Nenhuma avaliação selecionada!');
  }
});

// Inicializar o gráfico com os dados do usuário
const userId = '36'; // Substituir com o ID do usuário atual
getUserData(userId)
  .then(user => {
    if (user) {
      renderChart(user.stats, 'stats-bar-chart');
    }
  });

executeRating(ratingStars, ratingResult); // Execução das funções criadas acima