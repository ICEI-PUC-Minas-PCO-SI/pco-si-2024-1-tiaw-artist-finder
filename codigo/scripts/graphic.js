
document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

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
const URL = "http://localhost:3000/vendas";
let vendas;

async function getLoggedInUser() {
    return localStorage.getItem('loggedInUserId') !== null;
}

const vendaList = document.getElementById("venda-list");

fetch(URL)
    .then((res) => res.json())
    .then((vendasData) => {
        vendas = vendasData;

        vendas.sort((a, b) => {
            const mesMesA = a.mes.toLowerCase();
            const mesMesB = b.mes.toLowerCase();
            const mesesOrdem = [
                "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
                "agosto", "setembro", "outubro", "novembro", "dezembro"
            ];

            return mesesOrdem.indexOf(mesMesA) - mesesOrdem.indexOf(mesMesB);
        });

        populateVendaTable();
    })
    .catch(error => console.error('Erro ao recuperar dados de vendas:', error));

async function populateVendaTable() {
    try {
        const usuarioLogado = await getLoggedInUser();

        if (!usuarioLogado) {
            console.error("Nenhum usuário logado encontrado.");
            return;
        }

        const usuarioLogadoId = usuarioLogado.id;

        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro ao recuperar dados de vendas');
        }
        const vendas = await response.json();

        const vendasUsuarioLogado = vendas.filter(venda => venda.usuarioCriador === usuarioLogadoId);

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
                        <a onclick="getvenda(${venda.id});" 
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
            generateChart();
        })
        .catch((error) => console.error("Erro ao excluir a venda:", error));
});

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
                $("#venda-vlr").val(data.qtd);
            });
    }
}

const vendaForm = document.getElementById("venda-form");
vendaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarioLogado = await getLoggedInUser();

    if (!usuarioLogado) {
        console.error("Nenhum usuário logado encontrado.");
        return;
    }

    const usuarioLogadoId = usuarioLogado.id;

    let id = parseInt($("#edit-venda-id").text());

    const venda = {
        id: document.getElementById("venda-id").value,
        mes: document.getElementById("venda-mes").value,
        vlr: document.getElementById("venda-vlr").value,
        qtd: document.getElementById("venda-qtd").value,
        usuarioCriador: usuarioLogadoId,
    };

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
                generateChart();
                updateSalesStatistics();
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
                generateChart();
                updateSalesStatistics();
            });
    }
});

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

        generateChart(meses, valoresOrdenados);
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