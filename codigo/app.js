
// Dados dentro do meu Json
const dbMock = {
    //Dados de perfil do usuario
    usuarios: [{

        id: 1,
        nome: "Pablo Marques",
        idade: 22,
        foto: "assets/img/perfil.jpg",
        estado: "SP",
        instituicao: "PUC MINAS",
        redesSociais: [
            {
                Instagram: "",
                Linkedin: ""
            }
        ],
        disponibilidade: "Freelance",
        idAtuacao: 4
    },
    {
        id: 2,
        nome: "Jorge Alves",
        idade: 29,
        foto: "assets/img/perfil.jpg",
        estado: "SP",
        instituicao: null,
        redesSociais: [
            {
                Instagram: "",
                Linkedin: ""
            }
        ],
        disponibilidade: "Todas"
        ,
        idAtuacao: 3
    },
    {
        id: 3,
        nome: "Francisco Xavier",
        idade: 31,
        foto: "assets/img/perfil.jpg",
        estado: "MG",
        instituicao: "UFRJ",
        redesSociais: [
            {
                Instagram: "",
                Linkedin: ""
            }
        ],
        disponibilidade: "Integral"
        ,
        idAtuacao: 1
    },
    {
        id: 4,
        nome: "André Schmidt",
        idade: 27,
        foto: "assets/img/perfil.jpg",
        estado: "RJ",
        instituicao: null,
        redesSociais: [
            {
                Instagram: "",
                Linkedin: ""
            }
        ],
        disponibilidade: "Todas"

        ,
        idAtuacao: 4
    }],
    // Dados de onde meu usuario atua.
    atuacao: [
        {
            id: 1,
            descricao: "Ilustrador"
        },
        {
            id: 2,
            descricao: "Filmmaker",
        },
        {
            id: 3,
            descricao: "Fotografo"
        },
        {
            id: 4,
            descricao: "Web Design"
        }
    ]
}

// Definindo uma variavel que recebe 0 caso nao tenha nenhum filtro selecionado
let FILTRO_ATUACAO = 0
let FILTRO_ESTADO = 0

//Pesquisando onde meu usuario atua dependendo do id fornecido. 
function getDescricaoAtuacao(id) {
    let idx = dbMock.atuacao.findIndex(elem => elem.id == id)
    if (idx != -1)
        return dbMock.atuacao[idx].descricao
    else
        return 'Não identificado'
}

//Função que exibe os cards dos usuarios
function exibeUsers() {
    let str = ''
    for (let i = 0; i < dbMock.usuarios.length; i++) {
        let user = dbMock.usuarios[i]
        /* se o filtro de atuacao estiver selicionado 0 (ou seja a opcao filtro) vai imprimir todos os usuarios, caso ela n esteja selicionada criei uma condição para que o if
        veja o id que esta selicionado e mostre somente os usuarios que façam parte daquele id de atuação*/
        if (((FILTRO_ATUACAO == 0) || user.idAtuacao == FILTRO_ATUACAO) &&
            (FILTRO_ESTADO == "") || user.estado == FILTRO_ESTADO) {
            str += `<div class="card col-md-2 mb-4 me-4 " >
        <img src="${user.foto}" class="card-img-top"  id="foto">
        <div class="card-body" >
          <h5 class="card-title">${user.nome}</h5>
          <p class="card-text text-secondary ">${getDescricaoAtuacao(user.idAtuacao)}</p>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill  " viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>
          <p class="card-text text-secondary   ">${user.estado}</p>
          
          
                    <div class="d-grid gap-2 d-md-block pt-5">
            <button class="btn btn-primary" type="button">Perfil</button>
            <button class="btn btn-dark"  type="button">Contratar</button>
            </div>
        </div>
      </div>`
        }

        


    }
    document.querySelector('#tela').innerHTML = str



}

// quando minha pagina estiver 100% carregada essa função vai exibir puxar do meu html os nomes do dropdown e definir para o FILTRO_ATUACAO onde foi selicionado e qual id de atuação devera ser mostrado.
document.body.onload = () => {

    let filtroAtuacao = document.querySelector('#filtroAtuacao')
    filtroAtuacao.addEventListener('change', () => {
        FILTRO_ATUACAO = filtroAtuacao.value
        exibeUsers();
    })
    let filtroEstado = document.querySelector('#filtroEstado')
    filtroEstado.addEventListener('change', () => {
        FILTRO_ESTADO = filtroEstado.value
        exibeUsers();
    })

    exibeUsers();

}