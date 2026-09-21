// Array em memória para simular o armazenamento local de caixas cadastradas
const caixasCadastradas = [];

// Seleção dos elementos do HTML
const formCaixa = document.getElementById('form-caixa');
const formEtapa = document.getElementById('form-etapa');
const selectCaixa = document.getElementById('select-caixa');

// 1. Evento para cadastrar uma nova caixa
formCaixa.addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o recarregamento padrão da página

    const numeroCaixa = document.getElementById('numero-caixa').value;
    const tipoDocumento = document.getElementById('tipo-documento').value;

    // Guardar no array local
    const novaCaixa = {
        id: Date.now(),
        numero: numeroCaixa,
        tipo: tipoDocumento
    };

    caixasCadastradas.push(novaCaixa);

    // Atualizar a lista do menu pendente (select) na segunda seção
    atualizarSelectCaixas();

    alert(`Caixa ${numeroCaixa} cadastrada com sucesso!`);
    formCaixa.reset(); // Limpa os campos do formulário
});

// Função para preencher o menu pendente de caixas dinamicamente
function atualizarSelectCaixas() {
    selectCaixa.innerHTML = '<option value="">Selecione uma caixa...</option>';

    caixasCadastradas.forEach(caixa => {
        const option = document.createElement('option');
        option.value = caixa.id;
        option.textContent = `${caixa.numero} - ${caixa.tipo}`;
        selectCaixa.appendChild(option);
    });
}

// 2. Evento para registrar a etapa do processo
formEtapa.addEventListener('submit', function (event) {
    event.preventDefault();

    const caixaId = selectCaixa.value;
    const etapa = document.getElementById('etapa').value;
    const qtdFolhas = document.getElementById('qtd-folhas').value;
    const arquivoPdf = document.getElementById('arquivo-pdf').files[0];

    if (!caixaId) {
        alert('Por favor, selecione uma caixa!');
        return;
    }

    const nomeArquivo = arquivoPdf ? arquivoPdf.name : 'Nenhum arquivo anexado';

    console.log('Registro Salvo:', {
        caixaId,
        etapa,
        qtdFolhas,
        arquivo: nomeArquivo
    });

    alert(`Etapa de ${etapa} registrada com sucesso!\nFolhas: ${qtdFolhas}\nArquivo: ${nomeArquivo}`);
    formEtapa.reset();
});