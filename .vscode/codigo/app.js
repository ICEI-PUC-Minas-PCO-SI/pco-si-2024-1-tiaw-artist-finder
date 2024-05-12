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
    }],
    areas:[
        {id: 0, area: 'Ilustrador'},
        {id: 1, area: 'Designer'},
        {id: 2, area: 'Fotografo'},
        {id: 3, area: 'Desenvolvedor web'},
        {id: 4, area: 'Fotografo'},
        {id: 5, area: 'Desenvolvedor web'}
    ]
}

function exibeUsuarios(){
    let str = ''; 
    for (let i = 0; i<dbMock.usuarios.length; i++){
        let usuarios = dbMock.usuarios[i]
        
        
        str = str + `<div class="card" style="width: 18rem;">
        <img src="${usuarios.imagem}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${usuarios.nome}</h5>
          <p class="card-text">${usuarios.descricao}</p>
          <a href="#" class="btn btn-primary">Mais Detalhes</a>
        </div>
      </div>`
    }
    document.querySelector('#tela').innerHTML = str
}

var inputSearch = document.getElementById("usuario");
var btnSearch = document.getElementsByClassName("search-buton")[0];
btnSearch.addEventListener("click", event => {
    let str = ''; 
    for (let i = 0; i<dbMock.usuarios.length; i++){
        let usuarios = dbMock.usuarios[i]
        
        if(usuarios.nome.toLowerCase().includes(inputSearch.value.toLowerCase()) || usuarios.idAreas.toLowerCase().includes(inputSearch.value.toLowerCase())) {
            console.log(usuarios.nome);
            str = str + `<div class="card" style="width: 18rem;">
            <img src="${usuarios.imagem}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${usuarios.nome}</h5>
                <p class="card-text">${usuarios.descricao}</p>
                <a href="#" class="btn btn-primary">Mais Detalhes</a>
            </div>
            </div>`
        }
        // dbMock.areas[dbMock.usuarios[i].idAreas].area;
        // let areaUsuario;
        // for (let j = 0; j < dbMock.areas.length; j++) {
        //     let element = dbMock.areas[j];
        //     let elementId = element.id;
        //     if(elementId == usuarios.idAreas) {
        //         areaUsuario = dbMock.areas[j].area;
        //     }
        // }
        // console.log(areaUsuario);
        // if(areaUsuario.toLowerCase().includes(inputSearch.value.toLowerCase())) {
        //     console.log(usuarios.areas);
        //     str = str + `<div class="card" style="width: 18rem;">
        //     <img src="${usuarios.imagem}" class="card-img-top" alt="...">
        //     <div class="card-body">
        //         <h5 class="card-title">${usuarios.areas}</h5>
        //         <p class="card-text">${usuarios.descricao}</p>
        //         <a href="#" class="btn btn-primary">Mais Detalhes</a>
        //     </div>
        //     </div>`
        // }
        
        
        
    }
    document.querySelector('#tela').innerHTML = str;
});


document.body.onload = () => {
        exibeUsuarios();
}