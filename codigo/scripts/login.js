//
//
// Disciplina: Trabalho Interdisciplinar - Aplicações Web
// Professor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
//
// Código LoginApp utilizado como exemplo para alunos de primeiro período 


// Página inicial de Login
const LOGIN_URL = "sign.html";

// URL da API REST
const API_URL = 'http://localhost:3000/usuarios'; // Supondo que a rota para os usuários seja '/usuarios'

// Objeto para o usuário corrente
let usuarioCorrente = {};

// Inicializa o usuarioCorrente e banco de dados de usuários da aplicação de Login
async function initLoginApp() {
    try {
        // Obtem os dados de usuários da API
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data) {
            db = data; // Assumindo que o formato retornado pela API é um objeto contendo usuários
            console.log("Banco de dados de usuários carregado:", db);
        } else {
            alert('Dados de usuários não encontrados na API. \n -----> Fazendo carga inicial.');
        }
    } catch (error) {
        console.error("Erro ao carregar dados de usuários:", error);
    }
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser(login, senha) {
    const usuario = db.find(user => user.login === login && user.senha === senha);
    if (usuario) {
        usuarioCorrente = usuario;
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
        console.log("Usuário logado com sucesso:", usuarioCorrente);
        alert("Usuario logado com sucesso!");
        return true;
    } else {
        console.log("Login ou senha incorretos.");
        return false;
    }
}

// Apaga os dados do usuário corrente no sessionStorage
function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.removeItem('usuarioCorrente');
    window.location = LOGIN_URL;
}

// Adiciona um novo usuário
async function addUser(nome, login, senha, email) {
    try {
        const newUsuario = { nome, login, senha, email };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUsuario)
        });
        const data = await response.json();
        console.log("Novo usuário adicionado:", data);
    } catch (error) {
        console.error("Erro ao adicionar novo usuário:", error);
    }
}

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp();
