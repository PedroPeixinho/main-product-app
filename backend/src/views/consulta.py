import sqlite3

# Conectar ao banco de dados
connection = sqlite3.connect("database.db")
cursor = connection.cursor()

# CPF do paciente que você deseja consultar
cpf_paciente = "12345678900"

# Consulta SQL para buscar os exercícios realizados
query = """
SELECT 
    exercicios_realizados.nome_exercicio, 
    exercicios_realizados.data, 
    exercicios_realizados.nota_execucao
FROM exercicios_realizados
INNER JOIN paciente ON exercicios_realizados.cpf_paciente = paciente.cpf
WHERE paciente.cpf = ?
"""

# Executar a consulta
cursor.execute(query, (cpf_paciente,))
resultados = cursor.fetchall()

# Exibir os resultados
if resultados:
    print("Exercícios realizados pelo paciente com CPF", cpf_paciente)
    for row in resultados:
        print(f"Nome do exercício: {row[0]}, Data: {row[1]}, Nota: {row[2]}")
else:
    print(f"Nenhum exercício encontrado para o paciente com CPF {cpf_paciente}")

# Fechar a conexão
connection.close()