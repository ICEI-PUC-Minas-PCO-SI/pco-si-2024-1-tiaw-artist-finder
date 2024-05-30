// Descer o site ativa a navbar 
window.addEventListener("scroll", function () {
    let header = document.querySelector('#header');
    header.classList.toggle('rolagem', window.scrollY > 0);
});

// URL DA FAKE API DE DADOS USANDO JSON
const URL = 'http://localhost:3000/usuarios';

const userList = document.getElementById('user-list');
const mostrarUser = document.getElementById('tela');

let FILTRO_ATUACAO = "";
let FILTRO_ESTADO = "";
let FILTRO_DISPONIBILIDADE = "";

// Função onde o evento de opção selecionada no HTML compara com os usuários no JSON server
function exibeUsuarios() {
    fetch(URL)
        .then(res => res.json())
        .then(usuariosData => {
            let lista_usuarios = '';
            for (let i = 0; i < usuariosData.length; i++) {
                let usuario = usuariosData[i];
                if (((usuario.disponibilidade === FILTRO_DISPONIBILIDADE) || (FILTRO_DISPONIBILIDADE === "")) &&
                    ((usuario.atuacao === FILTRO_ATUACAO) || (FILTRO_ATUACAO === "")) &&
                    ((usuario.estado === FILTRO_ESTADO) || (FILTRO_ESTADO === ""))) {
                    
                    lista_usuarios += `
                    <div class="col-md-4 mb-5">
                        <a href="exibe_user.html?id=${usuario.id}">
                            <div class="card">
                                <div class="img1"><img src="${usuario.capa}" alt=""></div>
                                <div class="img2"><img src="${usuario.foto}" alt=""></div>
                                <div class="main-text">
                                    <h2>${usuario.nome}</h2>
                                    <p><strong>Área de atuação:</strong> ${usuario.atuacao}</p>
                                    <p class="bi bi-geo-fill"> ${usuario.estado}</p>
                                    <p><strong>Disponibilidade:</strong> ${usuario.disponibilidade}</p>
                                </div>
                                <div class="socials">
                                    <i class="bi bi-facebook"></i>
                                    <i class="bi bi-linkedin"></i>
                                    <i class="bi bi-whatsapp"></i>
                                    <i class="bi bi-instagram"></i>
                                </div>
                            </div>
                        </a>
                    </div>`;
                }
            }
            userList.innerHTML = lista_usuarios;
        });
}

function exibeUser(id) {
    fetch(URL)
        .then(res => res.json())
        .then(usuariosData => {
            let user = usuariosData.find(usuario => usuario.id == id);
            
            if (user) {
                let listar_usuarios = `
                <div class="main">
                    <div class="header_wrapper">
                        <header class="capa" id="capa"></header>
                        <div class="cols_container">
                            <div class="left_col">
                                <div class="img_container">
                                    <img src="${user.foto}" alt="">
                                    <span></span>
                                </div>
                                <h2>${user.nome}</h2>
                                <p>${user.atuacao}</p>
                                <p>${user.disponibilidade}</p>
                                <p class="bi bi-geo-fill">${user.estado}</p>
                                <p>${user.email}</p>
        
                                <ul class="about">
                                    <li><span>4,000</span>Followers</li>
                                    <li><span>333</span>Following</li>
                                    <li><span>200,300</span>Attractions</li>
                                </ul>
        
                                <div class="content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, soluta, totam dolor aliquam placeat vel, facere possimus officia voluptates nam ut dolores est dolore sed dicta tenetur reiciendis aliquid eius.</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, soluta, totam dolor aliquam placeat vel, facere possimus officia voluptates nam ut dolores est dolore sed dicta tenetur reiciendis aliquid eius.</p>
        
                                    <ul>
                                        <li><i class="fab fa-twitter"></i></li>
                                        <li><i class="fab fa-instagram"></i></li>
                                        <li><i class="fab fa-facebook"></i></li>
                                        <li><i class="fab fa-dribbble"></i></li>
                                    </ul>
                                </div>
                            </div>
        
                            <div class="right_col">
                                <nav>
                                    <ul>
                                        <li><a href="#">Galeria</a></li>
                                        <li><a href="#">Grupos</a></li>
                                        <li><a href="#">Sobre</a></li>
                                    </ul>
                                    <button>Follow</button>
                                </nav>
                                <div class="photos">
                                    <img src="${user.capa}" alt="Photo">
                                    <img src="${user.capa}" alt="Photo">
                                    <img src="${user.capa}" alt="Photo">
                                    <img src="${user.capa}" alt="Photo">
                                    <img src="${user.capa}" alt="Photo">
                                    <img src="${user.capa}" alt="Photo">
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>
                        .main .header_wrapper header {
                            width: 100%;
                            background: url(${user.capa}) no-repeat 50% 20% / cover;
                            min-height: calc(100px + 15vw);
                        }
                    </style>
                </div>`;
                mostrarUser.innerHTML = listar_usuarios;
            } else {
                listar_usuarios = `<h1>Usuario não encontrado</h1>`;
            }
            
        });
}