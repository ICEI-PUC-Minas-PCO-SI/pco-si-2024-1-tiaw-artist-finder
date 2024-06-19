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

                window.location.href = "home.html";
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
    
    if (currentPage !== '/codigo/index.html' && currentPage !== '/codigo/login.html' && currentPage !== '/codigo/signup.html') {
        if (!isLoggedIn()) {
            alert(`Você precisa estar logado para acessar ${currentPage}.`);
            window.location.href = "login.html";
            return;
        }
    } else if (currentPage === '/codigo/login.html' || currentPage === '/codigo/signup.html') {
        if (!isLoggedIn()) {
            localStorage.removeItem('loggedInUserId');
        }
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            logout();
        });
    }

    login();
});
