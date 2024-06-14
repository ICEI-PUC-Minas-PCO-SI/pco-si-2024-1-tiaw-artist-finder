const urlApi = 'http://localhost:3000/stats';

let selectedRating = 0; // Variável global para armazenar a avaliação selecionada

// Função para puxar os dados do JSON
fetch(urlApi)
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    const estrelas = data.map(item => item.estrelas); 
    
    // Calculando a Média
    const totalAvaliacoes = QtdA();
    const media = totalAvaliacoes > 0 ? MediaPond() / totalAvaliacoes : 0;

    // Função para calcular a média ponderada
    function MediaPond() {
      let somapond = 0;
      for (let i = 0; i < values.length; i++) {
        somapond += values[i] * labels[i];
      }
      return somapond;
    }

    // Função para calcular a quantidade de avaliações
    function QtdA() {
      let Qtd = 0;
      for (let i = 0; i < values.length; i++) {
        Qtd += values[i];
      }
      return Qtd;
    }

    // Configuração do gráfico com Chart.js
    const ctx = document.getElementById('stats-bar-chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: estrelas,
        datasets: [{
          label: 'Quantidade de Avaliações',
          data: values,
          backgroundColor: 'rgba(62, 25, 131)',
          borderColor: 'rgba(62, 25, 131)',
          borderWidth: 1,
          borderRadius: 5 // Deixar as barras redondas
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

    // Display para a média aparecer na tela
    const mediaElement = document.getElementById('media');
    mediaElement.textContent = `${media.toFixed(1)}`;
    
    // Display para a quantidade total de avaliações aparecer na tela
    const QTDElement = document.getElementById('qtdA');
    QTDElement.textContent = `${totalAvaliacoes} Avaliações`;
  })
  .catch(error => console.error('Erro ao buscar dados:', error));

/*------------------------------------------------------------------------------------------- */  
// SISTEMA DE ESTRELAS - INÍCIO
// Função para marcar as estrelas
const ratingStars = [...document.getElementsByClassName("rating__star")];
const ratingResult = document.querySelector(".rating__result");

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

      // Armazenar a avaliação selecionada
      selectedRating = i + 1;
    };
  });
}

// Função para escrever o resultado da avaliação
function printRatingResult(result, num = 0) {
  result.textContent = `${num}/5`;
}

// Função para salvar a avaliação do usuário
function saveRating(rating) {
  fetch(urlApi)
    .then(response => response.json())
    .then(data => {
      // Verificar se o rating existe no array data
      const ratingExists = data.some(item => item.label === rating);

      if (ratingExists) {
        // Encontrar o item que corresponde ao rating
        const item = data.find(item => item.label === rating);

        // Atualizar o valor do item
        const newValue = item.value + 1;
        fetch(`${urlApi}/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: newValue })
        })
        .then(response => {
          if (response.ok) {
            console.log('Avaliação salva com sucesso!');
          } else {
            throw new Error('Erro ao salvar avaliação');
          }
        })
        .catch(error => console.error(error));
      } else {
        console.error('Avaliação não encontrada!');
      }
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}

// Adicionar event listener ao botão salvar
const saveButton = document.getElementById('salvarbtn');
saveButton.addEventListener('click', () => {
  if (selectedRating > 0) {
    saveRating(selectedRating);
  } else {
    alert('Nenhuma avaliação selecionada clique nas estrelas!');
    console.error('Nenhuma avaliação selecionada!');
  }
});

executeRating(ratingStars, ratingResult); // Execução das funções criadas acima
