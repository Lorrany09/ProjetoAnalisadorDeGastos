const categoria = ["Habitação", "Alimentação", "Saúde", "Cuidados pessoais", "Lazer", "Educação", "Tecnologia"];
const pagamentos = ["Dinheiro", "Cartão de Crédito", "Boleto", "PIX"];

let graficoPagos, graficoNaoPagos, graficoPizza, graficoLinha;

function carregarCategorias() {
    const select = document.getElementById("categorias");
    
    select.innerHTML = '<option value="" hidden disabled selected></option>';
    
    categoria.forEach((x, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.text = x;
        select.appendChild(option);
    });
}

function carregarPagamentos() {
    const select = document.getElementById("tipo");
    
    select.innerHTML = '<option value="" hidden disabled selected></option>';
    
    pagamentos.forEach(x => {
        const option = document.createElement("option");
        option.value = x;
        option.text = x;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarTodosDados();
    document.getElementById('formGasto').addEventListener('submit', salvarGasto);
});

async function carregarTodosDados() {
    await carregarListaGastos();
    await carregarGraficoPorCategoria();
    await carregarGraficoPorMes();
    await carregarGraficoComparativo();
}

async function carregarListaGastos() {
    try {
        const response = await fetch('api.php?tipo=listar');
        const gastos = await response.json();
        
        const tbodyPagos = document.getElementById('listaGastosPagos');
        const tbodyNaoPagos = document.getElementById('listaGastosNaoPagos');
        
        if (tbodyPagos) tbodyPagos.innerHTML = '';
        if (tbodyNaoPagos) tbodyNaoPagos.innerHTML = '';
        
        gastos.forEach(gasto => {
            const linha = `
                <tr>
                    <td>${gasto.nome}</td>
                    <td>${formatarData(gasto.data)}</td>
                    <td>${gasto.categoria_nome}</td>
                    <td>R$ ${parseFloat(gasto.valor).toFixed(2)}</td>
                    <td>${gasto.tipo_pagamento || '-'}</td>
                    <td><button class="deletar" onclick="deletarGasto(${gasto.id})" title="Lixeira">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50"><path fill="#df4bb1" d="M45.493,27.448c-0.007,0.006-0.011,0.012-0.018,0.017C45.537,27.414,45.529,27.42,45.493,27.448z"></path><path fill="#df4bb1" d="M45.458,31.395c-0.014-0.014-0.046-0.048-0.085-0.089c0.228-0.16,0.457-0.391,0.601-0.572 c0.313-0.391,0.475-0.891,0.45-1.393c-0.024-0.488-0.191-0.953-0.477-1.348c-0.144-0.198-0.317-0.358-0.492-0.515 c0.016-0.012,0.028-0.022,0.039-0.031c0.186-0.155,0.341-0.324,0.477-0.529c0.286-0.431,0.436-0.98,0.4-1.498 c-0.076-1.094-0.927-2.075-2.028-2.234c-0.534-0.077-1.074,0.132-1.23,0.698c-0.129,0.47,0.161,1.153,0.698,1.23 c0.259,0.037,0.583,0.145,0.575,0.457c-0.01,0.397-0.518,0.583-0.747,0.835c-0.518,0.569-0.603,1.389-0.091,1.995 c0.217,0.257,0.899,0.602,0.88,0.994c-0.013,0.262-0.554,0.471-0.739,0.646c-0.443,0.418-0.658,1.036-0.493,1.632 c0.083,0.301,0.261,0.559,0.471,0.785c0.118,0.127,0.411,0.281,0.467,0.44c0.097,0.273-0.47,0.719-0.638,0.88 c-0.931,0.892,0.484,2.305,1.414,1.414c0.734-0.703,1.379-1.569,1.189-2.646C46.019,32.093,45.785,31.716,45.458,31.395z"></path><path fill="#df4bb1" d="M44.732,36.951c-0.067-0.052-0.135-0.104-0.202-0.156c-0.156-0.091-0.324-0.136-0.505-0.136 c-0.016,0.002-0.032,0.004-0.047,0.006c-0.138-0.005-0.266,0.024-0.385,0.086c-0.124,0.04-0.231,0.109-0.322,0.207 c-0.098,0.091-0.166,0.198-0.207,0.322c-0.063,0.119-0.091,0.248-0.086,0.385c0.012,0.089,0.024,0.177,0.036,0.266 c0.047,0.169,0.133,0.316,0.257,0.441c0.067,0.052,0.135,0.104,0.202,0.156c0.156,0.09,0.324,0.136,0.505,0.136 c0.016-0.002,0.032-0.004,0.047-0.006c0.138,0.005,0.266-0.023,0.385-0.086c0.124-0.04,0.231-0.109,0.322-0.207 c0.098-0.091,0.166-0.198,0.207-0.322c0.063-0.119,0.091-0.248,0.086-0.385c-0.012-0.089-0.024-0.177-0.036-0.266 C44.941,37.222,44.856,37.075,44.732,36.951z"></path><path fill="#399bdf" d="M41.885,14.537c-0.594-0.992-1.619-1.524-2.788-1.801c-0.218-0.085-0.442-0.155-0.668-0.223 c-0.187-1.661-0.825-3.198-2.508-3.947c-2.192-0.976-5.025-0.428-7.331-0.274c-5.586,0.373-11.151,1.011-16.682,1.875 c-0.434,0.068-0.71,0.286-0.855,0.568c-0.018,0.015-0.038,0.025-0.056,0.041c-0.418,0.373-0.708,0.938-0.794,1.488 c-0.115,0.738-0.054,1.492,0.045,2.237c-0.828,0.151-1.655,0.304-2.481,0.467c-0.109,0.005-0.216,0.03-0.326,0.061 c-0.084,0.017-0.168,0.03-0.252,0.047c-0.434,0.09-0.699,0.332-0.841,0.629c-0.246,0.244-0.455,0.526-0.601,0.823 c-0.361,0.736-0.465,1.504-0.293,2.309c0.012,0.058,0.036,0.111,0.052,0.168c0.022,0.118,0.038,0.237,0.067,0.353 c0.013,0.055,0.031,0.109,0.047,0.163c0.049,0.177,0.099,0.354,0.156,0.523c0.159,0.465,0.553,0.847,1.021,0.962 c0.518,0.318,1.151,0.434,1.746,0.477c0.107,0.008,0.214,0.001,0.322,0.004c0.169,0.015,0.34,0.019,0.512,0.016 c0.266,4.121,0.703,8.228,1.33,12.312C11.341,37.955,11.67,43.891,15.998,46c2.336,1.139,5.186,0.968,7.713,0.946 c2.822-0.025,5.692-0.12,8.487-0.531c1.552-0.228,3.04-0.739,4.154-1.731c0.449-0.286,0.87-0.615,1.222-1.01 c0.262-0.294,0.49-0.618,0.701-0.954c1.407-1.756,1.795-4.09,1.884-6.299c0.213-5.271,0.224-10.559,0.293-15.837 c0.076-0.04,0.157-0.066,0.232-0.111c1.079-0.644,1.893-1.735,2.062-2.993C42.892,16.395,42.583,15.342,41.885,14.537z"></path><path fill="#399bdf" d="M16.324,10.871c-0.227-1.247,0.33-2.62,1.319-3.403c1.343-1.062,3.47-1.115,5.099-1.286 c1.015-0.107,2.034-0.188,3.053-0.241c0.779-0.041,1.541-0.115,2.19,0.39c1.238,0.962,1.759,2.579,1.681,4.092 c-0.099,1.93,2.901,1.924,3,0c0.12-2.338-0.842-4.794-2.669-6.3c-2.131-1.757-5.033-1.188-7.577-0.907 c-2.481,0.275-5.201,0.506-7.104,2.312c-1.668,1.583-2.291,3.917-1.886,6.14c0.145,0.797,1.114,1.249,1.845,1.048 C16.115,12.486,16.47,11.671,16.324,10.871L16.324,10.871z"></path><path fill="#231f20" d="M11.193,15.097c8.569-1.412,17.23-2.22,25.912-2.428c0.642-0.015,0.645-1.015,0-1 c-8.772,0.21-17.52,1.037-26.178,2.464C10.294,14.237,10.562,15.201,11.193,15.097L11.193,15.097z"></path><path fill="#231f20" d="M39.892,19.51c-10.046,0.617-20.106,0.993-30.17,1.127c-0.643,0.009-0.645,1.009,0,1	c1.397-0.019,2.794-0.053,4.191-0.081c1.052,7.177,2,14.37,2.845,21.574c0.074,0.632,1.075,0.639,1,0	c-0.845-7.211-1.796-14.41-2.846-21.594c2.792-0.06,5.584-0.137,8.375-0.234c0.006,7.06,0.295,14.118,0.875,21.155	c0.052,0.637,1.053,0.642,1,0c-0.581-7.047-0.87-14.115-0.875-21.186c3.119-0.114,6.236-0.254,9.353-0.415	c-0.795,7.153-1.428,14.324-1.898,21.506c-0.042,0.643,0.958,0.64,1,0c0.47-7.201,1.106-14.39,1.903-21.562	c1.749-0.093,3.498-0.183,5.246-0.291C40.531,20.471,40.536,19.471,39.892,19.51z"></path><path fill="#fff" d="M9.064,19.462c5.792-0.564,11.595-1.012,17.405-1.344c1.919-0.11,1.932-3.11,0-3 c-5.81,0.332-11.612,0.78-17.405,1.344c-0.806,0.079-1.5,0.633-1.5,1.5C7.564,18.712,8.253,19.541,9.064,19.462L9.064,19.462z"></path><path fill="#99c93c" d="M3.382,11.912c0.74,0.569,1.538,1.059,2.38,1.462c0.246,0.118,0.499,0.176,0.771,0.101 c0.232-0.064,0.483-0.243,0.598-0.46c0.123-0.232,0.184-0.513,0.101-0.771c-0.076-0.236-0.227-0.486-0.46-0.598 c-0.842-0.403-1.639-0.894-2.38-1.462C4.2,10.038,3.84,10.024,3.621,10.084c-0.232,0.064-0.483,0.243-0.598,0.46 c-0.123,0.232-0.184,0.513-0.101,0.771c0.034,0.08,0.067,0.159,0.101,0.239C3.112,11.703,3.232,11.823,3.382,11.912L3.382,11.912z"></path><g><path fill="#99c93c" d="M5.927,5.58c0.388,0.367,0.491,0.738,0.309,1.112c-0.12,0.12-0.239,0.239-0.359,0.359 c0.01-0.007,0.021-0.015,0.031-0.022C5.504,6.977,5.1,6.924,4.697,6.872C5.688,8.12,6.679,9.368,7.67,10.616 c0.149,0.187,0.48,0.293,0.707,0.293c0.245,0,0.538-0.109,0.707-0.293c0.175-0.191,0.305-0.441,0.293-0.707 C9.365,9.627,9.259,9.421,9.085,9.201C8.093,7.954,7.102,6.706,6.111,5.458C5.856,5.138,5.23,5.07,4.899,5.302 C4.565,5.535,4.314,5.884,4.331,6.31c0.016,0.401,0.218,0.807,0.586,0.997c0.464,0.24,1.107,0.136,1.368-0.359 C6.528,6.49,6.423,5.836,5.927,5.58L5.927,5.58z"></path></g><g><path fill="#99c93c" d="M9.471,3.682C9.552,4.638,9.633,5.594,9.714,6.55c0.023,0.269,0.096,0.51,0.293,0.707 c0.173,0.173,0.458,0.304,0.707,0.293c0.504-0.023,1.047-0.442,1-1c-0.081-0.956-0.162-1.912-0.242-2.868 c-0.023-0.269-0.096-0.51-0.293-0.707c-0.173-0.173-0.458-0.304-0.707-0.293C9.967,2.705,9.424,3.124,9.471,3.682L9.471,3.682z"></path></g></svg>
                    </button></td>
                </tr>
            `;
            
            if (gasto.pago === 'sim' && tbodyPagos) {
                tbodyPagos.innerHTML += linha;
            } else if (gasto.pago === 'nao' && tbodyNaoPagos) {
                tbodyNaoPagos.innerHTML += linha;
            }
        });
    } catch (error) {
        console.error('Erro ao carregar gastos:', error);
    }
}

async function carregarGraficoComparativo() {
    try {
        const response = await fetch('api.php?tipo=total_pagos');
        const dados = await response.json();

        const response2 = await fetch('api.php?tipo=total_naopagos');
        const dados2 = await response2.json();
        
        const totalPagos = dados.total || 0;
        const totalNaoPagos = dados2.total || 0;
        
        const canvas = document.getElementById('graficoBarrasComparativo');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (window.graficoBarras) {
            window.graficoBarras.destroy();
        }
        
        window.graficoBarras = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pagos', 'Não Pagos'],
                datasets: [{
                    data: [totalPagos, totalNaoPagos],
                    backgroundColor: ['#00eaff', '#ff4a8f'],
                    borderRadius: 20,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                scales: { 
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)',
                            font: { size: 14 },
                            color: '#000000'
                        },
                        grid: {
                            color: '#000000'
                        },
                        ticks: {
                            color: '#000000'
                        }
                    },
                    x: {
                        grid: {
                            color: '#000000'
                        },
                        ticks: {
                            color: '#000000'
                        }
                    }
                }, 
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro:', error);
    }
}   

