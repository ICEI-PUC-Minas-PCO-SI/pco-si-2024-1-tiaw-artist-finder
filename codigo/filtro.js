//URL DA FAKE API DE DADOS USANDO JSON
URL = 'http://localhost:3000/usuarios'

const userList = document.getElementById('user-list');

let FILTRO_ATUACAO = ""
let FILTRO_ESTADO = ""
let FILTRO_DISPONIBILIDADE = ""

function exibeUsuarios (){
fetch(URL)
    .then(res => res.json())
    .then(usuariosData => {
       
        let lista_usuarios = '';
        for(let i = 0; i < usuariosData.length; i++){
            let usuarios = usuariosData[i];
            if (((usuarios.disponibilidade == FILTRO_DISPONIBILIDADE) || (FILTRO_DISPONIBILIDADE == "")) &&
            ((usuarios.atuacao == FILTRO_ATUACAO) || (FILTRO_ATUACAO == "")) &&
            ((usuarios.estado == FILTRO_ESTADO) || (FILTRO_ESTADO == "")))
            {
                lista_usuarios += `<div class="card col-md-2 mb-4 me-4">
                <img src="${usuarios.foto}" class="card-img-top" id="foto">
                <div class="card-body">
                  <h5 class="card-title">${usuarios.nome}</h5>
                  <p class="card-text text-secondary"><strong>Área de atuação: </strong> <br> ${usuarios.atuacao}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg>
                  <p class="card-text text-secondary">${usuarios.estado}</p>
                  <p class="card-text text-secondary"><strong>Disponibilidade: </strong>${usuarios.disponibilidade}</p>
                  <div class="row">
                    <button class="btn btn-primary mb-2" type="button">Perfil</button>
                    <button class="btn btn-dark" type="button">Contratar</button>
                  </div>
                </div>
              </div>
                    `;
                    userList.innerHTML = lista_usuarios;
                    
            }

        }
        
        
    })
}

document.body.onload = () => {

    let filtroAtuacao = document.querySelector('#filtroAtuacao')
    filtroAtuacao.addEventListener('change', () => {
        FILTRO_ATUACAO = filtroAtuacao.value
        exibeUsuarios();
    })
    let filtroEstado = document.querySelector('#filtroEstado')
    filtroEstado.addEventListener('change', () => {
        FILTRO_ESTADO = filtroEstado.value
        exibeUsuarios();
    })
    let filtroDisponibilidade = document.querySelector('#filtroDisponibilidade')
    filtroDisponibilidade.addEventListener('change', () => {
        FILTRO_DISPONIBILIDADE = filtroDisponibilidade.value
        exibeUsuarios();
    })
    let limpar = document.querySelector('#limpar')
    limpar.addEventListener('click', () => {
        FILTRO_DISPONIBILIDADE = ""
        filtroDisponibilidade.value = ""
        FILTRO_ESTADO = ""
        filtroEstado.value = ""
        FILTRO_ATUACAO = ""
        filtroAtuacao.value = ""
        exibeUsuarios();
    })

    exibeUsuarios();

}