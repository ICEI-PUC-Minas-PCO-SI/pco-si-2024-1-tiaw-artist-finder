// Variável global para armazenar o próximo ID único
let nextUserId = 1;

// Função para obter o próximo ID único
function getNextUserId() {
    return nextUserId++;
}

// Função para cadastro de novo usuário
function signUp() {
    let formSignUp = document.getElementById('signUpForm');
    if (!formSignUp) {
        console.error("Elemento de formulário de cadastro não encontrado.");
        return;
    }

    formSignUp.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let userId = getNextUserId(); // Obtem o próximo ID único

        // Aqui você deve salvar os dados no DB JSON, usando o método de sua escolha
        // Exemplo de código para salvar no DB JSON usando fetch API
        fetch('http://localhost:3000/users', {
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
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Mostra um alerta indicando que a conta foi criada com sucesso
            alert("Conta criada com sucesso!");
        })
        .catch((error) => {
            console.error('Error:', error);
            // Mostra um alerta indicando que houve um erro ao criar a conta
            alert("Erro ao criar a conta. Por favor, tente novamente mais tarde.");
        });
    });
}


// Função para login do usuário
function login() {
    let formLogin = document.getElementById('loginForm');
    if (!formLogin) {
        console.error("Elemento de formulário de login não encontrado.");
        return;
    }

    formLogin.addEventListener("submit", (e) => {
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
            fetch('http://localhost:3000/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar dados do usuário.');
                }
                return response.json();
            })
            .then(users => {
                const user = users.find(user => user.email === email);
                if (!user) {
                    alert("Email não encontrado. Por favor, verifique o email.");
                } else if (user.password !== password) {
                    alert("Senha incorreta. Por favor, verifique a senha.");
                } else {
                    // Redireciona para a página home.html se o login for bem-sucedido
                    window.location.href = "home.html";
                }
            })
            .catch(error => {
                console.error('Erro ao fazer login:', error);
                // Mostra um alerta indicando que houve um erro ao fazer o login
                alert("Erro ao fazer login. Por favor, tente novamente mais tarde.");
            });
        } catch (error) {
            console.error('Erro inesperado:', error);
            // Mostra um alerta indicando que houve um erro inesperado
            alert("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.");
        }
    });
}


// Chama as funções de cadastro e login ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    signUp();
    login();
});
