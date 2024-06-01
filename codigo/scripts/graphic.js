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
const baseURL = "http://localhost:3000/usuarios";

// Função assíncrona para obter o ID do usuário logado.
async function getLoggedInUserId() {
    try {
        const res = await fetch(baseURL);
        const users = await res.json();
        const loggedInUser = users.find(user => user.loggedIn === true);
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

    const URL = `${baseURL}/${userId}/vendas`;

    const vendaList = document.getElementById("venda-list");

    try {
        const res = await fetch(URL);
        if (!res.ok) {
            throw new Error(`Erro ao buscar vendas: ${res.statusText}`);
        }
        const vendasData = await res.json();
        vendas = vendasData;

        // Ordena as vendas por mês.
        vendas.sort((a, b) => {
            const mesMesA = a.mes.toLowerCase();
            const mesMesB = b.mes.toLowerCase();
            const mesesOrdem = [
                "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
                "agosto", "setembro", "outubro", "novembro", "dezembro"
            ];
            return mesesOrdem.indexOf(mesMesA) - mesesOrdem.indexOf(mesMesB);
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
                    <a onclick="getvenda(${venda.id});" 
                    class="btn btn-warning btn-sm" 
                    data-toggle="modal" data-target="#venda-modal">
                    <i class="fa fa-edit"></i>  Editar
                    </a>
                    <a onclick="$('#id-venda').text(${venda.id});" class="btn btn-danger btn-sm" 
                    data-toggle="modal" data-target="#modal-delete">
                    <i class="fa fa-trash"></i> Remover
                    </a>
                </td>
            </tr>
            `;
        });

        vendaList.innerHTML = lista_vendas;
    } catch (error) {
        console.error("Erro ao buscar vendas:", error);
    }

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // Evento de clique para excluir uma venda.
    const vendaDelete = document.getElementById("btn-delete");

    vendaDelete.addEventListener("click", async () => {
        if (!vendas) {
            console.error("Erro: Dados de vendas não estão disponíveis.");
            return;
        }

        let id = $("#id-venda").text();

        if (!vendas.some((venda) => venda.id === id)) {
            console.error("Venda não encontrada. O ID especificado pode estar incorreto.");
            return;
        }

        try {
            const res = await fetch(`${URL}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Erro ao excluir a venda");
            }
            await res.json();
            createChart();
        } catch (error) {
            console.error("Erro ao excluir a venda:", error);
        }
    });

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // Função para buscar dados de uma venda específica.
    window.getvenda = async function getvenda(id) {
        if (id == 0) {
            $("#edit-venda-id").text("");
            $("#venda-id").prop("disabled", false);
            $("#venda-id").val("");
            $("#venda-mes").val("");
            $("#venda-vlr").val("");
            $("#venda-qtd").val("");
        } else {
            $("#edit-venda-id").text(id);
            try {
                const res = await fetch(`${URL}/${id}`);
                const data = await res.json();
                $("#venda-id").prop("disabled", true);
                $("#venda-id").val(data.id);
                $("#venda-mes").val(data.mes);
                $("#venda-vlr").val(data.vlr);
                $("#venda-qtd").val(data.qtd);
            } catch (error) {
                console.error("Erro ao buscar venda:", error);
            }
        }
    };

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // Evento de envio do formulário de venda.
    const vendaForm = document.getElementById("venda-form");

    vendaForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let id = parseInt($("#edit-venda-id").text());

        const venda = {
            id: document.getElementById("venda-id").value,
            mes: document.getElementById("venda-mes").value,
            vlr: document.getElementById("venda-vlr").value,
            qtd: document.getElementById("venda-qtd").value,
        };

        if (venda.id.startsWith("0") || venda.id === "") {
            alert("O ID da venda não pode começar com 0 ou estar vazio.");
            return;
        }

        const method = id >= 0 ? "PUT" : "POST";
        const url = id >= 0 ? `${URL}/${id}` : URL;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(venda),
            });
            await res.json();
            createChart();
            updateSalesStatistics(); 
        } catch (error) {
            console.error("Erro ao criar/editar venda:", error);
        }
    });

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // Variáveis para armazenar meses e valores das vendas.
    let meses = [];
    let valores = [];

    try {
        const res = await fetch(URL);
        const vendas = await res.json();
        const vendasPorMes = {};

        // Processa os dados das vendas para agrupá-los por mês.
        vendas.forEach((venda) => {
            const mes = venda.mes.toLowerCase();
            const valorTotal = parseFloat(venda.vlr) * parseFloat(venda.qtd);

            if (vendasPorMes[mes]) {
                vendasPorMes[mes] += valorTotal;
            } else {
                vendasPorMes[mes] = valorTotal;
            }
        });

        Object.keys(vendasPorMes).forEach((mes) => {
            meses.push(mes);
            valores.push(vendasPorMes[mes]);
        });

        // Ordena os meses na ordem correta.
        meses.sort((a, b) => {
            const mesesOrdem = [
                "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
                "agosto", "setembro", "outubro", "novembro", "dezembro"
            ];
            return mesesOrdem.indexOf(a) - mesesOrdem.indexOf(b);
        });

        const valoresOrdenados = [];
        meses.forEach((mes) => {
            valoresOrdenados.push(vendasPorMes[mes]);
        });

        createChart(meses, valoresOrdenados);
    } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error);
    }

    // Função para criar o gráfico.
    function createChart(meses, valores) {
        const ctx = document.getElementById("myChart");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: meses,
                datasets: [
                    {
                        label: "Vendas por mês",
                        data: valores,
                        backgroundColor: "#3498db",
                        borderColor: "#2980b9",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // Elementos para exibir o valor total das vendas e a média das vendas.
    const totalSalesValue = document.getElementById("total-sales-value");
    const avgSalesValue = document.getElementById("avg-sales-value");

    // Função para atualizar as estatísticas de vendas.
    async function updateSalesStatistics() {
        try {
            const res = await fetch(URL);
            if (!res.ok) {
                throw new Error("Erro ao buscar vendas");
            }
            const vendas = await res.json();

            let totalSales = 0;
            let totalMonths = 0;

            vendas.forEach((venda) => {
                const valorTotal = parseFloat(venda.vlr) * parseFloat(venda.qtd);
                totalSales += valorTotal;
                totalMonths += 1;
            });

            let avgSalesPerMonth = 0;

            if (totalMonths > 0) {
                avgSalesPerMonth = totalSales / totalMonths;
            }

            totalSalesValue.textContent = totalSales.toFixed(2);
            avgSalesValue.textContent = avgSalesPerMonth.toFixed(2);
        } catch (error) {
            console.error("Erro ao atualizar estatísticas de vendas:", error);
        }
    }

    await updateSalesStatistics();
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/
