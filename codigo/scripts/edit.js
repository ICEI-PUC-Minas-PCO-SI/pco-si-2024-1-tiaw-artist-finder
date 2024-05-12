//URL da API de dados
URL = 'http://localhost:3000/usuarios'
//
// GET - Recupera todos os dados sobre o usuário e adiciona na tabela

const profileinfo = document.getElementById('profile-edit');


fetch(URL)
    .then(res => res.json())
    .then(info => {
        let infoprofile = '';
        for (let i = 0; i < info.length; i++) {
            infoprofile += `
            <div class="profile-edit">
                <img src="./assets/img/Djamila-Ribeiro.png" alt="Djamila Ribeiro">
                <p class="edit-btn" data-bs-target="#usuario-modal" data-bs-toggle="modal">Editar</p>
                <p class="profile-name">${info[i].nome}</p>
                <p class="p-simple-info"">${info[i].login}</p>
                <p class="p-simple-info">${info[i].cidade}</p>
                <p class="p-simple-info">${info[i].estado}</p>
                
             
            </div>
            `;
            profileinfo.innerHTML = infoprofile;
            
        }
    });
const contactinfos = document.getElementById('contact-infos');


fetch(URL)
    .then(res => res.json())
    .then(infocon => {
        let infocontact = '';
        for (let i = 0; i < infocon.length; i++) {
            infocontact += `
            <div class="contact-infos">
            <p class="edit-btn" data-bs-target="#contact-info" data-bs-toggle="modal">Editar</p>
            <p class="p-simple-info">Informações de Contato:</p>
            <p class="p-contact-info">Número de Telefone:</p>
            <p class="p-contact-info">${infocon[i].telefone}</p>
            <p class="p-contact-info">E-mail:</p>
            <p class="p-contact-info">${infocon[i].email}</p> 
            </div>
            `;
            contactinfos.innerHTML = infocontact;
            
        }
    });
const personalinfo = document.getElementById('personal-info');


fetch(URL)
    .then(res => res.json())
    .then(personal => {
        let infopersonal = '';
        for (let i = 0; i < personal.length; i++) {
            infopersonal += `
            <div class="personal-info">
                <p class="edit-btn" data-bs-target="#info-personal" data-bs-toggle="modal">Editar</p>
                <p class="p-simple-info">Informações Pessoais</p>
                <p class="p-simple-info">${personal[i].descricao}</p>
                <p class="p-simple-info">Idiomas</p>
                <p class="p-simple-info">${personal[i].idiomas}</p>
                <p class="p-simple-info">Habilidades</p>
                <p class="p-simple-info">${personal[i].habilidades}</p>
                <p class="p-simple-info">${personal[i].educacao}</p>
                      
            </div>
            `;
            personalinfo.innerHTML = infopersonal;
            
        }
    }); 
    // DELETE - Procedimento para excluir dados de algum
    const dadosDelete = document.getElementById('btn-delete');
    
    dadosDelete.addEventListener('click' , (e) => {

        let id = $('#id-dados').text();

        fetch(`${URL}/${id}` , {
            method: 'DELETE' ,
        })
        .then(res => res.json())
        .then(() => location.reload());
    })
// Procedimento para recuperar os dados de um card na API
        function getDados(id){

            if(id == 0){
                
                $( "#edit-profile" ).text("");
                $( "#nome-id" ).val("");
                $('#login-id').val("");
                $('#local-id').val("");
                $('#localE-id').val("");
            }else{
                $('#edit-profile').text(id);
                fetch(`${URL}/${id}`).then(res => res.json())    
                .then(data => {
                    $( "#nome-id" ).val(data.nome);
                    $('#login-id').val(data.login);
                    $('#local-id').val(data.local);
                    $('#localE-id').val(data.localE);
                });
                
            }    
        }
// Procedimento para criar ou editar o perfil de usuário
        const profileForm = document.getElementById('profile-form');

        profileForm.addEventListener('submit', (e) => {

    // RECUPERA O ID DO USUÁRIO
    let id = parseInt($('#edit-profile').text());    

    // RECUPERA OS DADOS DO PRODUTO
    const profileid = JSON.stringify({
        nome: document.getElementById('nome-id').value,
        login: document.getElementById('login-id').value,
        local: document.getElementById('local-id').value,
        localE: document.getElementById('localE-id').value
    })

    if (id >= 0) {
        fetch(`${URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: profileid
        })
        .then(res => res.json())
        .then(() => location.reload());  
    }
    else{ 
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: profileid
        })
        .then(res => res.json())
        .then(() => location.reload());  
    }      
})
//=================================================================================================
