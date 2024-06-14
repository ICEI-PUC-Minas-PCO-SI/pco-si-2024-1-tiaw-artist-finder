// Função para recuperar os dados do usuário do banco de dados e adicionar ao HTML
function carregarDadosUsuarioLogado() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const user = usuarios.find(u => u.loggedIn);
            if (user) {
                atualizarPerfilVisual(user); // Atualiza os elementos HTML com os dados do usuário
            } else {
                console.error('Nenhum usuário logado encontrado.');
            }
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
}

carregarDadosUsuarioLogado();

// Função para atualizar os elementos na página com os dados do usuário
function atualizarPerfilVisual(usuario) {
    // Atualiza os elementos na página com os dados do usuário
    document.getElementById('name').textContent = usuario.nome;
    document.getElementById('display-username').textContent = usuario.username;
    document.getElementById('atuacao').textContent = usuario.atuacao;
    document.getElementById('estado').textContent = usuario.estado;

    // Preencher a foto de perfil
    if (usuario.foto) {
        document.getElementById('profile_pic').src = usuario.foto;
    } else {
        // Se não houver foto de perfil, exibir uma imagem padrão ou deixar em branco
        document.getElementById('profile_pic').src = "./assets/img/user-profile-icon.svg";
    }
}

// Chamar a função para carregar os dados do usuário assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarDadosUsuarioLogado);

// Função para abrir o modal e carregar os dados do usuário
function abrirModal() {
    try {
        var modal = document.getElementById('myModal');
        if (!modal) {
            throw new Error('Elemento modal não encontrado.');
        }

        // Exibir o modal
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Verificar se a div overlay já existe
        var overlay = document.querySelector('.modal-backdrop');
        if (!overlay) {
            // Se não existir, cria uma nova
            overlay = document.createElement('div');
            overlay.classList.add('modal-backdrop', 'fade', 'show');
            document.body.appendChild(overlay);
        }

        // Recuperar os dados do usuário logado e preencher o formulário
        preencherFormulario();
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

function preencherFormulario() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const user = usuarios.find(u => u.loggedIn);
            if (user) {
                dadoseditaveis(user);
            } else {
                console.error('Nenhum usuário logado encontrado.');
            }
        })
        .catch(error => console.error('Erro ao carregar os dados do usuário:', error));
}
preencherFormulario();
function dadoseditaveis (usuario){
    // Preencher os campos do formulário com os dados do usuário
    document.getElementById('id').value = usuario.id;
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('username').value = usuario.username;
    document.getElementById('atuacaoP').value = usuario.atuacao;
    document.getElementById('state').value = usuario.estado;
    
}

function fecharModal() {
    var modal = document.getElementById('myModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    var overlay = document.querySelector('.modal-backdrop');
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}

function salvarDados() {
    var userId = document.getElementById('id').value;

    fetch(`http://localhost:3000/usuarios/${userId}`)
        .then(response => response.json())
        .then(user => {
            var nome = document.getElementById('nome').value;
            var username = document.getElementById('username').value;
            var atuacao = document.getElementById('atuacaoP').value;
            var estado = document.getElementById('state').value;

            var fotoPerfil = document.getElementById('foto').files[0];

            var userData = {};
            if (nome !== user.nome) userData.nome = nome;
            if (username !== user.username) userData.username = username;
            if (atuacao !== user.atuacao) userData.atuacao = atuacao;
            if (estado !== user.estado) userData.estado = estado;


            if (Object.keys(userData).length > 0) {
                fetch(`http://localhost:3000/usuarios/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao salvar os dados do usuário');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Dados salvos com sucesso!');
                    fecharModal();
                })
                .catch(error => {
                    console.error('Erro ao salvar os dados do usuário:', error);
                });
            } else {
                alert('Nenhuma alteração foi feita.');
                fecharModal();
            }
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
}

function login(userId) {
    // Armazenar o ID do usuário logado no localStorage
    localStorage.setItem('loggedInUserId', userId);
}
// Adiciona event listener para fechar o modal ao clicar no botão de fechar
var fecharBtn = document.getElementById('fecharmodal');
fecharBtn.addEventListener('click', fecharModal);

// Adiciona event listener para abrir o modal ao clicar no botão de abrir
var abrirBtn = document.querySelector('.edit-btn');
if (abrirBtn) {
    abrirBtn.addEventListener('click', abrirModal);
} else {
    console.error('Botão de abrir modal não encontrado.');
}

// Adiciona event listener para salvar as alterações no perfil do usuário
const modalSalvar = document.getElementById('btnSalvar');
if (modalSalvar) {
    modalSalvar.addEventListener('click', salvarDados);
} else {
    console.error('Botão de salvar não encontrado.');
}
