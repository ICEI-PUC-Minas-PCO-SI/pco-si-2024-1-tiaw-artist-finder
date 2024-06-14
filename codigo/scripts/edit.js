// Função para recuperar os dados do usuário do banco de dados e adicionar ao HTML
function carregarDadosUsuario() {
    fetch('http://localhost:3000/usuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao recuperar dados do usuário');
            }
            return response.json();
        })
        .then(usuarios => {
            const usuario = usuarios[0]; // Supondo que há apenas um usuário no banco de dados
            atualizarPerfilVisual(usuario); // Atualiza os elementos HTML com os dados do usuário
        })
        .catch(error => {
            console.error('Erro ao carregar dados do usuário:', error);
        });
}

// Função para atualizar os elementos na página com os dados do usuário
function atualizarPerfilVisual(usuario) {
    // Atualiza os elementos na página com os dados do usuário
    document.getElementById('name').textContent = usuario.nome;
    document.getElementById('display-username').textContent = usuario.username;
    document.getElementById('city').textContent = usuario.instituicao;
    document.getElementById('state').textContent = usuario.estado;

    // Preencher a foto de perfil
    if (usuario.foto) {
        document.getElementById('profile_pic').src = usuario.foto;
    } else {
        // Se não houver foto de perfil, exibir uma imagem padrão ou deixar em branco
        document.getElementById('profile_pic').src = "./assets/img/default_profile_pic.jpg";
    }
}

// Chamar a função para carregar os dados do usuário assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarDadosUsuario);

// Função para abrir o modal e carregar os dados do usuário

function abrirModal() {
    try {
        var modal = document.getElementById('myModal');
        if (!modal) {
            throw new Error('Elemento modal não encontrado.');
        }

        // Limpar os valores dos campos do formulário para evitar a exibição de dados antigos
        document.getElementById('id').value = ''; 
        document.getElementById('nome').value = '';
        document.getElementById('username').value = '';
        document.getElementById('instituicao').value = '';
        document.getElementById('estado').value = '';

        // Obter o ID do usuário do elemento HTML
        var userIdElement = document.getElementById('user-id');
        if (!userIdElement) {
            throw new Error('Elemento user-id não encontrado.');
        }
        var userId = parseInt(userIdElement.textContent);

        // Exibir o modal
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Verificar se a div overlay já existe
        var overlay = document.querySelector('.modal-backdrop');
        if (!overlay) {
            // Se não existir, cria uma nova
            overlay = document.createElement('div');
            overlay.classList.add('modal-backdrop', 'fade', 'show');
            document.body.appendChild(overlay);
        }

        // Recuperar os dados do usuário com o ID fornecido e preencher o formulário
        fetch(`http://localhost:3000/usuarios/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao recuperar dados do usuário');
                }
                return response.json();
            })
            .then(data => {
                // Preencher os campos do formulário com os dados do usuário
                document.getElementById('id').value = userId; // Define o ID travado no campo de ID
                document.getElementById('nome').value = data.nome;
                document.getElementById('username').value = data.username;
                document.getElementById('instituicao').value = data.instituicao;
                document.getElementById('estado').value = data.estado;
            })
            .catch(error => {
                console.error('Erro ao recuperar dados do usuário:', error);
            });
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

// Função para fechar o modal
var fecharbtn = document.getElementById('fecharmodal');

function fecharModal(event){
    try {
        var modal = document.getElementById('myModal');
        if (!modal) {
            throw new Error('Elemento modal não encontrado.');
        }
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');

        // Remove a classe modal-backdrop fade show
        var overlay = document.querySelector('.modal-backdrop');
        if (overlay) {
            overlay.remove(); // Remove a div existente se houver uma
        } else {
            console.warn('Elemento overlay não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao fechar modal:', error);
    }
};
fecharbtn.addEventListener('click', fecharModal);

// Função para atualizar os dados do usuário no banco de dados JSON
function atualizarUsuario(id, dadosAtualizados) {
    return fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar dados do usuário');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados do usuário atualizados com sucesso:', data);
        return data;
    })
    .catch(error => {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error; // Rejeita a promessa com o erro para que possa ser tratado externamente
    });
}

// Função para atualizar os dados do perfil do usuário
function atualizarPerfil() {
    try {
        const dadosAtualizados = {
            nome: document.getElementById('nome').value,
            username: document.getElementById('username').value,
            instituicao: document.getElementById('instituicao').value,
            estado: document.getElementById('estado').value,
            foto: document.getElementById('foto').src // Caminho da foto de perfil
        };

        // Obter o ID do usuário do elemento HTML
        var userIdElement = document.getElementById('user-id');
        if (!userIdElement) {
            throw new Error('Elemento user-id não encontrado.');
        }
        var userId = parseInt(userIdElement.textContent);

        // Atualizar os dados do usuário no banco de dados JSON
        atualizarUsuario(userId, dadosAtualizados)
            .then(() => {
                // Atualizar os dados do usuário no HTML após o salvamento bem-sucedido
                fetch(`http://localhost:3000/usuarios/${userId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao recuperar dados atualizados do usuário');
                        }
                        return response.json();
                    })
                    .then(updatedData => {
                        atualizarPerfilVisual(updatedData); // Atualiza os dados exibidos na página
                    })
                    .catch(error => {
                        console.error('Erro ao recuperar dados atualizados do usuário:', error);
                        // Exibir mensagem de erro ao usuário
                        alert('Erro ao atualizar perfil. Por favor, tente novamente mais tarde.');
                    });

                // Fechar o modal após o salvamento bem-sucedido
                fecharModal();
            })
            .catch(error => {
                console.error('Erro ao salvar alterações:', error);
                // Exibir mensagem de erro ao usuário
                alert('Erro ao atualizar perfil. Por favor, tente novamente mais tarde.');
            });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        // Exibir mensagem de erro ao usuário
        alert('Erro ao atualizar perfil. Por favor, tente novamente mais tarde.');
    }
}

// Adiciona event listener para abrir o modal ao clicar no botão de abrir
var abrirBtn = document.querySelector('.edit-btn');
if (abrirBtn) {
    abrirBtn.addEventListener('click', abrirModal);
} else {
    console.error('Botão de abrir modal não encontrado.');
}

// Adiciona event listener para salvar as alterações no perfil do usuário
const modalSalvar = document.getElementById('btnSalvar');
if (modalSalvar) {
    modalSalvar.addEventListener('click', atualizarPerfil);
} else {
    console.error('Botão de salvar não encontrado.');
}
