const urlApi = 'http://localhost:3000/stats';
//INICIALIZE O JSON-SERVER PARA O GRAFICO APARECER
//tentativa de puxar os dados do json
fetch(urlApi)
  .then(Response => Response.json())
  .then(data => {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    const estrelas = data.map(item => item.estrelas); 
    //Calculando a Média
    const media =  MediaPond() / QtdA();
    //Media ponderada
    function MediaPond() {
      let somapond = 0;
      for (let i = 0; i < values.length; i++) {
        somapond += values[i] * labels[i];
      }
      return somapond;
    }
    //Calculando a quantidade de avaliações
    function QtdA() {
      let Qtd = 0;
      for (let i = 0; i < values.length; i++) {
        Qtd+=values[i];
      }
      return Qtd;
    }

    
//GRÁFICO CHART.JS
const ctx = document.getElementById('stats-bar-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: estrelas,
          datasets: [{
            label: 'Quantidade de Avaliações',
            data: values,
            backgroundColor: [
              'rgba(62, 25, 131)', // 5 Estrelas
              'rgba(62, 25, 131)', // 4 Estrelas
              'rgba(62, 25, 131)', // 3 Estrelas
              'rgba(62, 25, 131)', // 2 Estrelas
              'rgba(62, 25, 131)' // 1 Estrela
            ],
            borderColor: [
              'rgba(62, 25, 131)', // 5 Estrelas
              'rgba(62, 25, 131)', // 4 Estrelas
              'rgba(62, 25, 131)', // 3 Estrelas
              'rgba(62, 25, 131)', // 2 Estrelas
              'rgba(62, 25, 131)' // 1 Estrela
            ],
            borderWidth: 1 ,
            borderRadius: 5 //Deixar as barras redondas
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
      } ,
              beginAtZero: true,
              ticks: {
                
              }
            }
          },
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });

      //Display para a Média aparecer na tela
      const mediaElement = document.getElementById('media');
      mediaElement.textContent = `${media.toFixed(1)}`;
      //Display para a Quantidade total de avaliações apareça na tela
      const QTDElement = document.getElementById('qtdA')
      QTDElement.textContent = `${QtdA()} Avaliações`
    })
    .catch(error => console.error(error));
/*------------------------------------------------------------------------------------------- */  
  //SISTEMA DE ESTRELAS - INICIO
//Função para marcar as estrelas
const ratingStars = [...document.getElementsByClassName("rating__star")];
const ratingResult = document.querySelector(".rating__result");
function executeRating(stars, result) {
   const starClassActive = "rating__star fas fa-star";
   const starClassUnactive = "rating__star far fa-star";
   const starsLength = stars.length;
   let i;
   stars.map((star) => {
      star.onclick = () => {
         i = stars.indexOf(star);

         if (star.className.indexOf(starClassUnactive) !== -1) {
            printRatingResult(result, i + 1);
            for (i; i >= 0; --i) stars[i].className = starClassActive;
         } else {
            printRatingResult(result, i);
            for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
         }
      };
   });
}
//Função para escrever o Resultado da avaliação
function printRatingResult(result, num = 0) {
   result.textContent = `${num}/5`;
}
executeRating(ratingStars, ratingResult); //Execução das funções criadas acima
/*-----------------------------------------------------------------------------------------------*/
// Sistema para adicionar avaliações ao json server
/*
const saveButton = document.querySelector('.btn-success');
saveButton.addEventListener('click', () => {
  // Chame a função para enviar os dados para o servidor e atualizar o gráfico
  sendDataAndUpdateChart();
});

function sendDataAndUpdateChart() {
  // Obtenha a avaliação do usuário
  const ratingValue = parseInt(document.querySelector('.rating__result').textContent.split('/')[0]);

  // Atualize o valor correspondente à estrela no arquivo JSON
  fetch(urlApi)
    .then(response => response.json())
    .then(data => {
      const stats = data.stats;
      const starIndex = stats.findIndex(stat => stat.label == `${ratingValue} Estrelas`); // Use the loose equality operator instead of the strict equality operator
      if (starIndex !== -1) {
        stats[starIndex].value++;
      }

      // Atualize o gráfico
      const chartData = chart.data.datasets[0].data;
      chartData[starIndex] = stats[starIndex].value;
      chart.update();

      // Feche o modal
      const modal = document.querySelector('#staticBackdrop');
      modal.classList.remove('show');

      // Atualize o arquivo JSON
      fetch(urlApi, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}*/
//ERRO ESTÁ COMENTADO ACIMA
