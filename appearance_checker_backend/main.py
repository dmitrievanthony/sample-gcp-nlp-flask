from flask import Flask, redirect, render_template, request
from google.cloud import language_v1 as language

app = Flask(__name__)

@app.route("/api/sentiment")
def sentiment():
    text = request.data.decode("utf-8")
    client = language.LanguageServiceClient()
    document = language.Document(content=text, type_=language.Document.Type.PLAIN_TEXT)
    sentiment_analysis_result = client.analyze_sentiment(document=document)
    return sentiment_analysis_result

@app.route("/api/entities", methods=["POST"])
def entities():
    text = request.data.decode("utf-8")
    client = language.LanguageServiceClient()
    document = language.Document(content=text, type_=language.Document.Type.PLAIN_TEXT)
    sentiment_analysis_result = client.analyze_entities(document=document)
    return sentiment_analysis_result

if __name__ == "__main__":
    # This is used when running locally. Gunicorn is used to run the
    # application on Google App Engine. See entrypoint in app.yaml.
    app.run(host="127.0.0.1", port=8081, debug=True)
