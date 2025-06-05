from flask import Flask, request, jsonify
import pdfplumber

app = Flask(__name__)

def extract_pdf_text(file_stream):
    """Return extracted text from a PDF file stream using pdfplumber."""
    text_parts = []
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    uploaded_file = request.files.get('pdfUpload')
    if not uploaded_file:
        return jsonify({'error': 'No file uploaded'}), 400

    text = extract_pdf_text(uploaded_file)
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)
