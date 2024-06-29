const URL = "https://api-artistfinder-tiaw.onrender.com/usuarios";

function getLoggedInUserId() {
    const userId = localStorage.getItem('loggedInUserId');
    return userId ? userId : null;
}

async function getLoggedInUser() {
    const loggedInUserId = getLoggedInUserId();
    if (!loggedInUserId) return null;
    try {
        const response = await fetch(`${URL}/${loggedInUserId}`);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }
        const loggedInUser = await response.json();
        return loggedInUser;
    } catch (error) {
        console.error('Erro ao buscar usuário logado:', error);
        return null;
    }
}

async function fetchAndDisplayUsers(filter = '') {
    const loggedInUserId = getLoggedInUserId();
    if (!loggedInUserId) {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.innerHTML = `
            <h2>Você precisa estar logado para visualizar o chat!</h2>
            <a href="./login.html">
                <button class="edit-button">Ir para Login</button>
            </a>
            <style>
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    justify-content: center;
                    align-items: center;
                }
            </style>
        `;
        return;
    }

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }
        const data = await response.json();

        if (!data || !Array.isArray(data)) {
            throw new Error('Data is undefined or not an array.');
        }

        const contactsContainer = document.getElementById('chat-contacts');
        contactsContainer.innerHTML = '';

        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            throw new Error('Erro ao identificar usuário logado.');
        }

        const sortedUsuarios = data.filter(user => user.id !== loggedInUser.id);
        const filteredUsuarios = sortedUsuarios.filter(user => 
            user.nome.toLowerCase().includes(filter.toLowerCase())
        );

        filteredUsuarios.forEach(usuario => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('chat-sidebar-user');

            let userFotoPerfil = usuario.foto || '';

            if (!userFotoPerfil) {
                const userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
                const storedUser = userPicData.find(u => u.id === usuario.id);
                if (storedUser && storedUser.foto) {
                    userFotoPerfil = storedUser.foto;
                    console.log(`Foto base64 recuperada do localStorage para ${usuario.nome}:`, userFotoPerfil);
                } else {
                    userFotoPerfil = 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
                }
            }

            userDiv.innerHTML = `
                <img src="${userFotoPerfil}" alt="${usuario.nome}" class="chat-sidebar-user-photo">
                <span class="chat-sidebar-user-name">${usuario.nome}</span>
                <i class="fas fa-circle new-message-indicator"></i>
            `;
            contactsContainer.appendChild(userDiv);

            const userMessages = JSON.parse(localStorage.getItem(usuario.nome)) || [];
            const newMessageIndicator = userDiv.querySelector('.new-message-indicator');

            const hasUnreadMessages = userMessages.some(m => m.sender === usuario.nome && !m.read);
            newMessageIndicator.style.marginLeft = '0.2rem';
            if (hasUnreadMessages) {
                newMessageIndicator.style.color = 'red';
                newMessageIndicator.style.display = 'inline';
            } else {
                newMessageIndicator.style.display = 'none';
            }

            userDiv.addEventListener('click', async () => {
                showChatMainContent();

                try {
                    const clickedUser = await getUserById(usuario.id);
                    if (clickedUser) {
                        let clickedUserFoto = clickedUser.foto || '';

                        if (!clickedUserFoto) {
                            const userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
                            const storedUser = userPicData.find(u => u.id === clickedUser.id);
                            if (storedUser && storedUser.foto) {
                                clickedUserFoto = storedUser.foto;
                                console.log(`Foto base64 recuperada do localStorage para ${clickedUser.nome}:`, clickedUserFoto);
                            } else {
                                clickedUserFoto = 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
                            }
                        }

                        updateChatHeader(clickedUser.nome, clickedUserFoto);
                        displayMessages(clickedUser.nome);
                    }

                    userMessages.forEach(m => {
                        if (m.sender === usuario.nome) {
                            m.read = true;
                        }
                    });
                    localStorage.setItem(usuario.nome, JSON.stringify(userMessages));
                    newMessageIndicator.style.display = 'none';

                } catch (error) {
                    console.error('Erro ao carregar informações do usuário:', error);
                }
            });
        });

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

async function getUserById(userId) {
    try {
        const response = await fetch(`${URL}/${userId}`);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
        return null;
    }
}

function updateChatHeader(nome, foto) {
    const chatUserPhoto = document.getElementById('chat-user-photo');
    const chatUserName = document.getElementById('chat-user-name');

    chatUserPhoto.src = foto;
    chatUserName.textContent = nome;
}

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

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        showInitialMessage();
    }
});

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

    let senderMessages = JSON.parse(localStorage.getItem(loggedInUser.nome)) || [];
    senderMessages.push(message);
    localStorage.setItem(loggedInUser.nome, JSON.stringify(senderMessages));

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

function setupMobileChatInteraction() {
    const chatSidebar = document.querySelector('.chat-sidebar');
    const chatMainContent = document.querySelector('.chat-main-content');
    const chatSidebarUsers = document.querySelectorAll('.chat-sidebar-user');

    function showSelectedChatContent() {
        chatSidebar.style.display = 'none';
        chatMainContent.style.display = 'block';
    }

    function showChatSidebar() {
        chatSidebar.style.display = 'block';
        chatMainContent.style.display = 'none';
    }

    chatSidebarUsers.forEach(user => {
        user.addEventListener('click', () => {
            if (window.innerWidth <= 663) {
                showSelectedChatContent();
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (window.innerWidth <= 663) {
                showChatSidebar();
            }
        }
    });
}

setupMobileChatInteraction();

window.addEventListener('load', () => fetchAndDisplayUsers());

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', () => {
    const filter = searchBar.value;
    fetchAndDisplayUsers(filter);
});

