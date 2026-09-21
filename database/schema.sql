-- Criar o banco de dados do sistema
CREATE DATABASE IF NOT EXISTS sistema_digitalizacao;
USE sistema_digitalizacao;

-- Tabela de Operadores (Quem realiza o trabalho)
CREATE TABLE IF NOT EXISTS operadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Caixas/Lotes de Documentos
CREATE TABLE IF NOT EXISTS caixas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_caixa VARCHAR(50) NOT NULL UNIQUE,
    tipo_documento VARCHAR(100) NOT NULL,
    status ENUM('Pendente', 'Em Preparacao', 'Em Digitalizacao', 'Concluido') DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Etapas e Registros Operacionais (Contagem de folhas, PDF e tempos)
CREATE TABLE IF NOT EXISTS registros_etapas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    caixa_id INT NOT NULL,
    operador_id INT NOT NULL,
    etapa ENUM('Preparacao', 'Digitalizacao') NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    qtd_folhas INT DEFAULT 0,
    caminho_pdf VARCHAR(255), -- Salva o caminho do arquivo no servidor/storage
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caixa_id) REFERENCES caixas(id) ON DELETE CASCADE,
    FOREIGN KEY (operador_id) REFERENCES operadores(id) ON DELETE CASCADE
);