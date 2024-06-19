/*--------------------------------------------------------------------------------------------------------------------------*/

let usuarios = [];

// Função para carregar os usuários do DB JSON
async function loadUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários.');
        }
        usuarios = await response.json();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para revelar a senha quando o usuário clica no ícone
document.addEventListener("click", (e) => {
    try {
        if (e.target.classList.contains('toggle-password')) {
            const passwordFields = document.querySelectorAll('input[type="password"], input[type="text"]');
            passwordFields.forEach(field => {
                if (field.type === 'password') {
                    field.type = 'text';
                } else {
                    field.type = 'password';
                }
            });
        }
    } catch (error) {
        console.error('Erro ao revelar senha:', error.message);
    }
});

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para login do usuário
async function login() {
    let formLogin = document.getElementById('loginForm');

    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            const user = usuarios.find(user => user.email === email);
            if (!user) {
                console.error("Email não encontrado. Por favor, verifique o email.");
                alert("Email não encontrado. Por favor, verifique o email.");
                return;
            }

            if (user.password !== password) {
                console.error("Senha incorreta. Por favor, verifique a senha.");
                alert("Senha incorreta. Por favor, verifique a senha.");
                return;
            }

            user.loggedIn = true;

            const response = await fetch(`http://localhost:3000/usuarios/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                console.error('Erro ao atualizar usuário.');
                alert('Erro ao atualizar usuário.');
                return;
            }

            window.location.href = "home.html";
        });
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para logout do usuário
async function logout() {
    try {

        const loggedInUser = usuarios.find(user => user.loggedIn === true);
        if (!loggedInUser) {
            throw new Error('Nenhum usuário logado.');
        }


        loggedInUser.loggedIn = false;


        const response = await fetch(`http://localhost:3000/usuarios/${loggedInUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loggedInUser),
        });

        if (!response.ok) {
            throw new Error('Erro ao deslogar usuário.');
        }


        window.location.href = "login.html";
    } catch (error) {
        console.error('Erro ao fazer logout:', error);

        alert("Erro ao fazer logout. Por favor, tente novamente mais tarde.");
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Adiciona um evento de clique no botão de logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        await logout();
    });
}

/*--------------------------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", async () => {
    await loadUsuarios(); // Carrega os usuários do DB JSON antes de iniciar as funções


    if (window.location.pathname === '/signup.html') {
        signUp();
    }

    login();
});

/*--------------------------------------------------------------------------------------------------------------------------*/