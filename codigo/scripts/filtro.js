document.body.onload = init;

const URL = 'http://localhost:3000/usuarios';
const userList = document.getElementById('user-list');
const searchBar = document.getElementById('searchBar');
let afUsers = [];

let FILTRO_ATUACAO = "";
let FILTRO_ESTADO = "";
let FILTRO_DISPONIBILIDADE = "";

function init() {
    document.querySelector('#filtroAtuacao').addEventListener('change', (e) => {
        FILTRO_ATUACAO = e.target.value;
        exibeUsuarios();
    });

    document.querySelector('#filtroEstado').addEventListener('change', (e) => {
        FILTRO_ESTADO = e.target.value;
        exibeUsuarios();
    });

    document.querySelector('#filtroDisponibilidade').addEventListener('change', (e) => {
        FILTRO_DISPONIBILIDADE = e.target.value;
        exibeUsuarios();
    });

    document.querySelector('#limpar').addEventListener('click', () => {
        FILTRO_ATUACAO = "";
        FILTRO_ESTADO = "";
        FILTRO_DISPONIBILIDADE = "";
        document.querySelector('#filtroAtuacao').value = "";
        document.querySelector('#filtroEstado').value = "";
        document.querySelector('#filtroDisponibilidade').value = "";
        searchBar.value = "";
        exibeUsuarios();
    });

    searchBar.addEventListener("keyup", () => {
        exibeUsuarios();
    });

    carregarUsuarios();
}

async function carregarUsuarios() {
    try {
        const res = await fetch(URL);
        afUsers = await res.json();
        localStorage.setItem('dbUsers', JSON.stringify(afUsers));
        exibeUsuarios();
    } catch (err) {
        console.error(err);
    }
}

function exibeUsuarios() {
    const usuariosData = JSON.parse(localStorage.getItem('dbUsers')) || [];
    const usuariosFiltrados = filtrarUsuarios(usuariosData);
    displayUsers(usuariosFiltrados);
}

function filtrarUsuarios(usuarios) {
    const searchString = searchBar.value.toLowerCase();

    return usuarios.filter(usuario => {
        const matchesAtuacao = FILTRO_ATUACAO === "" || usuario.atuacao === FILTRO_ATUACAO;
        const matchesEstado = FILTRO_ESTADO === "" || usuario.estado === FILTRO_ESTADO;
        const matchesDisponibilidade = FILTRO_DISPONIBILIDADE === "" || usuario.disponibilidade === FILTRO_DISPONIBILIDADE;

        const matchesSearch = searchString === "" ||
            usuario.nome.toLowerCase().includes(searchString) ||
            usuario.atuacao.toLowerCase().includes(searchString) ||
            usuario.estado.toLowerCase().includes(searchString) ||
            usuario.disponibilidade.toLowerCase().includes(searchString);

        return matchesAtuacao && matchesEstado && matchesDisponibilidade && matchesSearch;
    });
}

async function displayUsers(users) {
    try {
        const usuarioLogadoId = await getLoggedInUser();

        const user_list = users.map((usuario) => {
            if (usuario.id !== usuarioLogadoId) {
                let userCapa = '';
                let userFotoPerfil = '';

                const galeriaUsuario = JSON.parse(localStorage.getItem('galeriaUsuario')) || {};
                if (galeriaUsuario[usuario.id]) {
                    if (galeriaUsuario[usuario.id].galeria1) {
                        userCapa = galeriaUsuario[usuario.id].galeria1;
                    } else if (galeriaUsuario[usuario.id].galeria2) {
                        userCapa = galeriaUsuario[usuario.id].galeria2;
                    } else if (galeriaUsuario[usuario.id].galeria3) {
                        userCapa = galeriaUsuario[usuario.id].galeria3;
                    }
                }

                if (!userCapa) {
                    userCapa = 'https://picsum.photos/800/800';
                }

                if (usuario.foto) {
                    userFotoPerfil = usuario.foto;
                } else {
                    const userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
                    const userIndex = userPicData.findIndex(user => user.id === usuario.id.toString());
                    if (userIndex !== -1) {
                        userFotoPerfil = userPicData[userIndex].foto;
                    }
                }

                if (!userFotoPerfil) {
                    userFotoPerfil = 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
                }

                return `
                    <div class="col-md-4 mb-5">
                        <a href="user.html?id=${usuario.id}">
                            <div class="card">
                                <div class="img1"><img src="${userCapa}" alt=""></div>
                                <div class="img2"><img src="${userFotoPerfil}" alt=""></div>
                                <div class="main-text">
                                    <h2>${usuario.nome}</h2>
                                    <p><strong>Área de atuação:</strong> ${usuario.atuacao}</p>
                                    <p class="bi bi-geo-fill"> ${usuario.estado}</p>
                                    <p><strong>Disponibilidade:</strong> ${usuario.disponibilidade}</p>
                                    <p><strong>Avaliação:</strong> ${usuario.avaliacao} <i class="fa-solid fa-star"></i></p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            }
            return '';
        }).join('');

        userList.innerHTML = user_list;
    } catch (error) {
        console.error('Erro ao exibir usuários:', error);
    }
}

async function getLoggedInUser() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao obter dados do usuário logado.');
        }
        const usuarios = await response.json();
        const loggedInUserId = localStorage.getItem('loggedInUserId');

        const usuarioLogado = usuarios.find(usuario => usuario.id === loggedInUserId);
        if (!usuarioLogado) {
            throw new Error('Usuário logado não encontrado.');
        }

        return usuarioLogado.id;
    } catch (error) {
        console.error('Erro ao obter usuário logado:', error);
        throw error;
    }
}

window.addEventListener("scroll", function () {
    let header = document.querySelector('#header');
    header.classList.toggle('rolagem', window.scrollY > 0);
});
