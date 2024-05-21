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
                <button id="sidebar-contact-btn" class="sidebar-contact-btn"><i class="fas fa-arrow-right"></i></button>
            `;
            contactsContainer.appendChild(userDiv);

            const sidebarContactBtn = userDiv.querySelector('.sidebar-contact-btn');
            sidebarContactBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                console.log("Usuário selecionado:", usuario.nome);
                console.log("Foto do usuário:", usuario.foto);
                // Aqui você pode adicionar a lógica para atualizar o chat header com os dados do usuário selecionado
            });
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

window.addEventListener('load', fetchAndDisplayUsers);
