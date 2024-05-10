/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Função para abrir a sidebar

document.getElementById("open_btn").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});
/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// URL da API de dados

const URL = "http://localhost:3000/vendas";

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// GET - Recupera todos as vendas e adiciona na tabela

const vendaList = document.getElementById('venda-list');

fetch(URL)
    .then(res => res.json())
    .then(vendas => {

        vendas.sort((a, b) => {
            const mesMesA = a.mes.toLowerCase();
            const mesMesB = b.mes.toLowerCase();
            const mesesOrdem = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

            return mesesOrdem.indexOf(mesMesA) - mesesOrdem.indexOf(mesMesB);
        });

        let lista_vendas = '';
        vendas.forEach(venda => {
            const vlt_total = venda.qtd * venda.vlr;
            lista_vendas += `
            <tr>
                <th>${venda.id}</th>
                <td>${venda.mes}</td>
                <td>R$${(parseFloat(venda.vlr)).toFixed(2)}</td>
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
    });

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// DELETE - Procedimento de exclusão de venda

const vendaDelete = document.getElementById('btn-delete');

vendaDelete.addEventListener('click', (e) => {
    let id = $('#id-venda').text();

    fetch(`${URL}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro ao excluir a venda');
        }
        return res.json();
    })
    .then(() => {
        location.reload();
        createChart();
    })
    .catch(error => console.error('Erro ao excluir a venda:', error));
});


/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Procedimento para recuperação dos dados de venda da API
function getvenda(id){

    if(id == 0){
        $('#edit-venda-id').text("");
        $( "#venda-id" ).prop( "disabled", false );
        $('#venda-id').val("");
        $('#venda-mes').val("");
        $('#venda-vlr').val("");
        $('#venda-qtd').val("");
    }else{
        $('#edit-venda-id').text(id);
        fetch(`${URL}/${id}`).then(res => res.json())    
        .then(data => {
            $( "#venda-id" ).prop( "disabled", true );
            $('#venda-id').val(data.id);
            $('#venda-mes').val(data.mes);
            $('#venda-vlr').val(data.vlr);
            $('#venda-qtd').val(data.qtd);
        });
    }    
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// CREATE or UPDATE - Procedimento para criar ou editar uma venda

const vendaForm = document.getElementById('venda-form');

vendaForm.addEventListener('submit', (e) => {
    // RECUPERA O ID DO venda
    let id = parseInt($('#edit-venda-id').text());    

    // RECUPERA OS DADOS DO venda
    const venda = JSON.stringify({
        id: document.getElementById('venda-id').value,
        mes: document.getElementById('venda-mes').value,
        vlr: document.getElementById('venda-vlr').value,
        qtd: document.getElementById('venda-qtd').value
    })

    if (id >= 0) {
        fetch(`${URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: venda
        })
        .then(res => res.json())
        .then(() => {
            location.reload(); 
            createChart(); 
        });  
    }
    else { 
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: venda
        })
        .then(res => res.json())
        .then(() => {
            location.reload();
            createChart(); 
        });  
    }      
})

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Gráfico

let meses = [];
let valores = [];

fetch(URL)
    .then(res => res.json())
    .then(vendas => {

        const vendasPorMes = {};


        vendas.forEach(venda => {
            const mes = venda.mes.toLowerCase();
            const valorTotal = parseFloat(venda.vlr) * parseFloat(venda.qtd);

            if (vendasPorMes[mes]) {
                vendasPorMes[mes] += valorTotal;
            } else {
                vendasPorMes[mes] = valorTotal;
            }
        });

        Object.keys(vendasPorMes).forEach(mes => {
            meses.push(mes);
            valores.push(vendasPorMes[mes]);
        });

        meses.sort((a, b) => {
            const mesesOrdem = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            return mesesOrdem.indexOf(a) - mesesOrdem.indexOf(b);
        });

        const valoresOrdenados = [];
        meses.forEach(mes => {
            valoresOrdenados.push(vendasPorMes[mes]);
        });

        createChart(meses, valoresOrdenados);
    });

function createChart(meses, valores) {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Valor total das vendas',
                borderColor: '#3e1983',
                backgroundColor: '#7132e6',
                data: valores,
                borderWidth: 1,
            }]
            
        },
        options: {
            animation: {
                duration: 2000,
                easing: 'easeInOutQuad'
            },
            
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/

// Estatística de venda

function updateSalesStatistics(vendas) {
    let totalSales = vendas.reduce((total, venda) => total + (venda.qtd * venda.vlr), 0);
    let avgSalesPerMonth = totalSales / 12;

    document.getElementById('total-sales-value').textContent = totalSales.toFixed(2);
    document.getElementById('avg-sales-value').textContent = avgSalesPerMonth.toFixed(2);
}

fetch(URL)
    .then(res => res.json())
    .then(vendas => {
        updateSalesStatistics(vendas);
});


/*---------------------------------------------------------------------------------------------------------------------------------------------*/
