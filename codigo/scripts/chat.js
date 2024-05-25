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

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para exibir usuários na sidebar
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
        contactsContainer.innerHTML = '';

        const loggedInUser = await getLoggedInUser();

        const usuarios = data.filter(user => !user.loggedIn);
        const sortedUsuarios = usuarios.sort((a, b) => {
            const aMessages = JSON.parse(localStorage.getItem(a.nome)) || [];
            const bMessages = JSON.parse(localStorage.getItem(b.nome)) || [];

            const aHasUnreadMessages = aMessages.some(m => m.recipient === loggedInUser.nome && !m.read);
            const bHasUnreadMessages = bMessages.some(m => m.recipient === loggedInUser.nome && !m.read);

            if (aHasUnreadMessages && !bHasUnreadMessages) return -1;
            if (!aHasUnreadMessages && bHasUnreadMessages) return 1;

            const aLastMessage = aMessages[aMessages.length - 1];
            const bLastMessage = bMessages[bMessages.length - 1];

            if (aLastMessage && bLastMessage) {
                return new Date(bLastMessage.timestamp) - new Date(aLastMessage.timestamp);
            }
            return 0;
        });

        sortedUsuarios.forEach(usuario => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('chat-sidebar-user');
            userDiv.innerHTML = `
                <img src="${usuario.foto}" alt="${usuario.nome}" class="chat-sidebar-user-photo">
                <span class="chat-sidebar-user-name">${usuario.nome}</span>
                <i class="fas fa-circle new-message-indicator"></i>
            `;
            contactsContainer.appendChild(userDiv);

            const userMessages = JSON.parse(localStorage.getItem(usuario.nome)) || [];
            const hasUnreadMessages = userMessages.some(m => m.sender === usuario.nome && !m.read);
            const newMessageIndicator = userDiv.querySelector('.new-message-indicator');
            
            // Verifica se há mensagens não lidas e atualiza a exibição da bolinha vermelha de notificação
            if (hasUnreadMessages) {
                newMessageIndicator.style.display = 'inline';
            } else {
                newMessageIndicator.style.display = 'none';
            }

            userDiv.addEventListener('click', () => {
                console.log("Usuário selecionado:", usuario.nome);
                console.log("Foto do usuário:", usuario.foto);
                showChatMainContent();
                updateChatHeader(usuario.nome, usuario.foto);

                displayMessages(usuario.nome);

                userMessages.forEach(m => {
                    if (m.sender === usuario.nome) {
                        m.read = true;
                    }
                });
                localStorage.setItem(usuario.nome, JSON.stringify(userMessages));
                newMessageIndicator.style.display = 'none';
            });
        });

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para atualizar o cabeçalho do chat
function updateChatHeader(nome, foto) {
    const chatUserPhoto = document.getElementById('chat-user-photo');
    const chatUserName = document.getElementById('chat-user-name');

    chatUserPhoto.src = foto;
    chatUserName.textContent = nome;
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para mostrar o chat principal e ocultar a mensagem inicial

function showChatMainContent() {
    const initialMessage = document.getElementById('initial-message');
    const chatMainContent = document.querySelector('.chat-main-content');

    initialMessage.style.display = 'none';
    chatMainContent.style.display = 'flex';
}

function showInitialMessage() {
    const initialMessage = document.getElementById('initial-message');
    const chatMainContent = document.querySelector('.chat-main-content');

    initialMessage.style.display = 'flex';
    chatMainContent.style.display = 'none';
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Evento de pressionar tecla
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        showInitialMessage();
    }
});

/*--------------------------------------------------------------------------------------------------------------------------*/

// Carregar os usuários ao carregar a página
window.addEventListener('load', fetchAndDisplayUsers);

/*--------------------------------------------------------------------------------------------------------------------------*/

// Funções para enviar uma mensagem
async function sendMessage() {

    const messageInput = document.getElementById('chat-message-input');
    const messageContent = messageInput.value.trim();

    if (messageContent === '') {
        alert('Por favor, digite uma mensagem.');
        return;
    }

    const loggedInUser = await getLoggedInUser();
    const recipientUser = document.getElementById('chat-user-name').textContent;

    if (!loggedInUser || !recipientUser || recipientUser === loggedInUser.nome) {
        alert('Erro ao identificar usuários.');
        return;
    }

    const message = {
        sender: loggedInUser.nome,
        recipient: recipientUser,
        content: messageContent,
        timestamp: new Date().toISOString(),
        read: false
    };

    let recipientMessages = JSON.parse(localStorage.getItem(recipientUser)) || [];
    recipientMessages.push(message);
    localStorage.setItem(recipientUser, JSON.stringify(recipientMessages));

    appendMessage(message, loggedInUser.nome);

    messageInput.value = '';

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetchAndDisplayUsers();
}


function appendMessage(message, currentUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    if (message.sender === currentUser) {
        messageElement.classList.add('me');
    } else {
        messageElement.classList.add('received');
    }

    messageElement.id = message.timestamp;

    messageElement.textContent = message.content;

    const chatMessages = document.getElementById('chat-messages');

    if (!document.getElementById(message.timestamp)) {
        chatMessages.appendChild(messageElement);
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para exibir uma mensagem

async function displayMessages(selectedUser) {

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
        alert('Erro ao identificar usuário logado.');
        return;
    }

    const loggedInUserMessages = JSON.parse(localStorage.getItem(loggedInUser.nome)) || [];
    const selectedUserMessages = JSON.parse(localStorage.getItem(selectedUser)) || [];

    const allMessages = loggedInUserMessages.concat(selectedUserMessages).filter(message =>
        (message.sender === loggedInUser.nome && message.recipient === selectedUser) ||
        (message.sender === selectedUser && message.recipient === loggedInUser.nome)
    );

    allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    allMessages.forEach(message => {
        appendMessage(message, loggedInUser.nome);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const sendButton = document.getElementById('chat-send-button');
sendButton.addEventListener('click', sendMessage);

const messageInput = document.getElementById('chat-message-input');
messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função alterna barra lateral e conteúdo principal do chat.

function setupMobileChatInteraction() {
    const chatSidebar = document.querySelector('.chat-sidebar');
    const chatMainContent = document.querySelector('.chat-main-content');
    const chatSidebarUsers = document.querySelectorAll('.chat-sidebar-user');

    // Função para esconder a sidebar e exibir o conteúdo principal do chat
    function showSelectedChatContent() {
        chatSidebar.style.display = 'none';
        chatMainContent.style.display = 'block';
    }

    // Função para exibir a sidebar e ocultar o conteúdo principal do chat
    function showChatSidebar() {
        chatSidebar.style.display = 'block';
        chatMainContent.style.display = 'none';
    }

    // Adiciona um event listener para cada usuário na sidebar
    chatSidebarUsers.forEach(user => {
        user.addEventListener('click', () => {
            // Verifica se a largura da tela é igual ou inferior a 663px
            if (window.innerWidth <= 663) {
                showSelectedChatContent();
            }
        });
    });

    // Adiciona um event listener para o pressionar da tecla "Escape"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Verifica se a largura da tela é igual ou inferior a 663px
            if (window.innerWidth <= 663) {
                showChatSidebar();
            }
        }
    });
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Chama a função para configurar a interação do chat em dispositivos móveis
setupMobileChatInteraction();

/*--------------------------------------------------------------------------------------------------------------------------*/
