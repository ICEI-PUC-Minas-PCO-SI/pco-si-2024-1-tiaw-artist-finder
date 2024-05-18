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

// Função para obter o próximo ID único
async function getNextUserId() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários.');
        }
        const usuarios = await response.json();
        if (usuarios.length === 0) {
            return "1"; // Se não houver usuários, retorna 1 como o próximo ID
        }

        return (parseInt(usuarios[usuarios.length - 1].id) + 1).toString(); // Obtém o ID do último usuário cadastrado e adiciona 1
    } catch (error) {
        console.error('Erro ao obter o próximo ID:', error);
        throw error;
    }
}

// Função para revelar a senha quando o usuário clica no ícone
document.addEventListener("click", (e) => {
    try {
        if (e.target.classList.contains('toggle-password')) {
            const passwordField = document.getElementById('password');
            const confirmPasswordField = document.getElementById('confirmPassword');

            if (!passwordField || !confirmPasswordField) {
                throw new Error('Campos de senha não encontrados.');
            }

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                confirmPasswordField.type = 'text';
            } else {
                passwordField.type = 'password';
                confirmPasswordField.type = 'password';
            }
        }
    } catch (error) {
        console.error('Erro ao revelar senha:', error.message);
    }
});

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

        // Verifica se o email e o confirmar email são iguais
        if (email !== confirmEmail) {
            alert("Os emails não coincidem. Por favor, verifique.");
            return;
        }

        let password = document.getElementById("password").value;
        let confirmPass = document.getElementById("confirmPassword").value;

        // Verifica se a senha e o confirmar senha são iguais
        if (password !== confirmPass) {
            alert("A senha e o confirmar senha não coincidem. Por favor, verifique.");
            return;
        }

        // Verifica se o email já está cadastrado
        if (usuarios.some(user => user.email === email)) {
            alert("Este email já está cadastrado. Por favor, escolha outro.");
            return;
        }

        let userId;
        try {
            userId = await getNextUserId(); // Obtem o próximo ID único
        } catch (error) {
            console.error('Erro ao obter o próximo ID:', error);
            alert("Erro ao obter o próximo ID. Por favor, tente novamente mais tarde.");
            return;
        }

        try {
            // Salva os dados no DB JSON usando fetch API
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
                    loggedIn: false // Define o atributo para indicar se o usuário está logado
                }),
            });
            if (!response.ok) {
                throw new Error('Erro ao criar a conta.');
            }
            window.location.href = "login.html";
            // Atualiza a lista de usuários após o cadastro bem-sucedido
            await loadUsuarios();
            console.log('Conta criada com sucesso!');
            alert("Conta criada com sucesso!");
        } catch (error) {
            console.error('Erro ao criar a conta:', error);
            alert("Erro ao criar a conta. Por favor, tente novamente mais tarde.");
        }
    });
}

// Função para login do usuário
async function login() {
    let formLogin = document.getElementById('loginForm');

    // Verifica se o formulário de login foi encontrado antes de adicionar o ouvinte de eventos
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            // Verifica se o email existe na lista de usuários
            const user = usuarios.find(user => user.email === email);
            if (!user) {
                console.error("Email não encontrado. Por favor, verifique o email.");
                alert("Email não encontrado. Por favor, verifique o email.");
                return;
            }

            // Verifica se a senha está correta
            if (user.password !== password) {
                console.error("Senha incorreta. Por favor, verifique a senha.");
                alert("Senha incorreta. Por favor, verifique a senha.");
                return;
            }

            // Atualiza o campo loggedIn para true apenas se o login for bem-sucedido
            user.loggedIn = true;

            // Atualiza o usuário no JSON Server apenas se o login for bem-sucedido
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

            // Redireciona para a página home.html se o login for bem-sucedido
            window.location.href = "home.html";
        });
    } else {
        console.error("Elemento de formulário de login não encontrado.");
    }
}

// Função para logout do usuário
async function logout() {
    try {
        // Encontra o usuário logado
        const loggedInUser = usuarios.find(user => user.loggedIn === true);
        if (!loggedInUser) {
            throw new Error('Nenhum usuário logado.');
        }

        // Atualiza o campo loggedIn para false
        loggedInUser.loggedIn = false;

        // Atualiza o usuário no JSON Server
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

        // Redireciona para a página de login após o logout
        window.location.href = "login.html";
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Mostra um alerta indicando que houve um erro ao fazer o logout
        alert("Erro ao fazer logout. Por favor, tente novamente mais tarde.");
    }
}

// Adiciona um evento de clique no botão de logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        await logout();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadUsuarios(); // Carrega os usuários do DB JSON antes de iniciar as funções

    // Verifica se a página atual é a página de cadastro antes de chamar a função signUp
    if (window.location.pathname === '/signup.html') {
        signUp();
    }

    login();
});

