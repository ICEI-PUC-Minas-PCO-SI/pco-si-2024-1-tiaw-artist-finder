
/*INICIO DA NAVBAR========================================================*/

// Descer o site ativa a navbar 
window.addEventListener("scroll", function () {
    let header = document.querySelector('#header');
    header.classList.toggle('rolagem', window.scrollY > 0);
});
/*FIM DA NAVBAR ==========================================================*/

// URL DA FAKE API DE DADOS USANDO JSON
const URL = 'http://localhost:3000/usuarios';

// Pegando os elementos do html atraves de seu id e colocando dentro de uma variavel para trabalhar no JS
const userList = document.getElementById('user-list');
const mostrarUser = document.getElementById('tela');
const searchBar = document.getElementById('searchBar');

/* Barra de pesquisa ---------------------------------------------------------------------------- */

//Definindo um array vazil para os usuarios
let afUsers = [];

let FILTRO_ATUACAO = "";
let FILTRO_ESTADO = "";
let FILTRO_DISPONIBILIDADE = "";

//Defininco o metodo de input capturado na searchbar e usando o includes para pegar o "valor" digitado e criar um novo array chamado filtred users
//apenas com o array dos usuarios que tem o "valor" digitado na search bar no nome.

const loadUsers = async () => {
    try {
        const res = await fetch(URL);
        afUsers = await res.json();
        displayUsers(afUsers);
    } catch (err) {
        console.error(err);
    }
};

//Usando função map para passar por todos usuarios do json array e imprimir os mesmos no html

// Ajuste de lógica para exibir foto do usuário no local storage, se houver.
const displayUsers = (users) => {
    const userList = document.getElementById('user-list');
    const user_list = users
        .map((usuario) => {
            let userPhoto = usuario.foto;
            if (!userPhoto) {
                const userPicData = JSON.parse(localStorage.getItem('userPicData'));
                if (userPicData && userPicData[usuario.id]) {
                    userPhoto = userPicData[usuario.id];
                } else {
                    userPhoto = 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
                }
            }

            return `
                <div class="col-md-4 mb-5">
                    <a href="exibe_user.html?id=${usuario.id}">
                        <div class="card">
                            <div class="img1"><img src="${usuario.capa}" alt=""></div>
                            <div class="img2"><img src="${userPhoto}" alt=""></div>
                            <div class="main-text">
                                <h2>${usuario.nome}</h2>
                                <p><strong>Área de atuação:</strong> ${usuario.atuacao}</p>
                                <p class="bi bi-geo-fill"> ${usuario.estado}</p>
                                <p><strong>Disponibilidade:</strong> ${usuario.disponibilidade}</p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        })
        .join('');
    
    userList.innerHTML = user_list;
};


loadUsers();

/* Fim da Barra de pesquisa ---------------------------------------------------------------------------- */
let db = null;
try {
    db = JSON.parse(localStorage.getItem('dbUsers'))
}
catch (e) {
    console.log(e);
    db = null;
}

if (!db) {
    fetch(URL)
        .then(res => res.json())
        .then(usuariosData => {
            localStorage.setItem('dbUsers', JSON.stringify(usuariosData));
        })
}

function exibeUsuarios() {
    fetch(URL)
        .then(res => res.json())
        .then(usuariosData => {
            let lista_usuarios = '';
            for (let i = 0; i < usuariosData.length; i++) {
                let usuario = usuariosData[i];
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
                    const userPicData = JSON.parse(localStorage.getItem('userPicData')) || {};
                    if (userPicData[usuario.id]) {
                        userFotoPerfil = userPicData[usuario.id];
                    }
                }

                if (!userFotoPerfil) {
                    userFotoPerfil = 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
                }

                lista_usuarios += `
                    <div class="col-md-4 mb-5">
                        <a href="exibe_user.html?id=${usuario.id}">
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
                    </div>`;
            }
            const userList = document.getElementById('user-list');
            userList.innerHTML = lista_usuarios;
        });
}


/*------------------------------------------------------------------------------------------------------------------------------------------*/

// Funções que alteram a imagem no local storage a partir do perfil selicionado
function alterarImagem(id, imageURI) {
    let userIndex = db.findIndex(usuario => usuario.id == id);
    if (userIndex != -1) {
        db[userIndex].galeria1 = imageURI;
        localStorage.setItem('dbUsers', JSON.stringify(db));
    }
}

function alterarImagem2(id, imageURI) {
    let userIndex = db.findIndex(usuario => usuario.id == id);
    if (userIndex != -1) {
        db[userIndex].galeria2 = imageURI;
        localStorage.setItem('dbUsers', JSON.stringify(db));
    }
}

function alterarImagem3(id, imageURI) {
    let userIndex = db.findIndex(usuario => usuario.id == id);
    if (userIndex != -1) {
        db[userIndex].galeria3 = imageURI;
        localStorage.setItem('dbUsers', JSON.stringify(db));
    }
}




