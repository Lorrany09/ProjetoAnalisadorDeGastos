const categoria = ["Habitação", "Alimentação", "Saúde", "Cuidados pessoais", "Lazer", "Educação", "Tecnologia"];
const pagamentos = ["Dinheiro", "Cartão de Crédito", "Boleto", "PIX"];

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
        const div = document.getElementById('aviso');
        
        if (resultado.sucesso) {
            document.getElementById('formGasto').reset();
            carregarTodosDados();
            div.classList.add('avisoSucesso');
            div.innerHTML = `
                <p>Gasto salvo com sucesso!</p>
            `;
            setTimeout(() => div.innerHTML = '', 3000);
            setTimeout(() => div.classList.remove('avisoSucesso'), 3000);
        } else {
            div.classList.add('avisoErro');
            div.innerHTML = `
                <p>Erro ao salvar!</p>
            `;
            setTimeout(() => div.innerHTML = '', 3000);
            setTimeout(() => div.classList.remove('avisoErro'), 3000);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao conectar com o servidor');
    }
}