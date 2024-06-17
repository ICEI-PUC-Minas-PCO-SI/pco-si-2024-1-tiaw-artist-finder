// Essa função de carregar dados está mockada apenas...

let idQueryString = 0;

function carregarDadosUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    idQueryString = urlParams.get('id');

    fetch(`http://localhost:3000/usuarios/${idQueryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do usuário.');
            }
            return response.json();
        })
        .then(usuario => {
            const userPhoto = document.getElementById('user-photo');
            if (usuario.foto) {
                userPhoto.src = usuario.foto;
            } else {
                const userPicData = JSON.parse(localStorage.getItem('userPicData'));
                if (userPicData && userPicData[idQueryString] && userPicData[idQueryString].userProfilePic) {
                    userPhoto.src = userPicData[idQueryString].userProfilePic;
                }
            }

            document.getElementById('user-name').textContent = usuario.nome;
            document.getElementById('user-age').textContent = `${usuario.idade} anos`;
            document.getElementById('username').textContent = usuario.username;
            document.getElementById('user-profession').textContent = usuario.atuacao;
            document.getElementById('user-state').textContent = usuario.estado;
            document.getElementById('user-institution').textContent = usuario.instituicao;
            document.getElementById('user-availability').textContent = usuario.disponibilidade;
            document.getElementById('user-description').textContent = usuario.descricao;
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error.message));
}

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosUsuario();
    construirDadosGrafico();
});


// Gráfico e processo de avaliação

document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('avaliacoesChart').getContext('2d');
    const chart = createChart(ctx);
});

function createChart(ctx) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1 Estrela', '2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrelas'],
            datasets: [{
                label: 'Avaliações',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const starRating = document.querySelector('.star-rating');
    const stars = starRating.querySelectorAll('.star');
    const submitButton = document.getElementById('submitAvaliacao');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            updateSelectedStars();
        });
    });

    submitButton.addEventListener('click', () => {
        const selectedStars = document.querySelectorAll('.star-rating input[type=radio]:checked').length;
        console.log(`Estrelas selecionadas: ${selectedStars}`);
    });
});

function updateSelectedStars() {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
        const input = star.previousElementSibling;
        if (input.checked) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

