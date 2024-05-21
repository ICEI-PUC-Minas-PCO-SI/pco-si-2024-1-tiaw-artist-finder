const URL = "http://localhost:3000/usuarios";

async function fetchAndDisplayUsers() {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }
        const data = await response.json();
        console.log("Data fetched from API:", data);

        if (!data || !Array.isArray(data)) {
            throw new Error('Data or data.usuarios is undefined.');
        }

        const contactsContainer = document.getElementById('chat-contacts');
        contactsContainer.innerHTML = ''; // Limpa os contatos existentes

        const usuarios = data.filter(user => !user.loggedIn);
        usuarios.forEach(usuario => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('chat-sidebar-user');
            userDiv.innerHTML = `
                <img src="${usuario.foto}" alt="${usuario.nome}" class="chat-sidebar-user-photo">
                <span class="chat-sidebar-user-name">${usuario.nome}</span>
            `;
            contactsContainer.appendChild(userDiv);

            userDiv.addEventListener('click', () => {
                console.log("Usuário selecionado:", usuario.nome);
                console.log("Foto do usuário:", usuario.foto);
                updateChatHeader(usuario.nome, usuario.foto);
                // Atualiza o chat com as mensagens do usuário selecionado
                displayMessages(usuario.nome);
            });
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

function updateChatHeader(nome, foto) {
    const chatUserPhoto = document.getElementById('chat-user-photo');
    const chatUserName = document.getElementById('chat-user-name');

    chatUserPhoto.src = foto;
    chatUserName.textContent = nome;
}

window.addEventListener('load', fetchAndDisplayUsers);

// Função para enviar uma mensagem
function sendMessage() {
    // Obter o conteúdo da mensagem do input
    const messageInput = document.getElementById('chat-message-input');
    const messageContent = messageInput.value.trim();

    // Verificar se a mensagem não está vazia
    if (messageContent === '') {
        alert('Por favor, digite uma mensagem.');
        return;
    }

    // Obter o usuário atual
    const currentUser = document.getElementById('chat-user-name').textContent;

    // Criar um objeto com os dados da mensagem
    const message = {
        content: messageContent,
        timestamp: new Date().toISOString()
    };

    // Armazenar a mensagem no localStorage associado ao usuário
    let userMessages = JSON.parse(localStorage.getItem(currentUser)) || [];
    userMessages.push(message);
    localStorage.setItem(currentUser, JSON.stringify(userMessages));

    // Adicionar a nova mensagem à div #chat-messages
    appendMessage(message);

    // Limpar o input de mensagem após o envio
    messageInput.value = '';

    // Rolagem automática para a última mensagem
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para adicionar uma mensagem à div #chat-messages
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'me');
    messageElement.textContent = message.content;

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(messageElement);
}

// Função para exibir as mensagens do usuário atual
function displayMessages(userName) {
    // Limpa as mensagens anteriores
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    // Obtém as mensagens associadas ao usuário do localStorage
    const userMessages = JSON.parse(localStorage.getItem(userName)) || [];

    // Exibe cada mensagem no chat
    userMessages.forEach(message => {
        appendMessage(message);
    });

    // Rolagem automática para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Carregar as mensagens do usuário atual ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = document.getElementById('chat-user-name').textContent;
    displayMessages(currentUser);
});

// Adicionar evento de clique ao botão de enviar
const sendButton = document.getElementById('chat-send-button');
sendButton.addEventListener('click', sendMessage);

// Permitir o envio de mensagem ao pressionar Enter
const messageInput = document.getElementById('chat-message-input');
messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});
