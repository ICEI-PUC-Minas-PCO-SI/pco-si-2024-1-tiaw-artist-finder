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

// Código de avaliação

let idCounter = 1;
const urlApi = "http://localhost:3000/avaliacoes";

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function adicionarAvaliacao(estrelas, usuarioAvaliado) {
    const novaAvaliacao = {
        id: generateRandomString(6),
        estrelas: estrelas,
        usuarioAvaliado: usuarioAvaliado
    };

    fetch(urlApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaAvaliacao)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar avaliação');
        }
        return response.json();
    })
    .then(data => {
        console.log('Avaliação adicionada com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function construirDadosGrafico(avaliacoes, idQueryString) {
    const avaliacoesFiltradas = avaliacoes.avaliacoes.filter(avaliacao => avaliacao.usuarioAvaliado === idQueryString);

    const estrelasCount = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
    };

    avaliacoesFiltradas.forEach(avaliacao => {
        if (avaliacao.estrelas >= 1 && avaliacao.estrelas <= 5) {
            estrelasCount[avaliacao.estrelas.toString()]++;
        }
    });
    const dadosGrafico = [];
    for (let estrelas = 1; estrelas <= 5; estrelas++) {
        dadosGrafico.push({
            estrelas: estrelas,
            quantidade: estrelasCount[estrelas.toString()]
        });
    }
    return dadosGrafico;
}


function calcularEAtualizarMedia(avaliacoes, idQueryString) {
    const avaliacoesFiltradas = avaliacoes.avaliacoes.filter(avaliacao => avaliacao.usuarioAvaliado === idQueryString);

    const media = avaliacoesFiltradas.length > 0 ?
        avaliacoesFiltradas.reduce((total, avaliacao) => total + avaliacao.estrelas, 0) / avaliacoesFiltradas.length :
        0;

    const mediaAvaliacoesElement = document.getElementById('media-avaliacoes');
    if (mediaAvaliacoesElement) {
        mediaAvaliacoesElement.textContent = media.toFixed(2);
    } else {
        console.error('Elemento #media-avaliacoes não encontrado no HTML.');
    }

    return media;
}