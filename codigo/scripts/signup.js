document.addEventListener("DOMContentLoaded", function () {
    const formSignUp = document.getElementById('signUpForm');
    formSignUp.addEventListener("submit", async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const confirmEmail = document.getElementById("confirmEmail").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (email !== confirmEmail) {
            alert("Os emails não coincidem. Por favor, verifique.");
            return;
        }

        if (password !== confirmPassword) {
            alert("A senha e o confirmar senha não coincidem. Por favor, verifique.");
            return;
        }

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
            galeria1: "",
            galeria2: "",
            galeria3: "",
            avaliacao: 0,
            descricao: "edite sua descrição!"
        };

        await createUser(newUser);
        alert("Conta criada com sucesso!");

        let userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
        userPicData.push({
            id: userId,
            foto: 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png'
        });

        localStorage.setItem('userPicData', JSON.stringify(userPicData));

        await addDefaultRatings(userId);

        window.location.href = "login.html";
    });
});

async function fetchUsuarios() {
    const response = await fetch('https://api-tiaw-vercel.vercel.app/usuarios');
    if (!response.ok) {
        throw new Error('Erro ao carregar usuários.');
    }
    return await response.json();
}

async function createUser(user) {
    const response = await fetch('https://api-tiaw-vercel.vercel.app/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error('Erro ao criar a conta.');
    }

    return await response.json();
}

async function addDefaultRatings(userId) {
    const usuarios = await fetchUsuarios();
    const avaliacoes = await fetchAvaliacoes();

    const novasAvaliacoes = [];

    usuarios.forEach(user => {
        if (user.id !== userId) {
            const novaAvaliacao = {
                id: (avaliacoes.length + novasAvaliacoes.length + 1).toString(),
                idAvaliador: userId,
                idAvaliado: user.id,
                estrelas: 5
            };
            novasAvaliacoes.push(novaAvaliacao);
        }
    });

    await Promise.all(novasAvaliacoes.map(avaliacao => createAvaliacao(avaliacao)));
    console.log("Avaliações padrão adicionadas com sucesso para todos os usuários!");
}
