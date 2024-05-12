// Função para fechar o modal
function fecharModal() {
    try {
        var modal = document.getElementById('myModal');
        if (!modal) {
            throw new Error('Elemento modal não encontrado.');
        }
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        // Remove o fundo escuro
        var overlay = document.querySelector('.modal-backdrop');
        if (!overlay) {
            throw new Error('Elemento overlay não encontrado.');
        }
        overlay.parentNode.removeChild(overlay);
    } catch (error) {
        console.error('Erro ao fechar modal:', error);
    }
}

// Adiciona event listener para fechar o modal ao clicar no botão de fechar do modal
var fecharBtns = document.querySelectorAll('[data-dismiss="modal"]');
if (fecharBtns) {
    fecharBtns.forEach(function (btn) {
        btn.addEventListener('click', fecharModal);
    });
} else {
    console.error('Botão de fechar modal não encontrado.');
}

// Função para abrir o modal
function abrirModal() {
    try {
        var modal = document.getElementById('myModal');
        if (!modal) {
            throw new Error('Elemento modal não encontrado.');
        }

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
        // Adiciona um fundo escuro com opacidade ao fundo da página
        var overlay = document.createElement('div');
        overlay.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(overlay);

        // Recuperar os dados do usuário com o ID fornecido
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
                document.getElementById('username').value = data.nome_usuario;
                document.getElementById('cidade').value = data.cidade;
                document.getElementById('estado').value = data.estado;
            })
            .catch(error => {
                console.error('Erro ao recuperar dados do usuário:', error);
            });
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

// Adiciona event listener para abrir o modal ao clicar no botão de abrir
var abrirBtn = document.querySelector('.edit-btn');
if (abrirBtn) {
    abrirBtn.addEventListener('click', abrirModal);
} else {
    console.error('Botão de abrir modal não encontrado.');
}

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

const modalSalvar = document.getElementById('btnSalvar');

modalSalvar.addEventListener('click', function() {
    const dadosAtualizados = {
        nome: document.getElementById('nome').value,
        nome_usuario: document.getElementById('username').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };
    
    // Obter o ID do usuário do elemento HTML
    var userIdElement = document.getElementById('user-id');
    if (!userIdElement) {
        console.error('Elemento user-id não encontrado.');
        return;
    }
    var userId = parseInt(userIdElement.textContent);

    atualizarUsuario(userId, dadosAtualizados)
        .then(() => {
            // Não fechar o modal imediatamente após a atualização
            atualizarPerfilVisual(dadosAtualizados); // Atualiza os dados exibidos na página
        })
        .catch(error => {
            console.error('Erro ao salvar alterações:', error);
            // Aqui você pode adicionar tratamento adicional, como exibir uma mensagem de erro para o usuário
        });
});

function atualizarPerfilVisual(dadosAtualizados) {
    // Atualiza os elementos na página com os dados atualizados
    document.getElementById('name').textContent = dadosAtualizados.nome;
    document.getElementById('username').textContent = dadosAtualizados.nome_usuario;
    document.getElementById('city').textContent = dadosAtualizados.cidade;
    document.getElementById('state').textContent = dadosAtualizados.estado;
}
