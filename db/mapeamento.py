import sqlite3
import os

# Conectar ao banco de dados
connection = sqlite3.connect("database.db")
cursor = connection.cursor()

# Inserir ou atualizar o paciente em uma única query
cpf_paciente = "12345678900"
dia_consulta = 2
status = "emAcompanhamento"
horario_consulta = "14:30"
avatar_url = "https://avatars.githubusercontent.com/u/55458349?v=4"

cursor.execute("""
INSERT INTO paciente (cpf_fono, nome, cpf, dia_consulta, status, horario_consulta, avatar_url)
VALUES ('98765432100', 'Miguel Oliveira', ?, ?, ?, ?, ?)
ON CONFLICT(cpf) DO UPDATE SET
    dia_consulta = excluded.dia_consulta,
    status = excluded.status,
    horario_consulta = excluded.horario_consulta,
    avatar_url = excluded.avatar_url
""", (cpf_paciente, dia_consulta, status, horario_consulta, avatar_url))

# Inserir uma dúvida na tabela 'duvidas'
data_hora = "Sat Mar 29 2025 16:07:10 GMT-0300 (Brasilia Standard Time)"
mensagem = "Como melhorar minha execução nos exercícios?"

cursor.execute("""
INSERT INTO duvidas (cpf_paciente, data_hora, mensagem)
VALUES (?, ?, ?)
""", (cpf_paciente, data_hora, mensagem))
# Inserir 5 pacientes e 3 dúvidas para cada um
pacientes = [
    ("11111111111", "João Silva", 1, "emAcompanhamento", "09:00", ""),
    ("22222222222", "Maria Santos", 2, "emAvaliacao", "10:30", ""),
    ("33333333333", "Carlos Lima", 3, "concluido", "11:45", ""),
    ("44444444444", "Ana Costa", 4, "emAcompanhamento", "13:15", ""),
    ("55555555555", "Pedro Almeida", 5, "emAvaliacao", "15:00", ""),
]

for paciente in pacientes:
    cpf, nome, dia_consulta, status, horario_consulta, avatar_url = paciente
    cursor.execute("""
    INSERT INTO paciente (cpf_fono, nome, cpf, dia_consulta, status, horario_consulta, avatar_url)
    VALUES ('98765432100', ?, ?, ?, ?, ?, ?)
    ON CONFLICT(cpf) DO UPDATE SET
        dia_consulta = excluded.dia_consulta,
        status = excluded.status,
        horario_consulta = excluded.horario_consulta,
        avatar_url = excluded.avatar_url
    """, (nome, cpf, dia_consulta, status, horario_consulta, avatar_url))

    duvidas = [
        (cpf, "2025-03-29 10:00:00", f"Dúvida 1 do paciente {nome}"),
        (cpf, "2025-03-29 11:00:00", f"Dúvida 2 do paciente {nome}"),
        (cpf, "2025-03-29 12:00:00", f"Dúvida 3 do paciente {nome}"),
    ]

    cursor.executemany("""
    INSERT INTO duvidas (cpf_paciente, data_hora, mensagem)
    VALUES (?, ?, ?)
    """, duvidas)

# Inserir consultas para os pacientes
consultas = [
    ("11111111111", "2024-03-30 09:00:00"),
    ("22222222222", "2025-03-30 10:30:00"),
    ("33333333333", "2023-03-30 11:45:00"),
    ("44444444444", "2025-04-02 13:15:00"),
    ("55555555555", "2025-03-30 15:00:00"),
]

cursor.executemany("""
INSERT INTO consultas (cpf_paciente, data_hora)
VALUES (?, ?)
""", consultas)

# Inserir dois exercícios realizados pelo paciente
exercicios = [
    (1, 'Lateralizar', 12.5, '2025-03-28', 'Completo', 4.5, cpf_paciente),
    (2, 'Afilar', 8.0, '2025-03-28', 'Completo', 3.8, cpf_paciente)
]

cursor.executemany("""
INSERT INTO exercicios_realizados (id_exercicio, nome_exercicio, duracao_video, data, execucao, nota_execucao, cpf_paciente)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", exercicios)

# Salvar as alterações e fechar a conexão
connection.commit()
connection.close()

print("Dados inseridos com sucesso!")