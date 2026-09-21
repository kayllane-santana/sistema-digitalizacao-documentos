const API_URL = 'http://127.0.0.1:5000/api';

const formCaixa = document.getElementById('form-caixa');
const formEtapa = document.getElementById('form-etapa');
const selectCaixa = document.getElementById('select-caixa');

// Carrega as caixas vindas do banco de dados ao abrir a página
document.addEventListener('DOMContentLoaded', carregarCaixas);

async function carregarCaixas() {
    try {
        const response = await fetch(`${API_URL}/caixas`);
        if (!response.ok) throw new Error('Erro ao buscar caixas');
        
        const caixas = await response.json();
        
        selectCaixa.innerHTML = '<option value="">Selecione uma caixa...</option>';
        caixas.forEach(caixa => {
            const option = document.createElement('option');
            option.value = caixa.id;
            option.textContent = `${caixa.numero_caixa} - ${caixa.tipo_documento}`;
            selectCaixa.appendChild(option);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 1. Cadastrar Caixa via API REST
formCaixa.addEventListener('submit', async function (event) {
    event.preventDefault();

    const numeroCaixa = document.getElementById('numero-caixa').value;
    const tipoDocumento = document.getElementById('tipo-documento').value;

    try {
        const response = await fetch(`${API_URL}/caixas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numero_caixa: numeroCaixa,
                tipo_documento: tipoDocumento
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.mensagem);
            formCaixa.reset();
            carregarCaixas(); // Atualiza o menu suspenso
        } else {
            alert(`Erro: ${result.erro}`);
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor Python!');
        console.error(error);
    }
});

// 2. Registrar Etapa com Upload de PDF via FormData
formEtapa.addEventListener('submit', async function (event) {
    event.preventDefault();

    const caixaId = selectCaixa.value;
    const etapa = document.getElementById('etapa').value;
    const qtdFolhas = document.getElementById('qtd-folhas').value;
    const arquivoPdf = document.getElementById('arquivo-pdf').files[0];

    if (!caixaId) {
        alert('Por favor, selecione uma caixa!');
        return;
    }

    const formData = new FormData();
    formData.append('caixa_id', caixaId);
    formData.append('etapa', etapa);
    formData.append('qtd_folhas', qtdFolhas);
    if (arquivoPdf) {
        formData.append('pdf', arquivoPdf);
    }

    try {
        const response = await fetch(`${API_URL}/etapas`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.mensagem);
            formEtapa.reset();
        } else {
            alert(`Erro: ${result.erro}`);
        }
    } catch (error) {
        alert('Erro ao enviar etapa para o servidor!');
        console.error(error);
    }
}); 