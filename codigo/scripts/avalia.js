let idQueryString = 0;

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosUsuario();
    construirDadosGrafico();
    calcularEModificarMediaAvaliacoes();
    configurarAvaliacao();
    carregarPortfolioUsuario();
});

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
            document.getElementById('user-rating').textContent = usuario.avaliacao;
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error.message));
}

function construirDadosGrafico() {
    const ctx = document.getElementById('avaliacoesChart').getContext('2d');
    const chart = createChart(ctx);

    fetch(`http://localhost:3000/avaliacoes`)
        .then(response => response.json())
        .then(data => {
            const userId = Number(idQueryString);
            const userReviews = data.filter(review => review.idAvaliado == userId)
            const starCounts = [0, 0, 0, 0, 0];
            userReviews.forEach(review => {
                if (review.estrelas >= 1 && review.estrelas <= 5) {
                    starCounts[review.estrelas - 1]++;
                }
            });
            chart.data.datasets[0].data = starCounts;
            chart.update();
        })
        .catch(error => console.error('Erro ao buscar avaliações:', error));
}

function createChart(ctx) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['5 Estrelas', '4 Estrelas', '3 Estrelas', '2 Estrelas', '1 Estrela'],
            datasets: [{
                label: 'Avaliações',
                data: [0, 0, 0, 0, 0],
                backgroundColor: '#8e44ad',
                borderColor: '#501968',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#501968'
                    }
                },
                y: {
                    ticks: {
                        color: '#501968'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.raw} avaliações`;
                        }
                    }
                }
            }
        }
    });
}

function configurarAvaliacao() {
    const stars = document.querySelectorAll('.star-rating input');
    const submitButton = document.getElementById('submitAvaliacao');

    stars.forEach((star) => {
        star.addEventListener('click', () => {
            const selectedValue = star.value;
            stars.forEach(s => s.nextElementSibling.classList.remove('selected'));
            for (let i = 0; i < stars.length; i++) {
                if (parseInt(stars[i].value) >= parseInt(selectedValue)) {
                    stars[i].nextElementSibling.classList.add('selected');
                }
            }
        });
    });

    submitButton.addEventListener('click', () => {
        const selectedStar = document.querySelector('.star-rating input:checked');
        const selectedStars = selectedStar ? selectedStar.value : 0;

        const avaliacao = {
            id: generateRandomId(6),
            estrelas: parseInt(selectedStars),
            idAvaliado: idQueryString
        };

        enviarAvaliacao(avaliacao);
    });
}

function enviarAvaliacao(avaliacao) {
    console.log('Enviando avaliação:', avaliacao);

    fetch('http://localhost:3000/avaliacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(avaliacao)
    })
        .then(response => {
            if (response.ok) {
                console.log('Avaliação enviada com sucesso.');
            } else {
                console.error('Erro ao enviar avaliação:', response.statusText);
            }
        })
        .catch(error => console.error('Erro ao enviar avaliação:', error));
}

function generateRandomId(length) {
    return Math.random().toString(36).substr(2, length);
}

function calcularEModificarMediaAvaliacoes() {
    const urlParams = new URLSearchParams(window.location.search);
    idQueryString = urlParams.get('id');

    fetch(`http://localhost:3000/avaliacoes`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar avaliações: ${response.status}`);
            }
            return response.json();
        })
        .then(avaliacoes => {
            const avaliacoesUsuario = avaliacoes.filter(avaliacao => avaliacao.idAvaliado === idQueryString.toString());
            const somaAvaliacoes = avaliacoesUsuario.reduce((acc, curr) => acc + curr.estrelas, 0);
            const mediaAvaliacoes = avaliacoesUsuario.length > 0 ? (somaAvaliacoes / avaliacoesUsuario.length).toFixed(1) : 0;

            return fetch(`http://localhost:3000/usuarios/${idQueryString}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao buscar usuário: ${response.status}`);
                    }
                    return response.json();
                })
                .then(usuario => {
                    if (usuario.avaliacao !== mediaAvaliacoes) {
                        const usuarioAtualizado = { ...usuario, avaliacao: mediaAvaliacoes };

                        return fetch(`http://localhost:3000/usuarios/${idQueryString}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(usuarioAtualizado)
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Erro ao atualizar avaliação do usuário: ${response.status}`);
                                }
                            });
                    }
                });
        })
        .catch(error => {
            console.error('Erro ao calcular ou modificar a média de avaliações:', error.message);
        });
}

function carregarPortfolioUsuario() {
    const galeriPortfolio = document.getElementById('galeriPortfolio');
    let galeriaUsuario = JSON.parse(localStorage.getItem('galeriaUsuario')) || {};
    const galeria = galeriaUsuario[idQueryString] || {};
    const defaultImage = 'https://cdn-icons-png.flaticon.com/512/3979/3979303.png';

    const galeriaHTML = `
            <div class="photos">          
                <label class="pic-container">
                    <img id="galeria1" src="${galeria.galeria1 || defaultImage}" alt="Photo">
                </label>
                <label class="pic-container">
                    <img id="galeria2" src="${galeria.galeria2 || defaultImage}" alt="Photo">
                </label>
                <label class="pic-container">
                    <img id="galeria3" src="${galeria.galeria3 || defaultImage}" alt="Photo">
                </label>
            </div>`;

    galeriPortfolio.innerHTML += galeriaHTML;
}