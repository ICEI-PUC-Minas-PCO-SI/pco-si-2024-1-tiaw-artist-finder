
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

                localStorage.setItem('loggedInUserId', user.id);

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
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname;
    const navbar = document.getElementById('navbar');
    const navbarNav = navbar.querySelector('.navbar-collapse .navbar-nav');

    if (!isLoggedIn()) {
        if (currentPage !== '/codigo/login.html' && currentPage !== '/codigo/signup.html') {
            const navbarItemsToHide = navbarNav.querySelectorAll('.nav-item:nth-child(2), .nav-item:nth-child(3), .nav-item:nth-child(4), .nav-item:nth-child(5), .nav-item:nth-child(6), .nav-item:nth-child(7)');
            navbarItemsToHide.forEach(item => {
                item.style.display = 'none';
            });

            const loginNavItem = createNavItem('Login', 'login.html');
            const signupNavItem = createNavItem('Cadastro', 'signup.html');
            navbarNav.appendChild(loginNavItem);
            navbarNav.appendChild(signupNavItem);
            
            return;
        }
    } else {
        if (currentPage === '/codigo/login.html' || currentPage === '/codigo/signup.html') {
            localStorage.removeItem('loggedInUserId');
            window.location.href = "login.html";
        } else {
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener("click", () => {
                    logout();
                });
            }
        }
    }

    login();
});

function createNavItem(text, href) {
    const navItem = document.createElement('li');
    navItem.classList.add('nav-item', 'me-3');
    navItem.innerHTML = `
        <a class="nav-link" href="${href}">${text}</a>
    `;
    return navItem;
}