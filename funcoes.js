const categoria = ["Habitação", "Alimentação", "Saúde", "Cuidados pessoais", "Lazer", "Educação"];
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
    carregarCategorias();
    carregarPagamentos();
    carregarTodosDados();
    document.getElementById('formGasto').addEventListener('submit', salvarGasto);
});

async function carregarTodosDados() {
    await carregarListaGastos();
    await carregarGraficoPorCategoria();
    await carregarGraficoPorMes();
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
                    <td><button class="deletar" onclick="deletarGasto(${gasto.id})">🗑️</button></td>
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
                    backgroundColor: ['#ff4a71', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#ff7040']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { callbacks: { label: (ctx) => `R$ ${ctx.raw.toFixed(2)}` } }
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
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { callbacks: { label: (ctx) => `R$ ${ctx.raw.toFixed(2)}` } }
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