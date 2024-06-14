document.addEventListener("DOMContentLoaded", function () {
    signUp();
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
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        if (email !== confirmEmail) {
            alert("Os emails não coincidem. Por favor, verifique.");
            return;
        }

        if (password !== confirmPassword) {
            alert("A senha e o confirmar senha não coincidem. Por favor, verifique.");
            return;
        }

        try {
            const usuarios = await fetchUsuarios();

            if (usuarios.some(user => user.email === email)) {
                alert("Este email já está cadastrado. Por favor, escolha outro.");
                return;
            }

            const userId = (usuarios.length + 1).toString();

            const newUser = {
                id: userId,
                nome: "",
                idade: "",
                username: username,
                email: email,
                password: password,
                foto: "",
                estado: "",
                instituicao: "",
                disponibilidade: "",
                capa: "",
                atuacao: "",
                loggedIn: false
            };

            await createUser(newUser);
            window.location.href = "login.html";
            alert("Conta criada com sucesso!");

        } catch (error) {
            console.error('Erro ao criar a conta:', error);
            alert("Erro ao criar a conta. Por favor, tente novamente mais tarde.");
        }
    });
}

// Função para carregar os usuários
async function fetchUsuarios() {
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

// Função para criar um novo usuário
async function createUser(user) {
    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar a conta.');
        }

        await response.json();
    } catch (error) {
        console.error('Erro ao criar a conta:', error);
        throw error;
    }
}
