let loggedInUserId = localStorage.getItem('loggedInUserId');

function obterUsuarioLogado() {
    return fetch(`https://api-artistfinder-tiaw.onrender.com/usuarios/${loggedInUserId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter dados do usuário');
            }
            return response.json();
        });
}

function carregarDadosUsuario() {
    if (!loggedInUserId) {
        const mainElement = document.querySelector('.cols_container');
        mainElement.innerHTML = `
            <div class="left_col">
                <h2>Você precisa estar logado para editar seu perfil!</h2>
                <a href="./login.html">
                    <button class="edit-button">Ir para Login</button>
                </a>
            </div>
        `;
        return;
    }

    obterUsuarioLogado()
        .then(usuario => {
            document.getElementById('editName').value = usuario.nome;
            document.getElementById('editAge').value = usuario.idade;
            document.getElementById('editUsername').value = usuario.username;
            document.getElementById('editProfession').value = usuario.atuacao;
            document.getElementById('editState').value = usuario.estado;
            document.getElementById('editInstitution').value = usuario.instituicao;
            document.getElementById('editAvailability').value = usuario.disponibilidade;
            document.getElementById('editDescription').value = usuario.descricao;
            
            const userCapaData = JSON.parse(localStorage.getItem('userCapaData')) || [];
            const userCapa = userCapaData.find(user => user.id === loggedInUserId.toString());
            const capaUrl = userCapa ? userCapa.capa : `https://picsum.photos/id/${usuario.id}/700/700`;

            const capa = document.getElementById('header-capa');
            capa.style.backgroundImage = `url(${capaUrl})`;
            const userPhoto = document.getElementById('user-photo');
            let userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
            const userIndex = userPicData.findIndex(user => user.id === loggedInUserId.toString());

            if (userIndex !== -1 && userPicData[userIndex].foto) {
                userPhoto.src = userPicData[userIndex].foto;
                console.log(`Foto de perfil recuperada do localStorage para ${usuario.nome}`);
            } else {
                userPhoto.src = usuario.foto || 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
            }
            capa.innerHTML = `<header class="capa" id="capa"></header>
                <style>
                    .main .header_wrapper header {
                        width: 100%;
                        background: url(${usuario.capa}) no-repeat 50% 20% / cover;
                        min-height: calc(100px + 15vw);
                    }
                </style>`;

            document.getElementById('user-name').textContent = usuario.nome;
            document.getElementById('user-age').textContent = `${usuario.idade} anos`;
            document.getElementById('username').textContent = usuario.username;
            document.getElementById('user-profession').textContent = usuario.atuacao;
            document.getElementById('user-state').textContent = usuario.estado;
            document.getElementById('user-institution').textContent = usuario.instituicao;
            document.getElementById('user-availability').textContent = usuario.disponibilidade;
            document.getElementById('user-description').textContent = usuario.descricao;
            
            const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
            const avaliacoesUsuario = avaliacoes.filter(avaliacao => avaliacao.idAvaliado === loggedInUserId.toString());
            const somaAvaliacoes = avaliacoesUsuario.reduce((acc, curr) => acc + curr.estrelas, 0);
            let mediaAvaliacoes = avaliacoesUsuario.length > 0 ? (somaAvaliacoes / avaliacoesUsuario.length).toFixed(1) : '5.0';

            document.getElementById('user-rating').textContent = mediaAvaliacoes;

            portfolioUsuario();
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error.message));
}


