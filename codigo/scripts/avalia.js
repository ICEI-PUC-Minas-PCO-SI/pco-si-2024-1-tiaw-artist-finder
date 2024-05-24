const urlApi = 'http://localhost:3000/stats';

//tentativa de puxar os dados do json
fetch(urlApi)
  .then(Response => Response.json())
  .then(data => {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value); 
    //Calculando a Média
    const soma = values.reduce((acc, current) => acc + current, 0);
    const media =  soma / values.length;
    //Calculando a quantidade de avaliações
    function QtdA() {
      let Qtd = 0;
      for (let i = 0; i < values.length; i++) {
        Qtd+=values[i];
      }
      return Qtd;
    }

    
//GRÁFICO CHART.JS FUNCIONANDO
const ctx = document.getElementById('stats-bar-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
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
      mediaElement.textContent = `${media.toFixed(2)}`;
      mediaElement.className = `fas fa-star`
      //Display para a Quantidade total de avaliações apareça na tela
      const QTDElement = document.getElementById('qtdA')
      QTDElement.textContent = `Quantidade de avaliações: ${QtdA()}`
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
//SISTEMA DE ESTRELAS - FIM  
