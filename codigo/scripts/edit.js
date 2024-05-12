// URL da API de dados
const URL = 'http://localhost:3000/usuarios';

// Função para preencher os cards com os dados dos usuários, de contato e informações pessoais
function preencherCards() {
    fetch(URL)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao carregar dados dos usuários');
            }
            return res.json();
        })
        .then(data => {
            let profileHTML = '';
            let contactHTML = '';
            let personalHTML = '';
            data.forEach(usuario => {
                profileHTML += `
                    <div class="profile-edit">
                        <img src="./assets/img/Djamila-Ribeiro.png" alt="Djamila Ribeiro">
                        <p class="edit-btn" data-bs-target="#usuario-modal" data-bs-toggle="modal" data-nome="${usuario.nome}" data-login="${usuario.login}" data-local="${usuario.cidade}" data-localE="${usuario.estado}">Editar</p>
                        <p class="profile-name">${usuario.nome}</p>
                        <p class="p-simple-info">${usuario.login}</p>
                        <p class="p-simple-info">${usuario.cidade}</p>
                        <p class="p-simple-info">${usuario.estado}</p>
                    </div>
                `;

                contactHTML += `
                    <div class="contact-infos">
                        <p class="edit-btn" data-bs-target="#contact-info" data-bs-toggle="modal">Editar</p>
                        <p class="p-simple-info">Informações de Contato:</p>
                        <p class="p-contact-info">Número de Telefone: ${usuario.telefone}</p>
                        <p class="p-contact-info">E-mail: ${usuario.email}</p> 
                    </div>
                `;

                personalHTML += `
                    <div class="personal-info">
                        <p class="edit-btn" data-bs-target="#info-personal" data-bs-toggle="modal">Editar</p>
                        <p class="p-simple-info">Informações Pessoais</p>
                        <p class="p-simple-info">${usuario.descricao}</p>
                        <p class="p-simple-info">Idiomas: ${usuario.idiomas}</p>
                        <p class="p-simple-info">Habilidades: ${usuario.habilidades}</p>
                        <p class="p-simple-info">Educação: ${usuario.educacao}</p>
                    </div>
                `;
            });

            document.getElementById('profile-edit').innerHTML = profileHTML;
            document.getElementById('contact-infos').innerHTML = contactHTML;
            document.getElementById('personal-info').innerHTML = personalHTML;

            // Evento de clicar em "Editar" em um perfil
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const nome = button.dataset.nome;
                    const login = button.dataset.login;
                    const cidade = button.dataset.cidade;
                    const estado = button.dataset.estado;
                    console.log(cidade)
                    // Preencher o modal de edição com os dados atuais do usuário
                    document.getElementById('nome-id').value = nome;
                    document.getElementById('login-id').value = login;
                    document.getElementById('local').value = cidade;
                    document.getElementById('localE').value = estado;
                    console.log(nome.value)
                });
            });
        })
        .catch(error => {
            console.error('Erro ao preencher os cards:', error.message);
        });
}

// Chama a função para preencher os cards ao carregar a página
preencherCards();

// Função para atualizar os dados do usuário no servidor
function atualizarUsuario(nome, dados) {
    const usuario = {
        nome: nome,
        ...dados
    };

    return fetch(`${URL}/${nome}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    });
}

// Evento de envio do formulário de edição de perfil
const profileForm = document.getElementById('profile-form');

profileForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio do formulário por padrão

    // Obtém o nome de perfil
    const nome = document.getElementById('nome-id').value;

    // Verifica se o nome de perfil é válido
    if (nome.trim() === '') {
        console.error('Nome de perfil inválido');
        return;
    }

    // Obtém os dados do perfil do formulário
    const profileData = {
        login: document.getElementById('login-id').value,
        local: document.getElementById('local').value,
        localE: document.getElementById('localE').value
    };

    // Envia a requisição para atualizar os dados do usuário
    atualizarUsuario(nome, profileData)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao atualizar dados do usuário');
            }
            location.reload(); // Recarrega a página para atualizar os dados exibidos
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error.message);
        });
});
