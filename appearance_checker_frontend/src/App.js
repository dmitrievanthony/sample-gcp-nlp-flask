import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.jpg';
import './App.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';

function App() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(undefined);
  const [overallSentimentResult, setOverallSentimentResult] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    fetch("/api/sentiment", {
        method: 'POST',
        headers: {
          "Content-type": "application/text; charset=UTF-8"
        },
        body: text
    }).then(res => res.json())
      .then(
        (result) => {
          setAnalysisResult(result);
          setOverallSentimentResult(result.documentSentiment.score);
          setShow(true);
        },
        (error) => {
          console.log(error)
          setShow(false);
        }
      )
  };
  const handleChange = (event) => setText(event.target.value);

  var html = undefined
  if (analysisResult != undefined && show) {
    const calculateBackgroundColor = (s) => s.sentiment.score >= 0 ? "rgba(0, 255, 0, " + s.sentiment.magnitude + ")" : "rgba(255, 0, 0, " + s.sentiment.magnitude + ")";
    const items = analysisResult.sentences.map((s) => <span style={{backgroundColor: calculateBackgroundColor(s)}}>{s.text.content}</span>)
    html = <div>{items}</div>
  }

  return (
    <div className="app">
      <header className="header">
        <img src={logo} className="logo" alt="Deutsche Bank" />
        <div className="title">Appearance Checker</div>
      </header>
      <div className="body">
        <Tabs defaultActiveKey="new" id="uncontrolled-tab-example">
          <Tab eventKey="new" title="Check New Press Release">
            <div className="text-area-label">To make sentiment analysis of the upcoming press release please type press release text into the following text area and press "Analyse" button:</div>
            <textarea id="text-area" onChange={handleChange}/>
            <div className="control">
                <Button variant="primary" onClick={handleShow}>Analyse</Button>
            </div>
          </Tab>
          <Tab eventKey="historical" title="View Historical Press Releases">
            BBB
          </Tab>
        </Tabs>
      </div>

      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Results of analysis (overall sentiment is {overallSentimentResult >= 0 ? <span style={{color: 'green'}}>positive</span> : <span style={{color: 'red'}}>negative</span>} with score {overallSentimentResult})</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <pre>{html}</pre>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
