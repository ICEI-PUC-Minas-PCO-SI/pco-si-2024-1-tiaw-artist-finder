// Variável global para armazenar os próximos IDs únicos
let nextUserId = 1;
let users = [];

// Função para carregar os usuários do DB JSON
async function loadUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários.');
        }
        users = await response.json();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Função para obter o próximo ID único
function getNextUserId() {
    // Se não houver usuários, retorna 1 como o próximo ID
    if (users.length === 0) {
        return 1;
    }
    // Obtém o ID do último usuário cadastrado e adiciona 1
    return users[users.length - 1].id + 1;
}

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
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        // Verifica se o email já está cadastrado
        if (users.some(user => user.email === email)) {
            alert("Este email já está cadastrado. Por favor, escolha outro.");
            return;
        }

        // Verifica se os campos de senha e confirmação de senha são iguais
        if (password !== confirmPassword) {
            alert("As senhas não coincidem. Por favor, verifique.");
            return;
        }

        let userId = getNextUserId(); // Obtem o próximo ID único

        try {
            // Salva os dados no DB JSON usando fetch API
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    username: username,
                    email: email,
                    password: password
                }),
            });
            if (!response.ok) {
                throw new Error('Erro ao criar a conta.');
            }
            // Atualiza a lista de usuários após o cadastro bem-sucedido
            await loadUsers();
            console.log('Conta criada com sucesso!');
            alert("Conta criada com sucesso!");
        } catch (error) {
            console.error('Erro ao criar a conta:', error);
            alert("Erro ao criar a conta. Por favor, tente novamente mais tarde.");
        }
    });
}


// Função para login do usuário
function login() {
    let formLogin = document.getElementById('loginForm');
    if (!formLogin) {
        console.error("Elemento de formulário de login não encontrado.");
        return;
    }

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        let emailInput = document.getElementById("email");
        let passwordInput = document.getElementById("password");

        if (!emailInput || !passwordInput) {
            console.error("Elementos de entrada de e-mail e senha não encontrados.");
            return;
        }

        let email = emailInput.value;
        let password = passwordInput.value;

        try {
            // Verifica se o email existe na lista de usuários
            const user = users.find(user => user.email === email);
            if (!user) {
                alert("Email não encontrado. Por favor, verifique o email.");
                return;
            }
            // Verifica se a senha está correta
            if (user.password !== password) {
                alert("Senha incorreta. Por favor, verifique a senha.");
                return;
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

// Função para revelar a senha quando o usuário clica no ícone
document.addEventListener("click", (e) => {
    if (e.target.classList.contains('toggle-password')) {
        const passwordField = e.target.parentElement.querySelector('.input__field');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    }
});

// Chama as funções de cadastro e login ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
    await loadUsers(); // Carrega os usuários do DB JSON antes de iniciar as funções
    signUp();
    login();
});
