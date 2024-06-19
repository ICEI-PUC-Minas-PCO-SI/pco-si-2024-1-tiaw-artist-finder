let loggedInUserId = localStorage.getItem('loggedInUserId');

function obterUsuarioLogado() {
    return fetch(`http://localhost:3000/usuarios/${loggedInUserId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter dados do usuário');
            }
            return response.json();
        });
}

function carregarDadosUsuario() {
    obterUsuarioLogado()
        .then(usuario => {
            document.getElementById('editName').value = usuario.nome;
            document.getElementById('editAge').value = usuario.idade;
            document.getElementById('editUsername').value = usuario.username;
            document.getElementById('editProfession').value = usuario.atuacao;
            document.getElementById('editState').value = usuario.estado;
            document.getElementById('editInstitution').value = usuario.instituicao;
            document.getElementById('editAvailability').value = usuario.disponibilidade;
            document.getElementById('editDescription').value = usuario.descricao;

            const userPhoto = document.getElementById('user-photo');
            userPhoto.src = usuario.foto || 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';

            document.getElementById('user-name').textContent = usuario.nome;
            document.getElementById('user-age').textContent = `${usuario.idade} anos`;
            document.getElementById('username').textContent = usuario.username;
            document.getElementById('user-profession').textContent = usuario.atuacao;
            document.getElementById('user-state').textContent = usuario.estado;
            document.getElementById('user-institution').textContent = usuario.instituicao;
            document.getElementById('user-availability').textContent = usuario.disponibilidade;
            document.getElementById('user-description').textContent = usuario.descricao;
            document.getElementById('user-rating').textContent = usuario.avaliacao;

            if (loggedInUserId < 36) {
                const editPic = document.getElementById('edit-pic');
                if (editPic) {
                    editPic.style.display = 'none';
                }
            }
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error.message));
}

function salvarMudancasUsuario() {
    const nome = document.getElementById('editName').value;
    const idade = document.getElementById('editAge').value;
    const username = document.getElementById('editUsername').value;
    const profissao = document.getElementById('editProfession').value;
    const estado = document.getElementById('editState').value;
    const instituicao = document.getElementById('editInstitution').value;
    const disponibilidade = document.getElementById('editAvailability').value;
    const descricao = document.getElementById('editDescription').value;

    obterUsuarioLogado()
        .then(usuarioLogado => {
            const dadosAtualizados = {
                ...usuarioLogado,
                nome: nome || usuarioLogado.nome,
                idade: idade || usuarioLogado.idade,
                username: username || usuarioLogado.username,
                atuacao: profissao || usuarioLogado.atuacao,
                estado: estado || usuarioLogado.estado,
                instituicao: instituicao || usuarioLogado.instituicao,
                disponibilidade: disponibilidade || usuarioLogado.disponibilidade,
                descricao: descricao || usuarioLogado.descricao
            };

            return fetch(`http://localhost:3000/usuarios/${loggedInUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do usuário');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados atualizados com sucesso:', data);
            carregarDadosUsuario();
            const modal = new bootstrap.Modal(document.getElementById('editModal'));
            modal.hide();
        })
        .catch(error => console.error('Erro ao salvar dados:', error.message));
}

function convertImageToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

function saveImageToLocalStorage(imageBase64) {
    let userPicData = JSON.parse(localStorage.getItem('userPicData')) || {};
    userPicData[loggedInUserId] = imageBase64;
    localStorage.setItem('userPicData', JSON.stringify(userPicData));
    console.log('Imagem salva no localStorage.');
}

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosUsuario();

    document.getElementById('saveChangesButton').addEventListener('click', function () {
        salvarMudancasUsuario();
    });

    document.getElementById('editPhoto').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            convertImageToBase64(file, function (base64) {
                saveImageToLocalStorage(base64);
            });
        }
    });
});