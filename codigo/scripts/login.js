async function login() {
    let formLogin = document.getElementById('loginForm');

    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            try {
                const usuarios = await obterDadosUsuarios();

                const user = usuarios.find(user => user.email === email);
                if (!user) {
                    alert("Email não encontrado. Por favor, verifique o email.");
                    return;
                }

                if (user.password !== password) {
                    alert("Senha incorreta. Por favor, verifique a senha.");
                    return;
                }

                localStorage.setItem('loggedInUserId', user.id.toString());

                window.location.href = "index.html";
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert("Erro ao fazer login. Por favor, tente novamente mais tarde.");
            }
        });
    }
}

function logout() {
    localStorage.removeItem('loggedInUserId');
    window.location.href = "login.html";
}

function isLoggedIn() {
    return localStorage.getItem('loggedInUserId') !== null;
}

async function obterDadosUsuarios() {
    try {
        const response = await fetch('https://api-newusers-tiaw.vercel.app/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        throw error;
    }
}

async function updateProfilePicture() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        try {
            const response = await fetch('https://api-newusers-tiaw.vercel.app/usuarios');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do usuário.');
            }

            const data = await response.json();
            const user = data.find(user => user.id === loggedInUserId);
            if (user) {
                const userPhoto = document.getElementById('navbar-user-photo');
                const subMenuPhoto = document.querySelector('.sub-menu .user-info img');
                const subMenuName = document.querySelector('.sub-menu .user-info h2');

                if (user.foto) {
                    userPhoto.src = user.foto;
                    subMenuPhoto.src = user.foto;
                } else {
                    let userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
                    const userIndex = userPicData.findIndex(u => u.id === loggedInUserId);
                    if (userIndex !== -1) {
                        userPhoto.src = userPicData[userIndex].foto;
                        subMenuPhoto.src = userPicData[userIndex].foto;
                    } else {
                        console.warn('Foto de perfil não encontrada no localStorage.');
                    }
                }

                subMenuName.textContent = user.nome;
            } else {
                console.warn('Usuário não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    } else {
        console.warn('Nenhum usuário logado.');
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname;
    const navbar = document.getElementById('navbar');

    if (currentPage === '/codigo/index.html' && navbar) {
        if (!isLoggedIn()) {
            const navbarNav = navbar.querySelector('.navbar-collapse .navbar-nav');
            if (navbarNav) {
                const navbarItemsToHide = navbarNav.querySelectorAll('.nav-item:nth-child(2), .nav-item:nth-child(3), .nav-item:nth-child(4), .nav-item:nth-child(5), .nav-item:nth-child(6), .nav-item:nth-child(7)');
                navbarItemsToHide.forEach(item => {
                    item.style.display = 'none';
                });

                const loginNavItem = createNavItem('Login', 'login.html');
                const signupNavItem = createNavItem('Cadastro', 'signup.html');
                navbarNav.appendChild(loginNavItem);
                navbarNav.appendChild(signupNavItem);
            }
        }
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            logout();
        });
    }

    await login();
    await updateProfilePicture();
});

function createNavItem(text, href) {
    const navItem = document.createElement('li');
    navItem.classList.add('nav-item', 'me-3');
    navItem.innerHTML = `
        <a class="nav-link" href="${href}">${text}</a>
    `;
    const div = document.getElementById('screenWelcome');
    div.innerHTML = `
        <h1>Querido usuário, bem vindo ao Artist Finder! Confira nossos artistas e logue para ter mais opções!</h1>
    `;
    return navItem;
}

function ToggleMenu() {
    const subMenu = document.getElementById('subMenu');
    subMenu.classList.toggle('open-menu');
}

function adjustMenu() {
    const screenWidth = window.innerWidth;
    const navMenu = document.querySelector('.navbar-nav');
    const subMenuItems = document.querySelectorAll('.sub-menu-link');
    const userPhoto = document.getElementById('navbar-user-photo');
    const subMenu = document.getElementById('subMenu');

    const extraNavItems = document.querySelectorAll('.extra-nav-item');
    extraNavItems.forEach(item => item.remove());

    if (screenWidth <= 991) {
        subMenuItems.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('nav-item', 'extra-nav-item');
            li.innerHTML = `<a class="nav-link" href="${item.getAttribute('href')}">${item.querySelector('p').textContent}</a>`;
            navMenu.appendChild(li);
        });

        if (userPhoto) {
            userPhoto.style.display = 'none';
        }
        subMenu.classList.remove('open-menu');
    } else {
        if (userPhoto) {
            userPhoto.style.display = 'block';
        }

        // Remover itens extras apenas se eles estiverem presentes
        subMenuItems.forEach(item => {
            const existingNavLink = navMenu.querySelector(`a[href="${item.getAttribute('href')}"]`);
            if (existingNavLink && existingNavLink.parentElement.classList.contains('extra-nav-item')) {
                existingNavLink.parentElement.remove();
            }
        });
    }
}

window.addEventListener('resize', adjustMenu);
window.addEventListener('DOMContentLoaded', adjustMenu);


