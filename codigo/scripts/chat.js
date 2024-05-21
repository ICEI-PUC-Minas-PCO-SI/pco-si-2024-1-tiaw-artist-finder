const URL = "http://localhost:3000/usuarios";

// Função para obter o usuário logado
async function getLoggedInUser() {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }
        const data = await response.json();
        const loggedInUser = data.find(user => user.loggedIn);
        return loggedInUser;
    } catch (error) {
        console.error('Erro ao buscar usuário logado:', error);
    }
}

// Função para exibir usuários na sidebar
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

        // Atualiza o header com o usuário logado
        const loggedInUser = data.find(user => user.loggedIn);
        if (loggedInUser) {
            updateChatHeader(loggedInUser.nome, loggedInUser.foto);
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// Função para atualizar o cabeçalho do chat
function updateChatHeader(nome, foto) {
    const chatUserPhoto = document.getElementById('chat-user-photo');
    const chatUserName = document.getElementById('chat-user-name');

    chatUserPhoto.src = foto;
    chatUserName.textContent = nome;
}

// Carregar os usuários ao carregar a página
window.addEventListener('load', fetchAndDisplayUsers);

// Função para enviar uma mensagem
async function sendMessage() {
    // Obter o conteúdo da mensagem do input
    const messageInput = document.getElementById('chat-message-input');
    const messageContent = messageInput.value.trim();

    // Verificar se a mensagem não está vazia
    if (messageContent === '') {
        alert('Por favor, digite uma mensagem.');
        return;
    }

    // Obter o usuário logado e o destinatário da mensagem
    const loggedInUser = await getLoggedInUser();
    const recipientUser = document.getElementById('chat-user-name').textContent;

    if (!loggedInUser || !recipientUser) {
        alert('Erro ao identificar usuários.');
        return;
    }

    // Criar um objeto com os dados da mensagem
    const message = {
        sender: loggedInUser.nome,
        recipient: recipientUser,
        content: messageContent,
        timestamp: new Date().toISOString()
    };

    // Armazenar a mensagem no localStorage associado ao destinatário
    let recipientMessages = JSON.parse(localStorage.getItem(recipientUser)) || [];
    recipientMessages.push(message);
    localStorage.setItem(recipientUser, JSON.stringify(recipientMessages));

    // Adicionar a nova mensagem à div #chat-messages
    appendMessage(message, loggedInUser.nome);

    // Limpar o input de mensagem após o envio
    messageInput.value = '';

    // Rolagem automática para a última mensagem
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para adicionar uma mensagem à div #chat-messages
function appendMessage(message, currentUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    // Verifica se a mensagem foi enviada pelo usuário atual
    if (message.sender === currentUser) {
        messageElement.classList.add('me');
    } else {
        messageElement.classList.add('received');
    }

    messageElement.textContent = message.content;
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(messageElement);
}

// Função para exibir as mensagens do usuário atual
async function displayMessages(selectedUser) {
    // Limpa as mensagens anteriores
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    // Obtém o nome do usuário atualmente logado
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
        alert('Erro ao identificar usuário logado.');
        return;
    }

    // Obtém as mensagens associadas ao usuário do localStorage
    const allMessages = JSON.parse(localStorage.getItem(loggedInUser.nome)) || [];

    // Filtra as mensagens que são do usuário atual e do destinatário selecionado
    const userMessages = allMessages.filter(message =>
        (message.sender === loggedInUser.nome && message.recipient === selectedUser) ||
        (message.sender === selectedUser && message.recipient === loggedInUser.nome)
    );

    // Exibe cada mensagem no chat
    userMessages.forEach(message => {
        appendMessage(message, loggedInUser.nome);
    });

    // Rolagem automática para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Carregar as mensagens do usuário atual ao carregar a página
document.addEventListener('DOMContentLoaded', async function() {
    const loggedInUser = await getLoggedInUser();
    if (loggedInUser) {
        displayMessages(loggedInUser.nome);
    }
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
