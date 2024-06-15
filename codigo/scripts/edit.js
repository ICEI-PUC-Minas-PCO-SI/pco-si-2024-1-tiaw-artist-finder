// Função para recuperar os dados do usuário do banco de dados e adicionar ao HTML
function carregarDadosUsuarioLogado() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const user = usuarios.find(u => u.loggedIn);
            if (user) {
                atualizarPerfilVisual(user); // Atualiza os elementos HTML com os dados do usuário
            } else {
                console.error('Nenhum usuário logado encontrado.');
            }
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
}

carregarDadosUsuarioLogado();

// Função para atualizar os elementos na página com os dados do usuário
function atualizarPerfilVisual(usuario) {
    // Atualiza os elementos na página com os dados do usuário
    document.getElementById('name').textContent = usuario.nome;
    document.getElementById('display-username').textContent = usuario.username;
    document.getElementById('atuacao').textContent = usuario.atuacao;
    document.getElementById('estado').textContent = usuario.estado;

    // Preencher a foto de perfil
    // Verifique se há uma imagem armazenada no localStorage
    const storedImage = localStorage.getItem('storedImage');
    if (storedImage) {
        document.getElementById('profile_pic').src = storedImage;
    } else if (usuario.foto) {
        document.getElementById('profile_pic').src = usuario.foto;
    } else {
        // Se não houver foto de perfil, exibir uma imagem padrão ou deixar em branco
        document.getElementById('profile_pic').src = "./assets/img/user-profile-icon.svg";
    }
}

// Chamar a função para carregar os dados do usuário assim que a página carregar
document.addEventListener('DOMContentLoaded', () =>{
    displayStoredImage();
    carregarDadosUsuarioLogado();
});

// Função para abrir o modal e carregar os dados do usuário
function abrirModal() {
    try {
        var modal = document.getElementById('myModal');
        if (!modal) {
            throw new Error('Elemento modal não encontrado.');
        }

        // Exibir o modal
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Verificar se a div overlay já existe
        var overlay = document.querySelector('.modal-backdrop');
        if (!overlay) {
            // Se não existir, cria uma nova
            overlay = document.createElement('div');
            overlay.classList.add('modal-backdrop', 'fade', 'show');
            document.body.appendChild(overlay);
        }

        // Recuperar os dados do usuário logado e preencher o formulário
        preencherFormulario();
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

function preencherFormulario() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const user = usuarios.find(u => u.loggedIn);
            if (user) {
                dadoseditaveis(user);
            } else {
                console.error('Nenhum usuário logado encontrado.');
            }
        })
        .catch(error => console.error('Erro ao carregar os dados do usuário:', error));
}
preencherFormulario();
function dadoseditaveis (usuario){
    // Preencher os campos do formulário com os dados do usuário
    document.getElementById('id').value = usuario.id;
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('username').value = usuario.username;
    document.getElementById('atuacaoP').value = usuario.atuacao;
    document.getElementById('state').value = usuario.estado;
    
}

function fecharModal() {
    var modal = document.getElementById('myModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    var overlay = document.querySelector('.modal-backdrop');
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}

function salvarDados() {
    var userId = document.getElementById('id').value;

    fetch(`http://localhost:3000/usuarios/${userId}`)
        .then(response => response.json())
        .then(user => {
            var nome = document.getElementById('nome').value;
            var username = document.getElementById('username').value;
            var atuacao = document.getElementById('atuacaoP').value;
            var estado = document.getElementById('state').value;

            var fotoPerfil = document.getElementById('foto').files[0];

            var userData = {};
            if (nome !== user.nome) userData.nome = nome;
            if (username !== user.username) userData.username = username;
            if (atuacao !== user.atuacao) userData.atuacao = atuacao;
            if (estado !== user.estado) userData.estado = estado;


            if (Object.keys(userData).length > 0) {
                fetch(`http://localhost:3000/usuarios/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao salvar os dados do usuário');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Dados salvos com sucesso!');
                    fecharModal();
                })
                .catch(error => {
                    console.error('Erro ao salvar os dados do usuário:', error);
                });
            } else {
               if (fotoPerfil) {
                fecharModal();
               } else
               {
                alert('nenhuma alteração feita');
               }
               
            }
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
}

function login(userId) {
    // Armazenar o ID do usuário logado no localStorage
    localStorage.setItem('loggedInUserId', userId);
}
// Adiciona event listener para fechar o modal ao clicar no botão de fechar
var fecharBtn = document.getElementById('fecharmodal');
fecharBtn.addEventListener('click', fecharModal);

// Adiciona event listener para abrir o modal ao clicar no botão de abrir
var abrirBtn = document.querySelector('.edit-btn');
if (abrirBtn) {
    abrirBtn.addEventListener('click', abrirModal);
} else {
    console.error('Botão de abrir modal não encontrado.');
}
// Função para converter arquivo em base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Função para salvar a imagem no localStorage
async function saveImage() {
    const input = document.getElementById('foto');
    const file = input.files[0];

    if (file) {
        try {
            const base64Image = await toBase64(file);
            localStorage.setItem('storedImage', base64Image);
            alert('Imagem salva com sucesso!');
            displayStoredImage();
        } catch (error) {
            console.error('Erro ao converter a imagem:', error);
            alert('Erro ao salvar a imagem. Verifique o console para mais detalhes.');
        }
    } 
}

// Função para exibir a imagem armazenada
function displayStoredImage() {
    const storedImage = localStorage.getItem('storedImage');
    if (storedImage) {
        const imgElement = document.getElementById('profile_pic');
        imgElement.src = storedImage;
    } else {
        console.error('Nenhuma imagem encontrada no localStorage.');
    }
}

// Garantir que displayStoredImage seja chamada ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    displayStoredImage();
});// Função para converter arquivo em base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Função para salvar a imagem no localStorage
async function saveImage() {
    const input = document.getElementById('foto');
    const file = input.files[0];

    if (file) {
        try {
            const base64Image = await toBase64(file);
            localStorage.setItem('storedImage', base64Image);
            alert('Imagem salva com sucesso!');
            displayStoredImage();
        } catch (error) {
            console.error('Erro ao converter a imagem:', error);
            alert('Erro ao salvar a imagem. Verifique o console para mais detalhes.');
        }
    }
}

// Função para exibir a imagem armazenada
function displayStoredImage() {
    const storedImage = localStorage.getItem('storedImage');
    if (storedImage) {
        const imgElement = document.getElementById('profile_pic');
        imgElement.src = storedImage;
    } else {
        console.error('Nenhuma imagem encontrada no localStorage.');
    }
}

// Garantir que displayStoredImage seja chamada ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    displayStoredImage();
});

// Carregar a imagem armazenada ao carregar a página
window.addEventListener('load', displayStoredImage);

// Adiciona event listener para salvar as alterações no perfil do usuário
const modalSalvar = document.getElementById('btnSalvar');
if (modalSalvar) {
    modalSalvar.addEventListener('click', () =>{
        saveImage();
        salvarDados();  
    });

} else {
    console.error('Botão de salvar não encontrado.');
}
window.onload = displayStoredImage;