/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Função para abrir a sidebar

document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Função para aplicar estilo ao elemento 'a' filho quando 'li.side-item' é hover

function applyStyleOnHover() {

    const sideItems = document.querySelectorAll('li.side-item');


    sideItems.forEach((item) => {

        item.addEventListener('mouseenter', function () {

            const link = this.querySelector('a');
            if (link) {
                link.style.color = '#fff';
            }
        });


        item.addEventListener('mouseleave', function () {

            const link = this.querySelector('a');
            if (link) {
                link.style.color = '';
            }
        });
    });
}

// Chama a função para aplicar o estilo quando a página carregar
applyStyleOnHover();

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

const baseURL = "http://localhost:3000/usuarios";
let vendas;

// Função para identificar qual usuário está logado
function getLoggedInUserId() {
    return fetch(baseURL)
        .then(res => res.json())
        .then(users => {
            const loggedInUser = users.find(user => user.loggedIn === true);
            return loggedInUser ? loggedInUser.id : null;
        })
        .catch(error => {
            console.error("Erro ao buscar o usuário logado:", error);
            return null;
        });
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", async function () {
    const userId = await getLoggedInUserId();
    if (!userId) {
        console.error("Nenhum usuário logado encontrado.");
        return;
    }

    const URL = `${baseURL}/${userId}/vendas`;

    // GET - Recupera todas as vendas e adiciona na tabela
    const vendaList = document.getElementById("venda-list");

    fetch(URL)
        .then((res) => res.json())
        .then((vendasData) => {
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

        if (!vendas) {
            console.error("Erro: Dados de vendas não estão disponíveis.");
            return;
        }

        let id = $("#id-venda").text();

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
    window.getvenda = function getvenda(id) {
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
    };

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // CREATE or UPDATE - Procedimento para criar ou editar uma venda
    const vendaForm = document.getElementById("venda-form");

    vendaForm.addEventListener("submit", (e) => {
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

        fetch(url, {
            method: method,
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
    });

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

    // Gráfico
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
    fetch(URL)
        .then((res) => res.json())
        .then((vendas) => {
            updateSalesStatistics(vendas);
        });

    function updateSalesStatistics(vendas) {
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

        document.getElementById("total-sales-value").textContent =
            totalSales.toFixed(2);
        document.getElementById("avg-sales-value").textContent =
            avgSalesPerMonth.toFixed(2);
    }
});

/*---------------------------------------------------------------------------------------------------------------------------------------------*/
