import sqlite3

# Conectar (ou criar) o banco de dados
connection = sqlite3.connect("database.db")

# Criar um cursor para executar comandos SQL
cursor = connection.cursor()

# Criar a tabela "paciente"
cursor.execute("""
CREATE TABLE IF NOT EXISTS paciente (
    cpf_fono TEXT NOT NULL,
    nome TEXT NOT NULL,
    cpf TEXT PRIMARY KEY
)
""")

# Criar a tabela "exercicios_realizados"
cursor.execute("""
CREATE TABLE IF NOT EXISTS exercicios_realizados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_exercicio INTEGER NOT NULL,
    nome_exercicio TEXT NOT NULL,
    duracao_video REAL NOT NULL,
    data TEXT NOT NULL,
    execucao TEXT NOT NULL,
    nota_execucao REAL NOT NULL,
    cpf_paciente TEXT NOT NULL,
    FOREIGN KEY (cpf_paciente) REFERENCES paciente (cpf)
)
""")

# Salvar as alterações e fechar a conexão
connection.commit()
connection.close()

print("Banco de dados atualizado com sucesso!")