document.addEventListener('DOMContentLoaded', (event) => {
    init();
});

const URL = 'https://api-artistfinder-tiaw.onrender.com/usuarios';
const userList = document.getElementById('user-list');
const searchBar = document.getElementById('searchBar');
let afUsers = [];

let FILTRO_ATUACAO = "";
let FILTRO_ESTADO = "";
let FILTRO_DISPONIBILIDADE = "";

function init() {
    const filtroAtuacao = document.querySelector('#filtroAtuacao');
    const filtroEstado = document.querySelector('#filtroEstado');
    const filtroDisponibilidade = document.querySelector('#filtroDisponibilidade');
    const limparButton = document.querySelector('#limpar');
    const searchBar = document.querySelector('#searchBar');

    if (filtroAtuacao) {
        filtroAtuacao.addEventListener('change', (e) => {
            FILTRO_ATUACAO = e.target.value;
            exibeUsuarios();
        });
    }

    if (filtroEstado) {
        filtroEstado.addEventListener('change', (e) => {
            FILTRO_ESTADO = e.target.value;
            exibeUsuarios();
        });
    }

    if (filtroDisponibilidade) {
        filtroDisponibilidade.addEventListener('change', (e) => {
            FILTRO_DISPONIBILIDADE = e.target.value;
            exibeUsuarios();
        });
    }

    if (limparButton) {
        limparButton.addEventListener('click', () => {
            FILTRO_ATUACAO = "";
            FILTRO_ESTADO = "";
            FILTRO_DISPONIBILIDADE = "";
            if (filtroAtuacao) filtroAtuacao.value = "";
            if (filtroEstado) filtroEstado.value = "";
            if (filtroDisponibilidade) filtroDisponibilidade.value = "";
            if (searchBar) searchBar.value = "";
            exibeUsuarios();
        });
    }

    if (searchBar) {
        searchBar.addEventListener("keyup", () => {
            exibeUsuarios();
        });
    }

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

function displayUsers(users) {
    try {
        const usuarioLogadoId = getLoggedInUserId();

        if (!userList) {
            console.error('Elemento userList não encontrado.');
            return;
        }

        const user_list = users.map((usuario) => {
            if (!usuarioLogadoId || usuario.id !== usuarioLogadoId) {
                let userCapa = '';
                let userFotoPerfil = '';

                const userCapaData = JSON.parse(localStorage.getItem('userCapaData')) || [];
                const userCapaItem = userCapaData.find(user => user.id === usuario.id.toString());
                const capaUrl = userCapaItem ? userCapaItem.capa : `https://picsum.photos/id/${usuario.id}/1600/900`;

                if (usuario.foto) {
                    userFotoPerfil = usuario.foto;
                } else {
                    const userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
                    const userIndex = userPicData.findIndex(user => user.id === usuario.id.toString());
                    if (userIndex !== -1) {
                        userFotoPerfil = userPicData[userIndex].foto;
                    } else {
                        userFotoPerfil = `https://robohash.org/${usuario.id}`;
                    }
                }

                const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
                const avaliacoesUsuario = avaliacoes.filter(avaliacao => avaliacao.idAvaliado === usuario.id.toString());
                const somaAvaliacoes = avaliacoesUsuario.reduce((acc, curr) => acc + curr.estrelas, 0);
                const mediaAvaliacoes = avaliacoesUsuario.length > 0 ? (somaAvaliacoes / avaliacoesUsuario.length).toFixed(1) : '5.0';

                return `
                    <div class="col-md-4 mb-5">
                        <a href="user.html?id=${usuario.id}">
                            <div class="card">
                                <div class="img1"><img src="${capaUrl}" alt="Capa do usuário ${usuario.nome}"></div>
                                <div class="img2"><img src="${userFotoPerfil}" alt="Foto de perfil do usuário ${usuario.nome}"></div>
                                <div class="main-text">
                                    <h2>${usuario.nome}</h2>
                                    <p><strong>Área de atuação:</strong> ${usuario.atuacao}</p>
                                    <p class="bi bi-geo-fill"> ${usuario.estado}</p>
                                    <p><strong>Disponibilidade:</strong> ${usuario.disponibilidade}</p>
                                    <p><strong>Avaliação:</strong> ${mediaAvaliacoes} <i class="fa-solid fa-star"></i></p>
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


function getLoggedInUserId() {
    try {
        const loggedInUserId = localStorage.getItem('loggedInUserId');

        if (!loggedInUserId) {
            return null;
        }

        return loggedInUserId;
    } catch (error) {
        console.error('Erro ao obter ID do usuário logado:', error);
        return null;
    }
}

async function getLoggedInUser() {
    try {
        const response = await fetch('https://api-artistfinder-tiaw.onrender.com/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao obter dados do usuário logado.');
        }
        const usuarios = await response.json();
        const loggedInUserId = localStorage.getItem('loggedInUserId');

        if (!loggedInUserId) {
            return null;
        }

        const usuarioLogado = usuarios.find(usuario => usuario.id === loggedInUserId);
        if (!usuarioLogado) {
            throw new Error('Usuário logado não encontrado.');
        }

        return usuarioLogado.id;
    } catch (error) {
        console.error('Erro ao obter usuário logado:', error);
        return null;
    }
} 


