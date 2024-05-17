// Variável global para armazenar os próximos IDs únicos
let nextUserId = 1;
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
function getNextUserId() {
    return String(nextUserId++); // Convertendo para string antes de retornar
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

        let userId = getNextUserId(); // Obtem o próximo ID único

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
            // Atualiza a lista de usuários após o cadastro bem-sucedido
            await loadUsuarios();

            window.location.href = "login.html";
            
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
    if (!formLogin) {
        console.error("Elemento de formulário de login não encontrado.");
        return;
    }

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        try {
            // Verifica se o email existe na lista de usuários
            const user = usuarios.find(user => user.email === email);
            if (!user) {
                alert("Email não encontrado. Por favor, verifique o email.");
                return;
            }
            // Verifica se a senha está correta
            if (user.password !== password) {
                alert("Senha incorreta. Por favor, verifique a senha.");
                return;
            }

            // Atualiza o campo loggedIn para true
            user.loggedIn = true;

            // Atualiza o usuário no JSON Server
            const response = await fetch(`http://localhost:3000/usuarios/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar usuário.');
            }

            // Redireciona para a página home.html se o login for bem-sucedido
            window.location.href = "home.html";
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            // Mostra um alerta indicando que houve um erro ao fazer o login
            alert("Erro ao fazer login. Por favor, tente novamente mais tarde.");
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadUsuarios(); // Carrega os usuários do DB JSON antes de iniciar as funções
    signUp();
    login();
});
