// URL DA API FAKE CRIADA COM DADOS JSON
URL = 'http://localhost:3000/usuarios'

const dbMock = {
    "usuarios": [
        {
            "id": 1,
            "nome": "Ana Silva",
            "idade": 22,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": "PUC MINAS",
            "disponibilidade": "Freelance",
            "idAtuacao": 4
        },
        {
            "id": 2,
            "nome": "Jorge Alves",
            "idade": 29,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 3
            },
        {
            "id": 3,
            "nome": "Francisco Xavier",
            "idade": 31,
            "foto": "assets/img/perfil.jpg",
            "estado": "MG",
            "instituicao": "UFRJ",
            "disponibilidade": "Integral",
            "idAtuacao": 1
        },
        {
            "id": 4,
            "nome": "André Schmidt",
            "idade": 27,
            "foto": "assets/img/perfil.jpg",
            "estado": "RJ",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 42
        },
        {
            "id": 5,
            "nome": "Gabriel Oliveira",
            "idade": 33,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 10
          },
          {
            "id": 6,
            "nome": "Carla Santos",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "MG",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 8
          },
          {
            "id": 7,
            "nome": "Lucas Pereira",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 7
          },
          {
            "id": 8,
            "nome": "Marina Santos",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "RJ",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 8
          },
          {
            "id": 9,
            "nome": "Thiago Oliveira",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "RS",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 3
          },
          {
            "id": 10,
            "nome": "Amanda Costa",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "AM",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 5
          },
          {
            "id": 11,
            "nome": "Carla Santos",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "MT",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 9
          },
          {
            "id": 12,
            "nome": "Felipe Souza",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 10
          },
          {
            "id": 13,
            "nome": "Rafael Lima",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "RS",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 2
          },
          {
            "id": 14,
            "nome": "Camila Fernandes",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "PR",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 4
          },
          {
            "id": 15,
            "nome": "Gustavo Rodrigues",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 3
          },
          {
            "id": 16,
            "nome": "Mariana Almeida",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "SC",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 7
          },
          {
            "id": 17,
            "nome": "Bruno Oliveira",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "BA",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 6
          },
          {
            "id": 18,
            "nome": "Larissa Silva",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 6
          },
          {
            "id": 19,
            "nome": "Renato Santos",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "RJ",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 9
          },
          {
            "id": 20,
            "nome": "Isabela Costa",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "MG",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 8
          },
          {
            "id": 21,
            "nome": "Lucas Pereira",
            "idade": 28,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 3
          },
          {
            "id": 22,
            "nome": "Mariana Almeida",
            "idade": 33,
            "foto": "assets/img/perfil.jpg",
            "estado": "RJ",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 2
          },
          {
            "id": 23,
            "nome": "Thiago Oliveira",
            "idade": 26,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 4
          },
          {
            "id": 24,
            "nome": "Amanda Costa",
            "idade": 22,
            "foto": "assets/img/perfil.jpg",
            "estado": "MG",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 1
          },
          {
            "id": 25,
            "nome": "Pedro Almeida",
            "idade": 31,
            "foto": "assets/img/perfil.jpg",
            "estado": "RJ",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 10
          },
          {
            "id": 26,
            "nome": "Juliana Santos",
            "idade": 29,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 3
          },
          {
            "id": 27,
            "nome": "Felipe Souza",
            "idade": 34,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 7
          },
          {
            "id": 28,
            "nome": "Carolina Lima",
            "idade": 23,
            "foto": "assets/img/perfil.jpg",
            "estado": "SP",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 10
          },
          {
            "id": 29,
            "nome": "Bruno Oliveira",
            "idade": 27,
            "foto": "assets/img/perfil.jpg",
            "estado": "RJ",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 6
          },
          {
            "id": 30,
            "nome": "Camila Fernandes",
            "idade": 35,
            "foto": "assets/img/perfil.jpg",
            "estado": "MG",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 3
          },
          {
            "id": 31,
            "nome": "Gustavo Rodrigues",
            "idade": 30,
            "foto": "assets/img/perfil.jpg",
            "estado": "BA",
            "instituicao": null,
            "disponibilidade": "Integral",
            "idAtuacao": 8
          },
          {
            "id": 32,
            "nome": "Larissa Silva",
            "idade": 25,
            "foto": "assets/img/perfil.jpg",
            "estado": "PE",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 4
          },
          {
            "id": 33,
            "nome": "Renato Santos",
            "idade": 36,
            "foto": "assets/img/perfil.jpg",
            "estado": "CE",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 6
          },
          {
            "id": 34,
            "nome": "Isabela Costa",
            "idade": 28,
            "foto": "assets/img/perfil.jpg",
            "estado": "BA",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 2
          },
          {
            "id": 35,
            "nome": "Thiago Oliveira",
            "idade": 32,
            "foto": "assets/img/perfil.jpg",
            "estado": "PE",
            "instituicao": null,
            "disponibilidade": "Freelance",
            "idAtuacao": 1
          }
                    
          
    ],
    "atuacao": [
        {
            "id": 1,
            "descricao": "Ilustração"
        },
        {
            "id": 2,
            "descricao": "Filmagem"
        },
        {
            "id": 3,
            "descricao": "Fotografia"
        },
        {
            "id": 4,
            "descricao": "Web Design"
        },
        {
            "id": 5,
            "descricao": "Animação"
        },
        {
            "id": 6,
            "descricao": "Design Gráfico"
        },
        {
            "id": 7,
            "descricao": "Modelagem 3D"
        },
        {
            "id": 8,
            "descricao": "Grafite"
        },
        {
            "id": 9,
            "descricao": "Pintura"
        },
        {
            "id": 10,
            "descricao": "Edição"
        }
    ]
}


