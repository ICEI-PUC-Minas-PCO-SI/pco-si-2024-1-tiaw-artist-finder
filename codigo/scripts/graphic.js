/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Adiciona um evento ao botão com o id "open_btn" para alternar a classe "open-sidebar" do elemento com o id "sidebar".
document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Função para aplicar estilo ao passar o mouse sobre os itens da barra lateral.
function applyStyleOnHover() {
    const sideItems = document.querySelectorAll('li.side-item');
    sideItems.forEach((item) => {
        item.addEventListener('mouseenter', function() {
            const link = this.querySelector('a');
            if (link) {
                link.style.color = '#fff';
            }
        });
        item.addEventListener('mouseleave', function() {
            const link = this.querySelector('a');
            if (link) {
                link.style.color = '';
            }
        });
    });
}
applyStyleOnHover();

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Define a URL base para a API.
const baseURL = "http://localhost:3000"; // Substitua pela sua URL base da API

// Função assíncrona para obter o ID do usuário logado.
async function getLoggedInUserId() {
    try {
        const res = await fetch(`${baseURL}/usuarios`);
        const users = await res.json();
        const loggedInUser = users.usuarios.find(user => user.loggedIn === true);
        return loggedInUser ? loggedInUser.id : null;
    } catch (error) {
        console.error("Erro ao buscar o usuário logado:", error);
        return null;
    }
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Executa o código quando o DOM estiver completamente carregado.
document.addEventListener("DOMContentLoaded", async function() {
    const userId = await getLoggedInUserId();
    if (!userId) {
        console.error("Nenhum usuário logado encontrado.");
        return;
    }

    const URL = `${baseURL}/usuarios/${userId}/vendas`; // Endpoint das vendas do usuário

    const vendaList = document.getElementById("venda-list");

    try {
        const res = await fetch(URL);
        if (!res.ok) {
            throw new Error(`Erro ao buscar vendas: ${res.statusText}`);
        }
        const vendas = await res.json();

        // Ordena as vendas por mês.
        vendas.sort((a, b) => {
            const mesA = a.mes.toLowerCase();
            const mesB = b.mes.toLowerCase();
            const mesesOrdem = [
                "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
                "agosto", "setembro", "outubro", "novembro", "dezembro"
            ];
            return mesesOrdem.indexOf(mesA) - mesesOrdem.indexOf(mesB);
        });

        let lista_vendas = "";
        vendas.forEach((venda) => {
            const vlt_total = venda.qtd * venda.vlr;
            lista_vendas += `
            <tr>
                <th>${venda.id}</th>
                <td>${venda.mes}</td>
                <td>R$${parseFloat(venda.vlr).toFixed(2)}</td>
                <td>${venda.qtd}</td>
                <td>R$${parseFloat(vlt_total).toFixed(2)}</td>
                <td>
                    <button class="btn-edit" data-id="${venda.id}">Editar</button>
                    <button class="btn-delete" data-id="${venda.id}">Excluir</button>
                </td>
            </tr>
            `;
        });
        vendaList.innerHTML = lista_vendas;

        // Adiciona evento de clique para editar uma venda.
        document.querySelectorAll('.btn-edit').forEach((btn) => {
            btn.addEventListener('click', async function() {
                const vendaId = this.getAttribute('data-id');
                const venda = vendas.find((venda) => venda.id === parseInt(vendaId));
                if (venda) {
                    const vendaForm = document.getElementById("venda-form");
                    vendaForm.elements["id"].value = venda.id;
                    vendaForm.elements["mes"].value = venda.mes;
                    vendaForm.elements["vlr"].value = venda.vlr;
                    vendaForm.elements["qtd"].value = venda.qtd;
                    vendaForm.elements["submit"].value = "Editar Venda";
                }
            });
        });

        // Adiciona evento de clique para excluir uma venda.
        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.addEventListener('click', async function() {
                const vendaId = this.getAttribute('data-id');
                try {
                    const res = await fetch(`${URL}/${vendaId}`, {
                        method: 'DELETE'
                    });
                    if (!res.ok) {
                        throw new Error(`Erro ao excluir venda: ${res.statusText}`);
                    }
                    console.log("Venda excluída com sucesso!");
                    location.reload(); // Recarrega a página para atualizar a lista de vendas.
                } catch (error) {
                    console.error("Erro ao excluir venda:", error);
                }
            });
        });

        // Cria o gráfico com as vendas.
        const ctx = document.getElementById('vendas-chart').getContext('2d');
        const vendasChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: vendas.map((venda) => venda.mes),
                datasets: [{
                    label: 'Vendas',
                    data: vendas.map((venda) => venda.qtd * venda.vlr),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao buscar vendas do usuário:", error);
    }
    // Adiciona evento de submit para criar ou editar uma venda.
    document.getElementById("venda-form").addEventListener("submit", async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const vendaId = formData.get("id");
        const vendaMes = formData.get("mes");
        const vendaVlr = formData.get("vlr");
        const vendaQtd = formData.get("qtd");

        try {
            if (vendaId) {
                // Edita uma venda existente.
                const res = await fetch(`${URL}/${vendaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mes: vendaMes, vlr: vendaVlr, qtd: vendaQtd })
                });
                if (!res.ok) {
                    throw new Error(`Erro ao editar venda: ${res.statusText}`);
                }
                console.log("Venda editada com sucesso!");
            } else {
                // Cria uma nova venda.
                const res = await fetch(URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mes: vendaMes, vlr: vendaVlr, qtd: vendaQtd })
                });
                if (!res.ok){
                    throw new Error(`Erro ao criar venda: ${res.statusText}`);
                }
                console.log("Venda criada com sucesso!");
            }
            location.reload(); // Recarrega a página para atualizar a lista de vendas.
        } catch (error) {
            console.error("Erro ao criar ou editar venda:", error);
        }
    });
}); 
