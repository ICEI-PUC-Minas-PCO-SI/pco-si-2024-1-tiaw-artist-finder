/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Função para abrir a sidebar

document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// URL da API de dados

const URL = "http://localhost:3000/vendas";
let vendas;

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// GET - Recupera todos as vendas e adiciona na tabela

// Esta função realiza uma requisição GET para recuperar os dados de vendas da API e adiciona na tabela.

const vendaList = document.getElementById("venda-list");

fetch(URL)
    .then((res) => res.json())
    .then((vendasData) => {
        // Atribuir os dados da API à variável "vendas"
        vendas = vendasData;

        // Ordenar as vendas por mês
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

                    <a onclick="$('#id-venda').text(${venda.id
                });" class="btn btn-danger btn-sm" 
                    data-toggle="modal" data-target="#modal-delete">
                    <i class="fa fa-trash"></i> Remover
                    </a>
                </td>
            </tr>
            `;
        });

        vendaList.innerHTML = lista_vendas;
    });

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// DELETE - Procedimento de exclusão de venda
const vendaDelete = document.getElementById("btn-delete");

vendaDelete.addEventListener("click", (e) => {

    // Verificar se a variável vendas está definida

    if (!vendas) {
        console.error("Erro: Dados de vendas não estão disponíveis.");
        return;
    }

    let id = $("#id-venda").text();

    // Verificar se a venda com o ID especificado existe nos dados

    if (!vendas.some((venda) => venda.id === id)) {
        console.error(
            "Venda não encontrada. O ID especificado pode estar incorreto."
        );
        return;
    }

    fetch(`${URL}/${id}`, {
        method: "DELETE",
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Erro ao excluir a venda");
            }
            return res.json();
        })
        .then(() => {
            createChart();
        })
        .catch((error) => console.error("Erro ao excluir a venda:", error));
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Procedimento para recuperação dos dados de venda da API

function getvenda(id) {
    if (id == 0) {
        $("#edit-venda-id").text("");
        $("#venda-id").prop("disabled", false);
        $("#venda-id").val("");
        $("#venda-mes").val("");
        $("#venda-vlr").val("");
        $("#venda-qtd").val("");
    } else {
        $("#edit-venda-id").text(id);
        fetch(`${URL}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                $("#venda-id").prop("disabled", true);
                $("#venda-id").val(data.id);
                $("#venda-mes").val(data.mes);
                $("#venda-vlr").val(data.vlr);
                $("#venda-qtd").val(data.qtd);
            });
    }
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// CREATE or UPDATE - Procedimento para criar ou editar uma venda

// Esta função cria ou edita uma venda, dependendo se o ID é fornecido ou não.

const vendaForm = document.getElementById("venda-form");

vendaForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o comportamento padrão do envio do formulário

    // RECUPERA O ID DO venda

    let id = parseInt($("#edit-venda-id").text());

    // RECUPERA OS DADOS DO venda

    const venda = {
        id: document.getElementById("venda-id").value,
        mes: document.getElementById("venda-mes").value,
        vlr: document.getElementById("venda-vlr").value,
        qtd: document.getElementById("venda-qtd").value,
    };

    // Verificar se o ID da venda começa com "0" ou está vazio

    if (venda.id.startsWith("0") || venda.id === "") {
        alert("O ID da venda não pode começar com 0 ou estar vazio.");
        return;
    }

    if (id >= 0) {
        fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(venda),
        })
            .then((res) => res.json())
            .then(() => {
                createChart();
                updateSalesStatistics(); // Atualiza as estatísticas após a criação ou edição da venda
            });
    } else {
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(venda),
        })
            .then((res) => res.json())
            .then(() => {
                createChart();
                updateSalesStatistics(); // Atualiza as estatísticas após a criação ou edição da venda
            });
    }
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Gráfico

// This function creates a bar chart to visualize sales data.

let meses = [];
let valores = [];

fetch(URL)
    .then((res) => res.json())
    .then((vendas) => {
        const vendasPorMes = {};

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
    });

// Esta função cria um gráfico de barras para visualizar os dados de vendas.

function createChart(meses, valores) {
    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: meses,
            datasets: [
                {
                    label: "Valor total das vendas",
                    borderColor: "#3e1983",
                    backgroundColor: "#7132e6",
                    data: valores,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            animation: {
                duration: 2000,
                easing: "easeInOutQuad",
            },

            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Estatística de venda

// Esta função calcula as estatísticas de venda, como o total de vendas e a média de vendas por mês.

fetch(URL)
    .then((res) => res.json())
    .then((vendas) => {
        updateSalesStatistics(vendas);
    });

// Esta função calcula as estatísticas de venda, como o total de vendas e a média de vendas por mês.

function updateSalesStatistics(vendas) {
    let totalSales = 0;
    let totalMonths = 0;

    vendas.forEach((venda) => {
        const valorTotal = parseFloat(venda.vlr) * parseFloat(venda.qtd);
        totalSales += valorTotal;
        totalMonths += 1; // Incrementa o total de meses para cada venda
    });

    // Inicializa a média de vendas por mês com 0

    let avgSalesPerMonth = 0;

    // Verifica se há vendas antes de calcular a média de vendas por mês

    if (totalMonths > 0) {

        // Calcula a média de vendas por mês com base no total de vendas e no total de meses
        
        avgSalesPerMonth = totalSales / totalMonths;
    }

    document.getElementById("total-sales-value").textContent =
        totalSales.toFixed(2);
    document.getElementById("avg-sales-value").textContent =
        avgSalesPerMonth.toFixed(2);
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/
