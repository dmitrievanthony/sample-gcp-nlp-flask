from flask import Flask, redirect, render_template, request, json
from google.cloud import language_v1 as language
import proto

app = Flask(__name__)

with open('data.json', 'r') as file:
    historical_data = json.loads(file.read())

@app.route("/api/sentiment", methods=["POST"])
def sentiment():
    text = request.data.decode("utf-8")
    print("Sentiment ", text)
    client = language.LanguageServiceClient()
    document = language.Document(content=text, type_=language.Document.Type.PLAIN_TEXT)
    sentiment_analysis_result = client.analyze_sentiment(document=document)
    return proto.Message.to_json(sentiment_analysis_result)

@app.route("/api/entities", methods=["POST"])
def entities():
    text = request.data.decode("utf-8")
    print("Entities ", text)
    client = language.LanguageServiceClient()
    document = language.Document(content=text, type_=language.Document.Type.PLAIN_TEXT)
    sentiment_analysis_result = client.analyze_entities(document=document)
    return proto.Message.to_json(sentiment_analysis_result)

@app.route("/api/historical_links", methods=["GET"])
def historical_links():
    result = list(map(lambda row: {'link': row['link'], 'date': row['date']}, historical_data))
    return json.dumps(result)

if __name__ == "__main__":
    # This is used when running locally. Gunicorn is used to run the
    # application on Google App Engine. See entrypoint in app.yaml.
    app.run(host="127.0.0.1", port=8081, debug=True)
