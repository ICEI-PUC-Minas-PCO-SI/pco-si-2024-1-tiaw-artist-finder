function abrirModal() {
    try {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
            backdrop: 'static',
            keyboard: false
        });
        myModal.show();
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
}

function fecharModal() {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    myModal.hide();
}

function salvarDados() {
    fecharModal();
}

document.addEventListener('DOMContentLoaded', function() {
    var abrirBtn = document.querySelector('.edit-button');
    if (abrirBtn) {
        abrirBtn.addEventListener('click', abrirModal);
    } else {
        console.error('Botão de abrir modal não encontrado.');
    }

    var fecharBtn = document.getElementById('fecharmodal');
    if (fecharBtn) {
        fecharBtn.addEventListener('click', fecharModal);
    } else {
        console.error('Botão de fechar modal não encontrado.');
    }

    var salvarBtn = document.getElementById('btnSalvar');
    if (salvarBtn) {
        salvarBtn.addEventListener('click', salvarDados);
    } else {
        console.error('Botão de salvar não encontrado.');
    }
});
