
//SISTEMA DE ESTRELAS - Está totalmente Funcional
const ratingStars = [...document.getElementsByClassName("rating__star")];
const ratingResult = document.querySelector(".rating__result");

printRatingResult(ratingResult); //Talvez isso seja desnecessário mas não tenho certeza 
//Função para marcar as estrelas conforme o click for feito
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


fetch('http://localhost:3000/ratings/1') //url da API
  .then(response => response.json())
  .then(data => {
    const rating = data.ratings[0];
    updateRatingSystem(rating);
  });
//Pelos Testes que fiz essa função não está trabalhando por algum motivo
function updateRatingSystem(rating) {
  // Atualizar avaliação media
  averageRatingElement.textContent = rating.averageRating;

  // Atualizar contagem de reviews
  function ContaReviews() {
    let qtd = 0;
    for(let i=1; i <= rating; i++) {
        
        if(rating.id == i) {
            qtd++
        }
        reviewCountElement=qtd;
    }
    reviewCountElement.textContent = `${rating.reviewCount} Avaliações`;  
   }
   window.addEventListener('load', ContaReviews())
  
}