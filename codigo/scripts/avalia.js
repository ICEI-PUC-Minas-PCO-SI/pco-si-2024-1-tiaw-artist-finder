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
                 // Salvar a avaliação do usuário
                 saveRating(i + 1);
                };
             });
          }
          //Função para escrever o Resultado da avaliação
          function printRatingResult(result, num = 0) {
             result.textContent = `${num}/5`;
          }
          executeRating(ratingStars, ratingResult); //Execução das funções criadas acima
   // Função para salvar a avaliação do usuário
  function saveRating(rating) {
    const urlApi = 'http://localhost:3000/stats';
    fetch(urlApi)
      .then(response => response.json())
      .then(data => {
      // Verificar se o rating existe no array data
      const ratingExists = data.some(item => item.label === rating.toString());

      if (ratingExists) {
        // Encontrar o item que corresponde ao rating
        const item = data.find(item => item.label === rating.toString());

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

