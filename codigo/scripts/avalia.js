const ratingSystem = document.querySelector('.rating-system');
const stars = document.querySelectorAll('.stars i');
const reviewCountElement = document.querySelector('.review-count');
const averageRatingElement = document.querySelector('.average-rating');
const statsBar = document.querySelector('.stats-bar');

fetch('http://localhost:3000/ratings/1')
  .then(response => response.json())
  .then(data => {
    const rating = data.ratings[0];
    updateRatingSystem(rating);
  });

function updateRatingSystem(rating) {
  // Atualizar avaliação media
  averageRatingElement.textContent = rating.averageRating;

  // Atualizar contagem de reviews
  reviewCountElement.textContent = `${rating.reviewCount} Avaliações`;

  // Update stats bar
  const stats = rating.stats;
  statsBar.innerHTML = '';
  Object.keys(stats).forEach(key => {
    const statElement = document.createElement('div');
    statElement.className = 'stat';
    statElement.innerHTML = `
      <span>${key} Estrelas</span>
      <div class="bar">
        <div class="filled" style="width: ${stats[key]}%;"></div>
      </div>
      <span>${stats[key]}%</span>
    `;
    statsBar.appendChild(statElement);
  });

  // Update stars
  const averageRating = rating.averageRating;
  stars.forEach((star, index) => {
    if (index < averageRating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}