// Realiza uma requisição GET para obter os dados dos usuários

let idUserLogged = 0;

fetch('http://localhost:3000/usuarios')
  .then(response => response.json())
  .then(data => {
    const usuarioLogado = data.find(usuario => usuario.loggedIn);
    document.getElementById('editName').value = usuarioLogado.nome;
    document.getElementById('editAge').value = usuarioLogado.idade;
    document.getElementById('editUsername').value = usuarioLogado.username;
    document.getElementById('editProfession').value = usuarioLogado.atuacao;
    document.getElementById('editState').value = usuarioLogado.estado;
    document.getElementById('editInstitution').value = usuarioLogado.instituicao;
    document.getElementById('editAvailability').value = usuarioLogado.disponibilidade;
    idUserLogged = usuarioLogado.id;
  })
  .catch(error => console.error('Erro ao carregar dados:', error));

  document.getElementById('saveChangesButton').addEventListener('click', function() {
    var nome = document.getElementById('editName').value;
    var idade = document.getElementById('editAge').value;
    var username = document.getElementById('editUsername').value;
    var profissao = document.getElementById('editProfession').value;
    var estado = document.getElementById('editState').value;
    var instituicao = document.getElementById('editInstitution').value;
    var disponibilidade = document.getElementById('editAvailability').value;

    fetch(`http://localhost:3000/usuarios/${idUserLogged}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao obter dados do usuário');
        }
        return response.json();
    })
    .then(data => {
        var dadosAtualizados = {
            ...data,
            nome: nome || data.nome,
            idade: idade || data.idade,
            username: username || data.username,
            atuacao: profissao || data.atuacao,
            estado: estado || data.estado,
            instituicao: instituicao || data.instituicao,
            disponibilidade: disponibilidade || data.disponibilidade
        };

        return fetch(`http://localhost:3000/usuarios/${idUserLogged}`, {
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
        console.log('Dados atualizados com sucesso:', data);
        var modal = document.getElementById('editModal');
        var bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.hide();
    })
    .catch(error => console.error('Erro ao salvar dados:', error));
});

function carregarDadosUsuario() {
    fetch(`http://localhost:3000/usuarios/${idUserLogged}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao obter dados do usuário');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('editName').value = data.nome;
        document.getElementById('editAge').value = data.idade;
        document.getElementById('editUsername').value = data.username;
        document.getElementById('editProfession').value = data.atuacao;
        document.getElementById('editState').value = data.estado;
        document.getElementById('editInstitution').value = data.instituicao;
        document.getElementById('editAvailability').value = data.disponibilidade;
    })
    .catch(error => console.error('Erro ao carregar dados do usuário:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    carregarDadosUsuario();
});



