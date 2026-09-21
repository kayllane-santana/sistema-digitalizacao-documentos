import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Permite chamadas da interface web (HTML/JS) para esta API

# Pasta onde os PDFs serão salvos localmente
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configuração de conexão com o banco MySQL
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Insira a senha do seu MySQL se houver
    'database': 'sistema_digitalizacao'
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# Rota 1: Cadastrar Nova Caixa
@app.route('/api/caixas', methods=['POST'])
def cadastrar_caixa():
    data = request.json
    numero_caixa = data.get('numero_caixa')
    tipo_documento = data.get('tipo_documento')

    if not numero_caixa or not tipo_documento:
        return jsonify({'erro': 'Campos obrigatórios ausentes'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO caixas (numero_caixa, tipo_documento) VALUES (%s, %s)"
        cursor.execute(query, (numero_caixa, tipo_documento))
        conn.commit()
        caixa_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({'mensagem': 'Caixa cadastrada com sucesso!', 'id': caixa_id}), 201
    except mysql.connector.Error as err:
        return jsonify({'erro': str(err)}), 500

# Rota 2: Listar Caixas (Para preencher o menu pendente)
@app.route('/api/caixas', methods=['GET'])
def listar_caixas():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, numero_caixa, tipo_documento FROM caixas")
        caixas = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(caixas), 200
    except mysql.connector.Error as err:
        return jsonify({'erro': str(err)}), 500

# Rota 3: Registrar Etapa e Upload do PDF
@app.route('/api/etapas', methods=['POST'])
def registrar_etapa():
    caixa_id = request.form.get('caixa_id')
    operador_id = request.form.get('operador_id', 1)  # Padrão operador 1 para testes
    etapa = request.form.get('etapa')
    qtd_folhas = request.form.get('qtd_folhas')
    pdf_file = request.files.get('pdf')

    caminho_pdf = None
    if pdf_file:
        caminho_pdf = os.path.join(app.config['UPLOAD_FOLDER'], pdf_file.filename)
        pdf_file.save(caminho_pdf)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO registros_etapas 
            (caixa_id, operador_id, etapa, data_inicio, data_fim, qtd_folhas, caminho_pdf)
            VALUES (%s, %s, %s, NOW(), NOW(), %s, %s)
        """
        cursor.execute(query, (caixa_id, operador_id, etapa, qtd_folhas, caminho_pdf))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'mensagem': 'Etapa e arquivo PDF registrados com sucesso!'}), 201
    except mysql.connector.Error as err:
        return jsonify({'erro': str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)