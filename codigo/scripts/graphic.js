document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatusAndPopulateContent();
});

document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

async function checkLoginStatusAndPopulateContent() {
    try {
        const loggedInUserId = await getLoggedInUser();
        if (!loggedInUserId) {
            displayLoginMessage();
        } else {
            populateVendaTable();
        }
    } catch (error) {
        displayLoginMessage();
    }
}

function displayLoginMessage() {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.innerHTML = `
            <h2>Você precisa estar logado para interagir com o gráfico!</h2>
            <a href="./login.html">
                <button class="edit-button">Ir para Login</button>
            </a>
            <style>
                .main-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    justify-content: center;
                    align-items: center;
                    width: calc(100% - 5.125rem);
                }
            </style>
        `;

        const home = document.getElementById('home');
        home.classList.add('active');

        const sideItems = document.querySelectorAll('#notHome');
        sideItems.forEach(item => {
            item.classList.add('hide');
        });
    }
}


async function getLoggedInUser() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
        throw new Error('Nenhum usuário logado encontrado.');
    }
    return loggedInUserId;
}

async function populateVendaTable() {
    try {
        const usuarioLogadoId = await getLoggedInUser();

        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro ao recuperar dados de vendas');
        }
        const vendas = await response.json();

        const vendasUsuarioLogado = vendas.filter(venda => venda.idUsuarioCriador === usuarioLogadoId);

        const vendaList = document.getElementById("venda-list");
        vendaList.innerHTML = '';

        vendasUsuarioLogado.forEach((venda) => {
            const vlt_total = venda.qtd * venda.vlr;
            const vendaRow = `
                <tr>
                    <th>${venda.id}</th>
                    <td>${venda.mes}</td>
                    <td>R$${parseFloat(venda.vlr).toFixed(2)}</td>
                    <td>${venda.qtd}</td>
                    <td>R$${parseFloat(vlt_total).toFixed(2)}</td>
                    <td>
                        <a onclick="getVenda(${venda.id});" 
                            class="btn btn-warning btn-sm" 
                            data-toggle="modal" data-target="#venda-modal">
                            <i class="fa fa-edit"></i>  Editar
                        </a>
                        <a onclick="$('#id-venda').text(${venda.id});" 
                            class="btn btn-danger btn-sm" 
                            data-toggle="modal" data-target="#modal-delete">
                            <i class="fa fa-trash"></i> Remover
                        </a>
                    </td>
                </tr>
            `;
            vendaList.insertAdjacentHTML('beforeend', vendaRow);
        });

        updateSalesStatistics(vendasUsuarioLogado);
        generateChart(vendasUsuarioLogado);
    } catch (error) {
        console.error('Erro ao recuperar dados de vendas:', error);
    }
}

const vendaDelete = document.getElementById("btn-delete");

vendaDelete.addEventListener("click", async (e) => {
    try {
        const usuarioLogadoId = await getLoggedInUser();

        if (!vendas) {
            throw new Error("Erro: Dados de vendas não estão disponíveis.");
        }

        let id = $("#id-venda").text();

        const vendaToDelete = vendas.find(venda => venda.id === id);

        if (!vendaToDelete || vendaToDelete.idUsuarioCriador !== usuarioLogadoId) {
            throw new Error("Você não tem permissão para excluir esta venda.");
        }

        const response = await fetch(`${URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir a venda.");
        }

        const remainingVendas = vendas.filter(venda => venda.id !== id);
        vendas = remainingVendas;

        generateChart(remainingVendas);
        populateVendaTable();
    } catch (error) {
        console.error("Erro ao excluir a venda:", error);
    }
});

function getVenda(id) {
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
            })
            .catch(error => console.error('Erro ao obter venda:', error));
    }
}

const vendaForm = document.getElementById("venda-form");
vendaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const usuarioLogadoId = await getLoggedInUser();

        let id = parseInt($("#edit-venda-id").text());

        const venda = {
            id: document.getElementById("venda-id").value,
            mes: document.getElementById("venda-mes").value,
            vlr: document.getElementById("venda-vlr").value,
            qtd: document.getElementById("venda-qtd").value,
            idUsuarioCriador: usuarioLogadoId,
        };

        if (venda.id.startsWith("0") || venda.id === "") {
            alert("O ID da venda não pode começar com 0 ou estar vazio.");
            return;
        }

        let method = 'POST';
        let url = URL;
        
        if (id >= 0) {
            method = 'PUT';
            url = `${URL}/${id}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(venda),
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar a venda.");
        }

        const updatedVenda = await response.json();

        if (method === 'POST') {
            vendas.push(updatedVenda);
        } else {
            const index = vendas.findIndex(venda => venda.id === updatedVenda.id);
            if (index !== -1) {
                vendas[index] = updatedVenda;
            }
        }

        generateChart(vendas);
        updateSalesStatistics(vendas);
        populateVendaTable();
    } catch (error) {
        console.error('Erro ao salvar a venda:', error);
    }
});

function generateChart(vendas) {
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

    const meses = Object.keys(vendasPorMes);
    const valores = Object.values(vendasPorMes);

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

async function updateSalesStatistics(vendas) {
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
