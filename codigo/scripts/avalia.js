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

