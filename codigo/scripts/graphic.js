/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para abrir a sidebar
document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

// Função para aplicar estilo ao elemento 'a' filho quando 'li.side-item' é hover
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

// Chama a função para aplicar o estilo quando a página carregar
applyStyleOnHover();

/*--------------------------------------------------------------------------------------------------------------------------*/

// URL da API de dados
const URL = "http://localhost:3000/vendas";
const usersURL = "http://localhost:3000/usuarios";
let vendas;

/*--------------------------------------------------------------------------------------------------------------------------*/

// Função para identificar o usuário logado
async function getLoggedInUser() {
    try {
        const response = await fetch(usersURL);
        if (!response.ok) {
            throw new Error('Erro na rede');
        }
        const data = await response.json();
        const loggedInUser = data.find(user => user.loggedIn);
        return loggedInUser;
    } catch (error) {
        console.error('Erro ao buscar usuário logado:', error);
        return null;
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// GET - Recupera todos as vendas e adiciona na tabela
async function populateVendaTable() {
    try {
        // Obtém o usuário logado
        const loggedInUser = await getLoggedInUser();

        if (!loggedInUser) {
            console.error("Nenhum usuário logado encontrado.");
            return;
        }

        const userId = loggedInUser.id;

        // Realiza a requisição GET para recuperar os dados de vendas do usuário logado
        const response = await fetch(`${URL}?usuarioCriador=${userId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao recuperar dados de vendas');
        }

        const vendas = await response.json();

        // Atribuir os dados da API à variável "vendas"
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
                    ${userId === venda.usuarioCriador ? 
                        `<a onclick="getvenda(${venda.id});" 
                        class="btn btn-warning btn-sm" 
                        data-toggle="modal" data-target="#venda-modal">
                        <i class="fa fa-edit"></i>  Editar
                        </a>

                        <a onclick="$('#id-venda').text(${venda.id
                    });" class="btn btn-danger btn-sm" 
                        data-toggle="modal" data-target="#modal-delete">
                        <i class="fa fa-trash"></i> Remover
                        </a>` : ''}
                </td>
            </tr>
            `;
        });

        vendaList.innerHTML = lista_vendas;
    } catch (error) {
        console.error('Erro ao recuperar dados de vendas:', error);
    }
}

// Chama a função para popular a tabela quando a página carregar
populateVendaTable();

/*--------------------------------------------------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------------------------------------------------*/

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
                // Verifica se o usuário logado é o criador da venda
                const usuarioLogado = getLoggedInUser();
                if (usuarioLogado && data.usuarioCriador === usuarioLogado.id) {
                    $("#venda-id").prop("disabled", true);
                } else {
                    $("#venda-id").prop("disabled", false);
                }

                $("#venda-id").val(data.id);
                $("#venda-mes").val(data.mes);
                $("#venda-vlr").val(data.vlr);
                $("#venda-qtd").val(data.qtd);
            });
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/

// Esta função cria ou edita uma venda, dependendo se o ID é fornecido ou não.
// CREATE or UPDATE - Procedimento para criar ou editar uma venda

const vendaForm = document.getElementById("venda-form");
vendaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obter o usuário logado
    const usuarioLogado = await getLoggedInUser();

    if (!usuarioLogado) {
        console.error("Nenhum usuário logado encontrado.");
        return;
    }

    const usuarioLogadoId = usuarioLogado.id;

    // RECUPERA O ID DO VENDA
    let id = parseInt($("#edit-venda-id").text());

    // RECUPERA OS DADOS DO VENDA
    const venda = {
        id: document.getElementById("venda-id").value,
        mes: document.getElementById("venda-mes").value,
        vlr: document.getElementById("venda-vlr").value,
        qtd: document.getElementById("venda-qtd").value,
        usuarioCriador: usuarioLogadoId, // Adiciona o ID do usuário logado
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
                createChart();
                updateSalesStatistics();
            });
    }
});

/*--------------------------------------------------------------------------------------------------------------------------*/

// Gráfico
async function generateChart() {
    try {
        const usuarioLogado = await getLoggedInUser();
        if (!usuarioLogado) {
            console.error("Nenhum usuário logado encontrado.");
            return;
        }
        
        const usuarioLogadoId = usuarioLogado.id;

        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar vendas');
        }
        
        const vendas = await response.json();

        let vendasUsuarioLogado = vendas.filter((venda) => venda.usuarioCriador === usuarioLogadoId);
        
        let meses = [];
        let valores = [];
        
        const vendasPorMes = {};

        vendasUsuarioLogado.forEach((venda) => {
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
    } catch (error) {
        console.error('Erro ao gerar gráfico:', error);
    }
}

// Chama a função para gerar o gráfico quando a página carregar
generateChart();


/*--------------------------------------------------------------------------------------------------------------------------*/

// Estatística de venda

// Esta função calcula as estatísticas de venda, como o total de vendas e a média de vendas por mês.

fetch(URL)
    .then((res) => res.json())
    .then((vendas) => {
        updateSalesStatistics(vendas);
    });

// Esta função calcula as estatísticas de venda, como o total de vendas e a média de vendas por mês.
async function updateSalesStatistics() {
    try {
        const usuarioLogado = await getLoggedInUser();
        if (!usuarioLogado) {
            console.error("Nenhum usuário logado encontrado.");
            return;
        }
        
        const usuarioLogadoId = usuarioLogado.id;

        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar vendas');
        }
        
        const vendas = await response.json();
        
        let totalSales = 0;
        let totalMonths = 0;

        vendas.forEach((venda) => {
            if (venda.usuarioCriador === usuarioLogadoId) {
                const valorTotal = parseFloat(venda.vlr) * parseFloat(venda.qtd);
                totalSales += valorTotal;
                totalMonths += 1;
            }
        });

        let avgSalesPerMonth = 0;

        if (totalMonths > 0) {
            avgSalesPerMonth = totalSales / totalMonths;
        }

        document.getElementById("total-sales-value").textContent =
            totalSales.toFixed(2);
        document.getElementById("avg-sales-value").textContent =
            avgSalesPerMonth.toFixed(2);
    } catch (error) {
        console.error('Erro ao atualizar estatísticas de vendas:', error);
    }
}

/*--------------------------------------------------------------------------------------------------------------------------*/