// Definindo uma variavel que recebe 0 caso nao tenha nenhum filtro selecionado

let FILTRO_ATUACAO = ""
let FILTRO_ESTADO = ""
let FILTRO_DISPONIBILIDADE = ""

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
        if ( ((user.disponibilidade == FILTRO_DISPONIBILIDADE) || (FILTRO_DISPONIBILIDADE == "")) &&
        ((user.idAtuacao == FILTRO_ATUACAO) || (FILTRO_ATUACAO == "")) &&
        ((user.estado == FILTRO_ESTADO) || (FILTRO_ESTADO == "")) ) {
            str += `<div class="card col-md-2   mb-4 me-4 " >
        <img src="${user.foto}" class="card-img-top"  id="foto">
        <div class="card-body" >
          <h5 class="card-title ">${user.nome}</h5>
          <p class="card-text text-secondary "><strong> Area de atuação: </strong> ${getDescricaoAtuacao(user.idAtuacao)}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill  " viewBox="0 0 16 16">
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
          </svg>
          <p class="card-text text-secondary ">${user.estado}</p>
          <p class="card-text text-secondary "><strong> Disponiblidade: </strong>${user.disponibilidade}</p>
          <div class=" row">
            <button class="btn btn-primary mb-2 " type="button">Perfil</button>
            <button class="btn btn-dark  "  type="button">Contratar</button>
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
    let filtroDisponibilidade = document.querySelector('#filtroDisponibilidade')
    filtroDisponibilidade.addEventListener('change', () => {
        FILTRO_DISPONIBILIDADE = filtroDisponibilidade.value
        exibeUsers();
    })
    let limpar = document.querySelector('#limpar')
    limpar.addEventListener('click', () => {
        FILTRO_DISPONIBILIDADE = ""
        filtroDisponibilidade.value = ""
        FILTRO_ESTADO = ""
        filtroEstado.value = ""
        FILTRO_ATUACAO = ""
        filtroAtuacao.value = ""
        exibeUsers();
    })

    exibeUsers();

}