const dbMock = {
    usuarios:[{
        id:0,
        nome: 'Felipe Andrade',
        idade: 22,
        pais: 'Brasil',
        estado: 'MG',
        cidade: 'Belo Horizonte',
        descricao: 'fotógrafo é aquele que faz o registro de momentos e eventos através de equipamentos fotográficos para contar histórias através de fotografias',
        idAreas: "Fotografo",
        disponibilidade: 'Freelance',
        imagem:'LUPA/filipe.jpg'

    }, {
        id:1,
        nome: 'Diego Chaves',
        idade: 25,
        pais: 'Brasil',
        estado: 'MG',
        cidade: 'Contagem',
        descricao: 'fotógrafo é aquele que faz o registro de momentos e eventos através de equipamentos fotográficos para contar histórias através de fotografias',
        idAreas: "Fotografo",
        disponibilidade: 'Freelance',
        imagem:'LUPA/diego.jpg'

    }, {
        id:2,
        nome: 'Alfredo Grulherme',
        idade: 35,
        pais: 'Brasil',
        estado: 'ES',
        cidade: 'Vila Velha',
        descricao: 'designers utilizam sua criatividade, habilidades técnicas e conhecimento sobre os princípios do design para desenvolver projetos que atendam às necessidades específicas de seus clientes ou usuários.',
        idAreas: "Designer",
        disponibilidade: 'Freelance',
        imagem:'LUPA/alfredo.jpg'
    },  {
        id:3,
        nome: 'Gabriel ',
        idade: 35,
        pais: 'Brasil',
        estado: 'ES',
        cidade: 'Vila Velha',
        descricao: 'fotógrafo é aquele que faz o registro de momentos e eventos através de equipamentos fotográficos para contar histórias através de fotografias',
        idAreas: "Fotografo",
        disponibilidade: 'Freelance',
        imagem:'LUPA/gabriel.jpg'
    }, {
        id:4,
        nome: 'Christian Sena',
        idade: 35,
        pais: 'Brasil',
        estado: 'ES',
        cidade: 'Vila Velha',
        descricao: 'Desenvolvedor de sites, chamado de profissional de Dev ou Web Developer, é o responsável por criar todo o planejamento estrutural de páginas, utilizando linguagens de programação como HTML, CSS, JavaScript, PHP, entre várias outras.',
        idAreas: "Desenvolvedor web",
        disponibilidade: 'Freelance',
        imagem:'LUPA/christian.jpg'
    },{
        id:5,
        nome: 'Lucas Bolsonaro',
        idade: 45,
        pais: 'Brasil',
        estado: 'SP',
        cidade: 'Vinhedo',
        descricao: 'Profissional responsável por criar imagens visuais que complementam, explicam, narram ou decoram um texto, conceito ou ideia.',
        idAreas: "Ilustrador",
        disponibilidade: 'Freelance',
        imagem:'LUPA/lucas.jpg'
    },{
        id:6,
        nome: 'Philipe',
        idade: 25,
        pais: 'Brasil',
        estado: 'MG',
        cidade: 'Belo Horizonte',
        descricao: 'O desenvolvedor web lida com a aparência de um site, bem como dos componentes técnicos e logísticos. Isso inclui medição do desempenho e da capacidade e persistência na criação e testes das aplicações assim que estiverem disponíveis.',
        idAreas: "Desenvolvedor web",
        disponibilidade: 'Freelance',
        imagem:'LUPA/philip.jpg'

    },{
        id:7,
        nome: 'Victor Bryann',
        idade: 20,
        pais: 'Brasil',
        estado: 'MG',
        cidade: 'Belo Horizonte',
        descricao: 'O profissional é responsável por dar forma aos aspectos visuais de sites, livros, revistas, embalagens de produtos, apresentações e muito mais. ',
        idAreas: "Designer",
        disponibilidade: 'Freelance',
        imagem:'LUPA/victor.jpg'

    },],
    areas:[
        {id: 0, area: 'Ilustrador'},
        {id: 1, area: 'Designer'},
        {id: 2, area: 'Fotografo'},
        {id: 3, area: 'Desenvolvedor web'},
        {id: 4, area: 'Fotografo'},
        {id: 5, area: 'Desenvolvedor web'},
        {id: 6, area: 'Desenvolvedor web'},
        {id: 7, area: 'Designer'}
    ]
}

function exibeUsuarios() {
    let str = ''; 
    for (let i = 0; i < dbMock.usuarios.length; i++) {
        let usuario = dbMock.usuarios[i];
        let likes = localStorage.getItem('likes_' + usuario.id) || 0;  

        str += `<div class="card" style="width: 18rem;">
        <img src="${usuario.imagem}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${usuario.nome}</h5>
          <h5 class="card-title">${usuario.idAreas}</h5>
          <p class="card-text">${usuario.descricao}</p>
          <button class="btn btn-primary like-btn" data-id="${usuario.id}">
          <i class="fas fa-thumbs-up"></i> Curtir
          </button>
          <span class="likes-count">${likes} Likes</span>
          <div class="btn-container">
    <a href="#" class="btn btn-primary btn-detalhes">Mais Detalhes</a>
</div>
        </div>
      </div>`;
    }
    document.querySelector('#tela').innerHTML = str;
}

var inputSearch = document.getElementById("usuario");
var btnSearch = document.getElementsByClassName("search-buton")[0];
btnSearch.addEventListener("click", event => {
    event.preventDefault();  
    let str = ''; 
    for (let i = 0; i < dbMock.usuarios.length; i++) {
        let usuario = dbMock.usuarios[i];
        
        if (usuario.nome.toLowerCase().includes(inputSearch.value.toLowerCase()) || usuario.idAreas.toLowerCase().includes(inputSearch.value.toLowerCase())) {
            let likes = localStorage.getItem('likes_' + usuario.id) || 0;  
            str += `<div class="card" style="width: 18rem;">
            <img src="${usuario.imagem}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${usuario.nome}</h5>
                <h5 class="card-title">${usuario.idAreas}</h5>
                <p class="card-text">${usuario.descricao}</p>
                <button class="btn btn-primary like-btn" data-id="${usuario.id}">
                  <i class="fas fa-thumbs-up"></i> Curtir
                </button>
                <span class="likes-count">${likes} Likes</span>
                <div class="btn-container">
            <a href="#" class="btn btn-primary btn-detalhes">Mais Detalhes</a>
</div>
            </div>
            </div>`;
        }
    }
    document.querySelector('#tela').innerHTML = str;
});

document.addEventListener('DOMContentLoaded', () => {
    exibeUsuarios();

    document.querySelector('#tela').addEventListener('click', function(event) {
        if (event.target.closest('.like-btn')) {
            const btn = event.target.closest('.like-btn');
            const userId = btn.dataset.id;
            const currentLikes = parseInt(localStorage.getItem('likes_' + userId) || 0);
            localStorage.setItem('likes_' + userId, currentLikes + 1);
            btn.nextElementSibling.textContent = `${currentLikes + 1} Likes`;  // Atualiza o texto de likes ao lado do botão
        }
    });
});
