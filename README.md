# 📄 Sistema Unificado de Gestão e Digitalização de Documentos

> **Projeto de Portfólio - Engenharia de Software**  
> *Solução Full Stack desenvolvida para otimizar, padronizar e unificar o fluxo operacional de digitalização de documentos.*

---

## 📌 Visão Geral do Problema & Solução

### 🔴 O Cenário Atual (Problema)
No processo tradicional de digitalização de documentos, os operadores precisam navegar entre múltiplos sistemas desconectados para realizar uma única tarefa:
1. **Google Forms / Formulários dispersos:** Para registrar horários, operador, número da caixa e contagem de folhas.
2. **Scandall Pro:** Software utilizado para realizar a captura e digitalização das folhas físicas.
3. **Amazon S3 / Repositório isolado:** Para fazer o upload manual e armazenamento dos arquivos PDF gerados.

Essa descentralização gera retrabalho, perda de tempo no alternar de janelas, risco de erro humano no preenchimento manual e falta de centralização das métricas de produtividade.

### 🟢 A Solução Proposta
Desenvolvimento de uma **Plataforma Web Unificada** que integra todo o ciclo de vida do processamento de documentos em uma única interface:
* Registro de início e fim de etapas com cronometragem.
* Controle de contagem de folhas e operador responsável.
* Upload e vínculo direto do arquivo PDF digitalizado.
* Armazenamento seguro de metadados em banco de dados relacional (**MySQL**).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Python (Flask / FastAPI)
- **Banco de Dados:** MySQL 8.0
- **Modelagem & Diagramação:** UML, Mermaid.js, MER (Modelo Entidade-Relacionamento)
- **Gerenciamento de Código:** Git & GitHub

---

## 📋 Levantamento de Requisitos

### Requisitos Funcionais (RF)
- **[RF01] Cadastrar Caixa/Lote:** O sistema deve permitir o registro de um novo lote com número da caixa, tipo de documento e operador responsável.
- **[RF02] Registrar Etapa de Processamento:** O sistema deve permitir iniciar e finalizar as etapas de `Preparação` e `Digitalização`, registrando os horários de início e término.
- **[RF03] Contagem de Folhas:** O sistema deve permitir registrar o total de folhas processadas na etapa.
- **[RF04] Anexar PDF Digitalizado:** O sistema deve permitir o upload do arquivo PDF correspondente à caixa digitalizada e vincular o caminho do arquivo ao registro do banco.
- **[RF05] Consultar Histórico:** O sistema deve exibir uma listagem com os lotes processados e seus respectivos status.

### Requisitos Não Funcionais (RNF)
- **[RNF01] Armazenamento Eficiente:** O banco de dados armazena apenas os caminhos/metadados do PDF, salvando o arquivo físico em diretório de storage.
- **[RNF02] Usabilidade:** A interface deve ser simples, responsiva e unificada em tela única para minimizar cliques e trocas de janelas.
- **[RNF03] Integridade dos Dados:** Relacionamento com chaves estrangeiras (`FOREIGN KEY`) para garantir consistência entre operadores, caixas e documentos.

---

## 📌 Casos de Uso

### [UC01] Processar Caixa de Documentos

* **Ator Principal:** Operador de Digitalização.
* **Pré-condições:** O operador deve possuir a caixa física de documentos em mãos e acesso ao sistema Web.

#### Fluxo Principal:
1. O operador informa o **Número da Caixa**, **Operador Responsável** e o **Tipo de Documento**.
2. O operador seleciona a etapa a ser realizada (`Preparação` ou `Digitalização`).
3. O operador clica em **"Iniciar Etapa"** (o sistema registra o timestamp de início).
4. O operador executa o trabalho físico (higienização/preparação das folhas ou passagem no scanner).
5. O operador digita a **Quantidade de Folhas** processadas.
6. O operador anexa o arquivo **PDF** gerado pelo scanner (obrigatório na etapa de digitalização).
7. O operador clica em **"Finalizar Registro"**.
8. O sistema salva o arquivo PDF no storage e grava os metadados e logs no banco de dados MySQL.

#### Fluxo Alternativo (Etapa de Preparação):
- No passo 6, caso a etapa selecionada seja `Preparação`, o anexo do arquivo PDF é opcional/desativado.
- O sistema registra a contagem de folhas e a duração da etapa de preparação.

---

## 🔄 Fluxograma do Processo Operacional

```mermaid
flowchart TD
    A([📦 Chegada da Caixa Física]) --> B[Abrir Sistema Web]
    B --> C[Preencher Número da Caixa, Operador e Tipo de Doc]
    C --> D{Qual a Etapa?}
    
    %% Fluxo de Preparação
    D -->|Preparação| E[Clique em 'Iniciar Preparação']
    E --> F[Higienizar e Organizar Folhas]
    F --> G[Informar Qtd de Folhas e Clicar 'Finalizar']
    G --> H[Salvar Registro no MySQL]
    
    %% Fluxo de Digitalização
    D -->|Digitalização| I[Clique em 'Iniciar Digitalização']
    I --> J[Digitalizar Documentos no Scanner]
    J --> K[Anexar o Arquivo PDF Gerado]
    K --> L[Informar Qtd de Folhas e Clicar 'Finalizar']
    L --> M[Salvar Arquivo PDF no Storage + Metadados no MySQL]
    
    H --> N([🏁 Caixa Pronta para Próxima Fase])
    M --> N