//navbar menu

window.addEventListener("scroll", function(){
    let header = document.querySelector('#header')
    header.classList.toggle('rolagem',window.scrollY > 0)
    
})



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
                lista_usuarios += `<div class=" col-md-4 mb-5"> 
                <div class="card">
                    <div class="img1"> <img src="${usuarios.capa}" alt=""> </div>
                    <div class="img2"> <img src="${usuarios.foto}" alt=""> </div>
                    <div class="main-text">
                        <h2>${usuarios.nome}</h2>
                        <p><strong> Área de atuação: </strong> ${usuarios.atuacao}</p>
                        <p class="bi bi-geo-fill"> ${usuarios.estado}</p>
                        <p><strong> Disponibilidade: </strong>  ${usuarios.disponibilidade}</p>
                    </div>
                    <div class="socials">
                        <i class="bi bi-facebook"></i>
                        <i class="bi bi-linkedin"></i>
                        <i class="bi bi-whatsapp"></i>
                        <i class="bi bi-instagram"></i>
                    </div>

                </div>

            </div> `;
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