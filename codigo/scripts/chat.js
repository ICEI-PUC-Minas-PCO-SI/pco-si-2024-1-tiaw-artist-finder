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
        contactsContainer.innerHTML = ''; // Clear existing contacts

        const usuarios = data.filter(user => !user.loggedIn);
        usuarios.forEach(usuario => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('chat-sidebar-user');
            userDiv.innerHTML = `
                <img src="${usuario.foto}" alt="${usuario.nome}" class="chat-sidebar-user-photo">
                <span class="chat-sidebar-user-name">${usuario.nome}</span>
            `;
            contactsContainer.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

window.addEventListener('load', fetchAndDisplayUsers);

document.addEventListener("DOMContentLoaded", function() {
    const userDivs = document.querySelectorAll('.chat-sidebar-user');

    userDivs.forEach(userDiv => {
        userDiv.addEventListener('click', function() {
            updateChatHeader(userDiv);
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    addEventListenersToUserDivs();
});

function addEventListenersToUserDivs() {
    const userDivs = document.querySelectorAll('.chat-sidebar-user');

    userDivs.forEach(userDiv => {
        userDiv.addEventListener('click', function() {
            updateChatHeader(userDiv);
        });
    });
}

function updateChatHeader(selectedUser) {
    const userNameElementInUser = selectedUser.querySelector('.chat-sidebar-user-name');
    const userPhotoElementInUser = selectedUser.querySelector('.chat-sidebar-user-photo');

    if (!userNameElementInUser || !userPhotoElementInUser) {
        console.error("Erro: Elementos do usuário selecionado não encontrados.");
        return;
    }

    const userName = userNameElementInUser.textContent;
    const userPhoto = userPhotoElementInUser.src;

    if (!userName || !userPhoto) {
        console.error("Erro: Dados do usuário não encontrados.");
        return;
    }

    const userNameElement = document.getElementById('chat-user-name');
    const userPhotoElement = document.getElementById('chat-user-photo');

    if (!userNameElement || !userPhotoElement) {
        console.error("Erro: Elementos do cabeçalho do chat não encontrados.");
        return;
    }

    userNameElement.textContent = userName;
    userPhotoElement.src = userPhoto;

    console.log("Nome do usuário selecionado:", userName);
    console.log("Caminho da foto do usuário selecionado:", userPhoto);
}




