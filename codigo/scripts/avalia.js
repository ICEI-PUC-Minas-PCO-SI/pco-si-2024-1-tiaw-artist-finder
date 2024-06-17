// Essa função de carregar dados está mockada apenas...
// http://127.0.0.1:5501/codigo/mockAvaliacao.html?id=1

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
            document.getElementById('user-rating').textContent = usuario.avaliacao;
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error.message));
}

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosUsuario();
    construirDadosGrafico();
});


// Gráfico e processo de avaliação

document.addEventListener('DOMContentLoaded', function () {
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
});

function createChart(ctx) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1 Estrelas', '2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrela'],
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

document.addEventListener('DOMContentLoaded', function () {
    calcularEModificarMediaAvaliacoes();
    const stars = document.querySelectorAll('.star');
    const submitButton = document.getElementById('submitAvaliacao');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach(s => {
                if (s.classList.contains('selected')) {
                    s.classList.remove('selected');
                }
            });

            for (let i = index; i >= 0; i++) {
                if (!stars[i].classList.contains('selected')) {
                    stars[i].classList.add('selected');
                }
            }
        });
    });

    submitButton.addEventListener('click', () => {
        const selectedStars = document.querySelectorAll('.star.selected').length;
        const avaliacao = {
            id: generateRandomId(6),
            estrelas: selectedStars,
            idAvaliado: idQueryString
        };

        enviarAvaliacao(avaliacao);
    });
});

function enviarAvaliacao(avaliacao) {
    fetch('http://localhost:3000/avaliacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(avaliacao)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar avaliação');
            }
            return response.json();
        })
        .then(data => {
            console.log('Avaliação enviada com sucesso:', data);
        })
        .catch(error => {
            console.error('Erro ao enviar avaliação:', error);
        });
}

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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
                                console.log('Avaliação do usuário atualizada com sucesso');
                            });
                    } else {
                        console.log('A avaliação do usuário já está atualizada');
                    }
                });
        })
        .catch(error => {
            console.error('Erro ao calcular ou modificar a média de avaliações:', error.message);
        });
}

// Para otimização, necessário corrigir para um único evento de DOM