async function carregarGraficoPorCategoria() {
    try {
        const response = await fetch('api.php?tipo=categorias');
        const dados = await response.json();
        
        const categorias = dados.map(d => d.nome);
        const valores = dados.map(d => parseFloat(d.total));
        
        const canvas = document.getElementById('graficoPizzaCategorias');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (graficoPizza) graficoPizza.destroy();
        
        graficoPizza = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categorias,
                datasets: [{
                    data: valores,
                    backgroundColor: ['#ff4a71', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#ff7040', '#4aff40'],
                    borderColor: '#000000',        
                    borderWidth: 0,               
                    hoverBorderColor: '#000000',
                    hoverBorderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { 
                        callbacks: { 
                            label: (ctx) => `R$ ${ctx.raw.toFixed(2)}` 
                        } 
                    },
                    legend: {
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            color: '#000000'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar gráfico de categorias:', error);
    }
}

async function carregarGraficoPorMes() {
    try {
        const response = await fetch('api.php?tipo=meses');
        const dados = await response.json();
        
        const meses = dados.map(d => {
            const [ano, mes] = d.mes.split('-');
            return `${mes}/${ano}`;
        });
        const valores = dados.map(d => parseFloat(d.total));
        
        const canvas = document.getElementById('graficoLinhaMeses');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (graficoLinha) graficoLinha.destroy();
        
        graficoLinha = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Gastos (R$)',
                    data: valores,
                    borderColor: '#fb00e2',
                    backgroundColor: '#ff49ed31',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { 
                        callbacks: { 
                            label: (ctx) => `R$ ${ctx.raw.toFixed(2)}` 
                        } 
                    },
                    legend: {
                        display: false
                    }
                },
                scales: { 
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)',
                            font: { size: 14 },
                            color: '#000000'
                        },
                        grid: {
                            color: '#000000'
                        },
                        ticks: {
                            color: '#000000'
                        }
                    },
                    x: {
                        grid: {
                            color: '#000000'
                        },
                        ticks: {
                            color: '#000000'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar gráfico de meses:', error);
    }
}

async function salvarGasto(evento) {
    evento.preventDefault();
    
    const gasto = {
        nome: document.getElementById('nome').value,
        valor: document.getElementById('valor').value,
        data: document.getElementById('data').value,
        pago: document.getElementById('pagamento').value,
        categoria_id: parseInt(document.getElementById('categorias').value),
        tipo_pagamento: document.getElementById('tipo').value
    };
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gasto)
        });
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            document.getElementById('formGasto').reset();
            carregarTodosDados();
            alert('✅ Gasto salvo com sucesso!');
        } else {
            alert('❌ Erro ao salvar');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao conectar com o servidor');
    }
}

async function deletarGasto(id) {
    if (confirm('Tem certeza que quer excluir este gasto?')) {
        try {
            const response = await fetch(`api.php?id=${id}`, { method: 'DELETE' });
            const resultado = await response.json();
            
            if (resultado.sucesso) {
                carregarTodosDados();
                alert('✅ Gasto excluído!');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao excluir');
        }
    }
}

function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}