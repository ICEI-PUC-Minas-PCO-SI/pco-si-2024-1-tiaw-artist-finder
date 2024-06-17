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
                nome: "edite seu nome!",
                idade: 18,
                username: username,
                email: email,
                password: password,
                foto: "",
                estado: "edite seu estado!",
                instituicao: "edite sua instituição!",
                disponibilidade: "edite sua disponibilidade!",
                capa: "",
                atuacao: "edite sua atuação!",
                loggedIn: false,
                galeria1: "",
                galeria2: "",
                galeria3: "",
                descricao: "edite sua descrição!",
                stats: [
                    {
                        "estrelas": "5 estrelas",
                        "label": 5,
                        "value": 5,
                        "id": "1"
                    },
                    {
                        "estrelas": "4 estrelas",
                        "label": 4,
                        "value": 2,
                        "id": "2"
                    },
                    {
                        "estrelas": "3 estrelas",
                        "label": 3,
                        "value": 3,
                        "id": "3"
                    },
                    {
                        "estrelas": "2 estrelas",
                        "label": 2,
                        "value": 1,
                        "id": "4"
                    },
                    {
                        "estrelas": "1 estrelas",
                        "label": 1,
                        "value": 9,
                        "id": "5"
                    }
                ]
            };

            await createUser(newUser);
            
            const defaultPhotoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#B197FC" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;
            localStorage.setItem('userProfilePic', defaultPhotoSVG);

            window.location.href = "login.html";
            alert("Conta criada com sucesso!");

        } catch (error) {
            console.error('Erro ao criar a conta:', error);
            alert("Erro ao criar a conta. Por favor, tente novamente mais tarde.");
        }
    });
}