function salvarMudancasUsuario() {
    const nome = document.getElementById('editName').value;
    const idade = document.getElementById('editAge').value;
    const username = document.getElementById('editUsername').value;
    const profissao = document.getElementById('editProfession').value;
    const estado = document.getElementById('editState').value;
    const instituicao = document.getElementById('editInstitution').value;
    const disponibilidade = document.getElementById('editAvailability').value;
    const descricao = document.getElementById('editDescription').value;

    obterUsuarioLogado()
        .then(usuarioLogado => {
            const dadosAtualizados = {
                ...usuarioLogado,
                nome: nome || usuarioLogado.nome,
                idade: idade || usuarioLogado.idade,
                username: username || usuarioLogado.username,
                atuacao: profissao || usuarioLogado.atuacao,
                estado: estado || usuarioLogado.estado,
                instituicao: instituicao || usuarioLogado.instituicao,
                disponibilidade: disponibilidade || usuarioLogado.disponibilidade,
                descricao: descricao || usuarioLogado.descricao
            };

            return fetch(`https://api-artistfinder-tiaw.onrender.com/usuarios/${loggedInUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do usuário');
            }
            return response.json();
        })
        .then(data => {
            carregarDadosUsuario();
            const modal = document.getElementById('editModal');
            if (modal) {
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            }
        })
        .catch(error => console.error('Erro ao salvar dados:', error.message));
}

function convertImageToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosUsuario();

    document.getElementById('saveChangesButton').addEventListener('click', function () {
        salvarMudancasUsuario();
    });

    document.getElementById('editPhoto').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.size < 2000000) {
            convertImageToBase64(file, function (base64) {
                let userPicData = JSON.parse(localStorage.getItem('userPicData')) || [];
                const userIndex = userPicData.findIndex(user => user.id === loggedInUserId.toString());
                if (userIndex !== -1) {
                    userPicData[userIndex].foto = base64;
                } else {
                    userPicData.push({
                        id: loggedInUserId.toString(),
                        foto: base64
                    });
                }

                localStorage.setItem('userPicData', JSON.stringify(userPicData));
                console.log('Imagem salva no localStorage.');
                const userPhoto = document.getElementById('user-photo');
                userPhoto.src = base64;
            });
        } else {
            alert("O tamanho da imagem deve ser inferior a 2MB");
        }
    });

    document.getElementById('editCapa').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.size < 2000000) {
            convertImageToBase64(file, function (base64) {
                let userCapaData = JSON.parse(localStorage.getItem('userCapaData')) || [];
                const userIndex = userCapaData.findIndex(user => user.id === loggedInUserId.toString());
                if (userIndex !== -1) {
                    userCapaData[userIndex].capa = base64;
                } else {
                    userCapaData.push({
                        id: loggedInUserId.toString(),
                        capa: base64
                    });
                } 

                localStorage.setItem('userCapaData', JSON.stringify(userCapaData));
                console.log('Imagem da capa salva no localStorage.');
                const capa = document.getElementById('header-capa');
                capa.style.backgroundImage = `url(${base64})`;
            });
        } else {
            alert("O tamanho da imagem deve ser inferior a 2MB");
        }
    });
});

function portfolioUsuario() {
    let galeriaUsuario = JSON.parse(localStorage.getItem('galeriaUsuario')) || {};
    const galeria = galeriaUsuario[loggedInUserId] || {};
    const defaultImage = 'https://cdn-icons-png.flaticon.com/512/3979/3979303.png';

    const galeriaHTML = `
    <div class="photos">          
        <label for="picture_input1" class="pic-container">
            <img id="galeria1" src="${galeria.galeria1 || defaultImage}" alt="Photo">
            <input type="file" accept="image/*" onchange="previewFile('picture_input1', 'galeria1')" id="picture_input1" /><br />
        </label>
        <label for="picture_input2" class="pic-container">
            <img id="galeria2" src="${galeria.galeria2 || defaultImage}" alt="Photo">
            <input type="file" accept="image/*" onchange="previewFile('picture_input2', 'galeria2')" id="picture_input2" /><br />
        </label>
        <label for="picture_input3" class="pic-container">
            <img id="galeria3" src="${galeria.galeria3 || defaultImage}" alt="Photo">
            <input type="file" accept="image/*" onchange="previewFile('picture_input3', 'galeria3')" id="picture_input3" /><br />
        </label>
    </div>`;
    document.getElementById('photo-container').innerHTML = galeriaHTML;
}

function previewFile(inputId, galeriaField) {
    const preview = document.querySelector(`#${galeriaField}`);
    const file = document.querySelector(`input[id=${inputId}]`).files[0];
    const reader = new FileReader();

    if (file && file.size < 2000000) {
        reader.addEventListener(
            "load",
            () => {
                preview.src = reader.result;
                alterarImagem(galeriaField, reader.result);
            },
            false
        );
        reader.readAsDataURL(file);
    } else {
        alert("O tamanho da imagem deve ser inferior a 2MB");
    }
}

function alterarImagem(galeriaField, imageURI) {
    let galeriaUsuario = JSON.parse(localStorage.getItem('galeriaUsuario')) || {};
    galeriaUsuario[loggedInUserId] = galeriaUsuario[loggedInUserId] || {};
    galeriaUsuario[loggedInUserId][galeriaField] = imageURI;
    localStorage.setItem('galeriaUsuario', JSON.stringify(galeriaUsuario));
}
