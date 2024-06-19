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

// Função para obter o próximo ID único
async function getNextUserId() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários.');
        }
        const usuarios = await response.json();
        if (usuarios.length === 0) {
            return "1";
        }

        return (parseInt(usuarios[usuarios.length - 1].id) + 1).toString();
        
    } catch (error) {
        console.error('Erro ao obter o próximo ID:', error);
        throw error;
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

// Função para cadastro de novo usuário
async function signUp() {
    let formSignUp = document.getElementById('signUpForm');
    if (!formSignUp) {
        console.error("Elemento de formulário de cadastro não encontrado.");
        return;
    }

    formSignUp.addEventListener("submit", async (e) => {
        e.preventDefault();

        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let confirmEmail = document.getElementById("confirmEmail").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        if (email !== confirmEmail) {
            alert("Os emails não coincidem. Por favor, verifique.");
            return;
        }

        let password = document.getElementById("password").value;
        let confirmPass = document.getElementById("confirmPassword").value;

        if (password !== confirmPass) {
            alert("A senha e o confirmar senha não coincidem. Por favor, verifique.");
            return;
        }

        if (usuarios.some(user => user.email === email)) {
            alert("Este email já está cadastrado. Por favor, escolha outro.");
            return;
        }

        let userId;
        try {
            userId = await getNextUserId();
        } catch (error) {
            console.error('Erro ao obter o próximo ID:', error);
            alert("Erro ao obter o próximo ID. Por favor, tente novamente mais tarde.");
            return;
        }

        try {

            const response = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    username: username,
                    email: email,
                    password: password,
                    loggedIn: false
                }),
            });
            if (!response.ok) {
                throw new Error('Erro ao criar a conta.');
            }
            window.location.href = "login.html";

            await loadUsuarios();
            console.log('Conta criada com sucesso!');
            alert("Conta criada com sucesso!");
        } catch (error) {
            console.error('Erro ao criar a conta:', error);
            alert("Erro ao criar a conta. Por favor, tente novamente mais tarde.");
        }
    });
}

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