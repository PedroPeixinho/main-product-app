CREATE TABLE Fono (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE Paciente (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf_fono VARCHAR(14),
    FOREIGN KEY (cpf_fono) REFERENCES Fono(cpf) ON DELETE SET NULL
);

CREATE TABLE Exercicios (
    id SERIAL PRIMARY KEY,
    nome_exercicio VARCHAR(255) NOT NULL,
    repeticoes INT NOT NULL,
    texto_descritivo TEXT NOT NULL,
    video_exemplo VARCHAR(255),
    cpf_fono VARCHAR(14) NOT NULL,
    cpf_paciente VARCHAR(14) NOT NULL,
    data_execucao DATE NOT NULL,
    FOREIGN KEY (cpf_fono) REFERENCES Fono(cpf) ON DELETE CASCADE,
    FOREIGN KEY (cpf_paciente) REFERENCES Paciente(cpf) ON DELETE CASCADE
);

CREATE TABLE Exercicios_realizados (
    id SERIAL PRIMARY KEY,
    id_exercicio INT NOT NULL,
    nome_exercicio VARCHAR(255) NOT NULL,
    cpf_paciente VARCHAR(14) NOT NULL,
    video_execucao VARCHAR(255),
    duracao_video INTERVAL,
    nota_execucao DECIMAL(3,2),
    data_execucao DATE NOT NULL,
    FOREIGN KEY (id_exercicio) REFERENCES Exercicios(id) ON DELETE CASCADE,
    FOREIGN KEY (cpf_paciente) REFERENCES Paciente(cpf) ON DELETE CASCADE
);

-- Inserindo Fonoaudiólogos
INSERT INTO Fono (cpf, nome) VALUES
('123.456.789-00', 'Dra. Ana Souza'),
('987.654.321-00', 'Dr. Carlos Lima'),
('555.666.777-00', 'Dra. Mariana Rocha');

-- Inserindo Pacientes
INSERT INTO Paciente (cpf, nome, cpf_fono) VALUES
('111.222.333-44', 'Pedro Santos', '123.456.789-00'),
('222.333.444-55', 'Lucas Almeida', '123.456.789-00'),
('333.444.555-66', 'Juliana Costa', '987.654.321-00'),
('444.555.666-77', 'Fernanda Ribeiro', '555.666.777-00');

-- Inserindo Exercícios
INSERT INTO Exercicios (nome_exercicio, repeticoes, texto_descritivo, video_exemplo, cpf_fono, cpf_paciente, data_execucao) VALUES
('Exercício de Dicção', 10, '1 ) Realizar 10x de cada lado, 1 vez ao dia
2 ) Tocar ponta da língua nas laterais dos lábios

Após realizar a quantidade pedida no exercício, o próximo será liberado.', 'https://exemplo.com/video1', '123.456.789-00', '111.222.333-44', '2024-03-10'),
('Respiração Diafragmática', 5, 'Treino de controle respiratório.', 'https://exemplo.com/video2', '123.456.789-00', '222.333.444-55', '2024-03-11'),
('Alongamento Vocal', 7, 'Aquecer a voz antes das sessões.', 'https://exemplo.com/video3', '987.654.321-00', '333.444.555-66', '2024-03-12');

-- Inserindo Exercícios Realizados
INSERT INTO Exercicios_realizados (id_exercicio, nome_exercicio, cpf_paciente, video_execucao, duracao_video, nota_execucao, data_execucao) VALUES
(1, 'Exercício de Dicção', '111.222.333-44', 'https://exemplo.com/video_pedro', '00:02:30', 8.5, '2024-03-10'),
(2, 'Respiração Diafragmática', '222.333.444-55', 'https://exemplo.com/video_lucas', '00:03:15', 9.0, '2024-03-11'),
(3, 'Alongamento Vocal', '333.444.555-66', 'https://exemplo.com/video_juliana', '00:01:45', 7.8, '2024-03-12');