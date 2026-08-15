import { useRef, useState } from "react";

import {
  uploadDocument,
  simplifyText,
  generateQuiz,
  generateFlashcards,
  askDocument,
  askVoice,
} from "../services/api";

function Workspace({ onClose }) {
  const [activeTool, setActiveTool] = useState("upload");

  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [text, setText] = useState("");
  const [simplifiedTextResult, setSimplifiedTextResult] = useState("");
  const [simplifyLevel, setSimplifyLevel] = useState("simple");

  const [quizLevel, setQuizLevel] = useState("simple");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const [flashcards, setFlashcards] = useState(null);

const [flashcardLevel, setFlashcardLevel] =
  useState("simple");

const [numFlashcards, setNumFlashcards] =
  useState(10);

const [currentFlashcard, setCurrentFlashcard] =
  useState(0);

const [showFlashcardAnswer, setShowFlashcardAnswer] =
  useState(false);

const [knownFlashcards, setKnownFlashcards] =
  useState([]);

const [reviewFlashcards, setReviewFlashcards] =
  useState([]);

  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [answer, setAnswer] = useState("");

  /* ================================
     VOICE RECORDING
  ================================= */

  const [audioFile, setAudioFile] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  /* ================================
     DOCUMENT UPLOAD
  ================================= */

  const handleUpload = async () => {
    clearStatus();

    if (!selectedFile) {
      setError("Please select a PDF or DOCX file.");
      return;
    }

    try {
      setUploading(true);

      const result = await uploadDocument(selectedFile);

      setDocumentName(result.filename);

      setMessage(
        `Document uploaded successfully. ${result.chunks_stored} chunks stored.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ================================
     SIMPLIFY
  ================================= */

  const handleSimplify = async () => {
    clearStatus();

    if (!text.trim()) {
      setError("Please enter some text to simplify.");
      return;
    }

    try {
      setLoading(true);

      const result = await simplifyText(
        text,
        simplifyLevel
      );

      setSimplifiedTextResult(
        result.simplified_text
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     QUIZ
  ================================= */

  const handleQuiz = async () => {
    clearStatus();

    if (!documentName) {
      setError("Please upload a document first.");
      return;
    }

    try {
      setLoading(true);

      const result = await generateQuiz(
        documentName,
        quizLevel,
        Number(numQuestions)
      );

      setQuiz(result.quiz);
      setSelectedAnswers({});
      setSubmittedAnswers({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     FLASHCARDS
  ================================= */
  const goToNextFlashcard = () => {
  setShowFlashcardAnswer(false);

  setCurrentFlashcard(
    (previous) => previous + 1
  );
};
  const handleFlashcards = async () => {

  if (!documentName) {
    setError("Please upload a document first.");
    return;
  }

  setLoading(true);
  setError(null);

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/generate-flashcards",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          document_name: documentName,
          level: flashcardLevel,
          num_cards: Number(numFlashcards),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to generate flashcards."
      );
    }

    setFlashcards(data.flashcards);

    setCurrentFlashcard(0);
    setShowFlashcardAnswer(false);
    setKnownFlashcards([]);
    setReviewFlashcards([]);

  } catch (error) {

    console.error(
      "FLASHCARD ERROR:",
      error
    );

    setError(
      error.message ||
      "Failed to generate flashcards."
    );

  } finally {

    setLoading(false);

  }
};

  /* ================================
     ASK DOCUMENT
  ================================= */

  const handleAskDocument = async () => {
    clearStatus();

    if (!documentName) {
      setError("Please upload a document first.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);

      const result = await askDocument(
        question,
        documentName,
        language
      );

      setAnswer(result.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     START RECORDING
  ================================= */

  const startRecording = async () => {
    clearStatus();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Microphone recording is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: mediaRecorder.mimeType || "audio/webm",
          }
        );

        const extension =
          mediaRecorder.mimeType.includes("ogg")
            ? "ogg"
            : "webm";

        const file = new File(
          [audioBlob],
          `omnilearn-recording-${Date.now()}.${extension}`,
          {
            type:
              mediaRecorder.mimeType ||
              "audio/webm",
          }
        );

        setAudioFile(file);

        stream
          .getTracks()
          .forEach((track) => track.stop());
      };

      mediaRecorder.start();

      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingTime(
            (previous) => previous + 1
          );
        }, 1000);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to access your microphone. Please allow microphone permission."
      );
    }
  };

  /* ================================
     STOP RECORDING
  ================================= */

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    clearInterval(
      recordingTimerRef.current
    );
  };

  /* ================================
     SEND VOICE
  ================================= */

  const handleVoice = async () => {
    clearStatus();

    if (!audioFile) {
      setError(
        "Please record a question or select an audio file."
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await askVoice(audioFile);

      setVoiceResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     FORMAT TIMER
  ================================= */

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <section className="learning-workspace">

      {/* HEADER */}

      <div className="learning-workspace-header">

        <div>
          <p className="workspace-tag">
            OMNILEARN WORKSPACE
          </p>

          <h2>
            Your <span>Learning Hub.</span>
          </h2>

          <p>
            Upload your study material and
            choose how you want to learn.
          </p>
        </div>

        <button
          className="workspace-close"
          onClick={onClose}
        >
          CLOSE ✕
        </button>

      </div>


      {/* DOCUMENT STATUS */}

      {documentName && (
        <div className="document-status">
          <span>DOCUMENT</span>
          <strong>{documentName}</strong>
        </div>
      )}


      {/* STATUS */}

      {message && (
        <div className="workspace-message">
          {message}
        </div>
      )}

      {error && (
        <div className="workspace-error">
          {error}
        </div>
      )}


      {/* TOOLS */}

      <div className="learning-tools">

        <button
          className={`learning-tool ${
            activeTool === "upload"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveTool("upload");
            clearStatus();
          }}
        >
          <span>01</span>
          <h3>DOCUMENT UPLOAD</h3>
          <p>
            Upload PDF or DOCX study material.
          </p>
        </button>


        <button
          className={`learning-tool ${
            activeTool === "simplify"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveTool("simplify");
            clearStatus();
          }}
        >
          <span>02</span>
          <h3>SIMPLIFY</h3>
          <p>
            Make difficult content easier
            to understand.
          </p>
        </button>


        <button
          className={`learning-tool ${
            activeTool === "quiz"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveTool("quiz");
            clearStatus();
          }}
        >
          <span>03</span>
          <h3>QUIZ GENERATOR</h3>
          <p>
            Generate quizzes at three
            difficulty levels.
          </p>
        </button>


        <button
          className={`learning-tool ${
            activeTool === "flashcards"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveTool("flashcards");
            clearStatus();
          }}
        >
          <span>04</span>
          <h3>FLASHCARDS</h3>
          <p>
            Turn your document into
            revision cards.
          </p>
        </button>


        <button
          className={`learning-tool ${
            activeTool === "ask"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveTool("ask");
            clearStatus();
          }}
        >
          <span>05</span>
          <h3>ASK OMNILEARN</h3>
          <p>
            Ask something about your
            document using RAG.
          </p>
        </button>


        <button
          className={`learning-tool ${
            activeTool === "voice"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveTool("voice");
            clearStatus();
          }}
        >
          <span>06</span>
          <h3>VOICE LEARNING</h3>
          <p>
            Ask questions naturally
            using your voice.
          </p>
        </button>

      </div>


      {/* WORKSPACE PANEL */}

      <div className="workspace-panel">


        {/* ============================
            UPLOAD
        ============================ */}

        {activeTool === "upload" && (
          <div>

            <div className="panel-heading">

              <span>
                DOCUMENT AI
              </span>

              <h3>
                Upload your study material
              </h3>

              <p>
                Supported formats: PDF and
                DOCX.
              </p>

            </div>


            <div className="upload-area">

              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(event) => {
                  setSelectedFile(
                    event.target.files[0]
                  );

                  clearStatus();
                }}
              />


              {selectedFile && (
                <p>
                  Selected:{" "}
                  <strong>
                    {selectedFile.name}
                  </strong>
                </p>
              )}


              <button
                className="workspace-button"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading
                  ? "PROCESSING..."
                  : "UPLOAD DOCUMENT →"}
              </button>

            </div>

          </div>
        )}


        {/* ============================
            SIMPLIFY
        ============================ */}

        {activeTool === "simplify" && (
          <div>

            <div className="panel-heading">

              <span>
                DOCUMENT SIMPLIFICATION
              </span>

              <h3>
                Make difficult content easier.
              </h3>

            </div>


            <textarea
              className="workspace-textarea"
              placeholder="Paste your study material here..."
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
            />


            <div className="control-row">

              <select
                value={simplifyLevel}
                onChange={(event) =>
                  setSimplifyLevel(
                    event.target.value
                  )
                }
              >
                <option value="simple">
                  Simple
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="advanced">
                  Advanced
                </option>
              </select>


              <button
                className="workspace-button"
                onClick={handleSimplify}
                disabled={loading}
              >
                {loading
                  ? "SIMPLIFYING..."
                  : "SIMPLIFY →"}
              </button>

            </div>


            {simplifiedTextResult && (
              <div className="result-box">

                <div className="result-title">
                  SIMPLIFIED CONTENT
                </div>

                <p>
                  {simplifiedTextResult}
                </p>

              </div>
            )}

          </div>
        )}


        {/* ============================
    QUIZ
============================ */}

{activeTool === "quiz" && (
  <div>

    {/* Quiz Header */}
    <div className="panel-heading">

      <span>SMART QUIZ</span>

      <h3>
        Test your understanding.
      </h3>

      <p>
        Current document:{" "}
        <strong>
          {documentName || "No document uploaded"}
        </strong>
      </p>

    </div>


    {/* Quiz Controls */}
    <div className="control-row">

      <select
        value={quizLevel}
        onChange={(event) =>
          setQuizLevel(event.target.value)
        }
      >
        <option value="simple">
          Simple
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="advanced">
          Advanced
        </option>
      </select>


      <select
        value={numQuestions}
        onChange={(event) =>
          setNumQuestions(event.target.value)
        }
      >
        {[1, 2, 3, 4, 5, 10, 15, 20].map(
          (number) => (
            <option
              key={number}
              value={number}
            >
              {number} Questions
            </option>
          )
        )}
      </select>


      <button
        className="workspace-button"
        onClick={handleQuiz}
        disabled={loading}
      >
        {loading
          ? "GENERATING..."
          : "GENERATE QUIZ →"}
      </button>

    </div>


    {/* Quiz Results */}
    {quiz?.questions?.length > 0 && (

      <div className="quiz-results">

        {quiz.questions.map((item, index) => {

          const selected =
            selectedAnswers[index];

          const submitted =
            submittedAnswers[index];

          const isCorrect =
            submitted &&
            selected === item.correct_answer;


          return (

            <div
              className="quiz-card"
              key={index}
            >

              {/* Question Number */}
              <span>
                QUESTION {index + 1}
              </span>


              {/* Question */}
              <h4>
                {item.question}
              </h4>


              {/* Options */}
              <div className="quiz-options">

                {Object.entries(
                  item.options
                ).map(([key, value]) => {

                  const isSelected =
                    selected === key;

                  return (

                    <button
                      type="button"
                      key={key}
                      className={`quiz-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      disabled={submitted}
                      onClick={() => {

                        if (!submitted) {

                          setSelectedAnswers(
                            (previous) => ({
                              ...previous,
                              [index]: key,
                            })
                          );

                        }

                      }}
                    >

                      <strong>
                        {key}
                      </strong>

                      <span>
                        {value}
                      </span>

                    </button>

                  );

                })}

              </div>


              {/* Submit Answer */}
              <button
                type="button"
                className="workspace-button quiz-submit"
                disabled={
                  !selected || submitted
                }
                onClick={() => {

                  setSubmittedAnswers(
                    (previous) => ({
                      ...previous,
                      [index]: true,
                    })
                  );

                }}
              >

                {submitted
                  ? "ANSWER SUBMITTED"
                  : "SUBMIT ANSWER →"}

              </button>


              {/* Feedback */}
              {submitted && (

                <div
                  className={`quiz-feedback ${
                    isCorrect
                      ? "correct"
                      : "incorrect"
                  }`}
                >

                  <strong>
                    {isCorrect
                      ? "✓ Correct!"
                      : "✕ Incorrect"}
                  </strong>


                  {!isCorrect && (
                    <p>
                      Your answer:{" "}
                      <b>
                        {selected}
                      </b>
                    </p>
                  )}


                  <p>
                    Correct answer:{" "}
                    <b>
                      {item.correct_answer}
                    </b>
                  </p>


                  <p>
                    {item.explanation}
                  </p>

                </div>

              )}

            </div>

          );

        })}

      </div>

    )}

  </div>
)}


        {/* ============================
            FLASHCARDS
        ============================ */}

        {activeTool === "flashcards" && (
  <div>

    {/* ================================
        HEADER
    ================================= */}

    <div className="panel-heading">

      <span>
        SMART FLASHCARDS
      </span>

      <h3>
        Turn your document into revision cards.
      </h3>

      <p>
        Current document:{" "}
        <strong>
          {documentName ||
            "No document uploaded"}
        </strong>
      </p>

    </div>


    {/* ================================
        CONTROLS
    ================================= */}

    <div className="control-row">

      {/* Difficulty */}

      <select
        value={flashcardLevel}
        onChange={(event) =>
          setFlashcardLevel(
            event.target.value
          )
        }
      >

        <option value="simple">
          Simple
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="advanced">
          Advanced
        </option>

      </select>


      {/* Number of cards */}

      <select
        value={numFlashcards}
        onChange={(event) =>
          setNumFlashcards(
            Number(event.target.value)
          )
        }
      >

        {[1, 2, 3, 4, 5, 10, 15, 20, 30].map(
          (number) => (

            <option
              key={number}
              value={number}
            >
              {number} Cards
            </option>

          )
        )}

      </select>


      {/* Generate */}

      <button
        className="workspace-button"
        onClick={handleFlashcards}
        disabled={loading}
      >

        {loading
          ? "GENERATING..."
          : "GENERATE CARDS →"}

      </button>

    </div>


    {/* ================================
        FLASHCARD WORKSPACE
    ================================= */}

    {Array.isArray(flashcards) &&
      currentFlashcard < flashcards.length && (

      <div className="flashcard-workspace">

        {/* Progress */}

        <div className="flashcard-progress">

          CARD {currentFlashcard + 1}
          {" / "}
          {flashcards.length}

        </div>


        {/* Interactive Card */}

        <div
          className={`interactive-flashcard ${
            showFlashcardAnswer
              ? "show-answer"
              : ""
          }`}
          onClick={() =>
            setShowFlashcardAnswer(
              (previous) => !previous
            )
          }
        >

          <div className="flashcard-inner">

            {/* FRONT */}

            <div className="flashcard-face flashcard-front">

              <span>
                QUESTION
              </span>

              <h3>
                {
                  flashcards[currentFlashcard]
                    ?.question
                }
              </h3>

              <p>
                Click the card to reveal
                the answer
              </p>

            </div>


            {/* BACK */}

            <div className="flashcard-face flashcard-back">

              <span>
                ANSWER
              </span>

              <p>
                {
                  flashcards[currentFlashcard]
                    ?.answer
                }
              </p>

            </div>

          </div>

        </div>


        {/* ================================
            ACTION BUTTONS
        ================================= */}

        {showFlashcardAnswer && (

          <div className="flashcard-actions">

            {/* REVIEW */}

            <button
              className="flashcard-review-button"
              onClick={(event) => {

                event.stopPropagation();

                setReviewFlashcards(
                  (previous) => [
                    ...previous,
                    currentFlashcard
                  ]
                );

                goToNextFlashcard();

              }}
            >
              NEED TO REVIEW
            </button>


            {/* KNOW */}

            <button
              className="flashcard-known-button"
              onClick={(event) => {

                event.stopPropagation();

                setKnownFlashcards(
                  (previous) => [
                    ...previous,
                    currentFlashcard
                  ]
                );

                goToNextFlashcard();

              }}
            >
              I KNOW IT ✓
            </button>

          </div>

        )}

      </div>

    )}


    {/* ================================
        COMPLETION SCREEN
    ================================= */}

    {Array.isArray(flashcards) &&
      flashcards.length > 0 &&
      currentFlashcard >= flashcards.length && (

      <div className="flashcard-complete">

        <span>
          COMPLETE
        </span>

        <h3>
          Great work!
        </h3>

        <p>
          You completed all{" "}
          {flashcards.length}{" "}
          flashcards.
        </p>

        <p>

          Known:{" "}
          <strong>
            {knownFlashcards.length}
          </strong>

          {"  |  "}

          Need review:{" "}
          <strong>
            {reviewFlashcards.length}
          </strong>

        </p>


        <button
          className="workspace-button"
          onClick={() => {

            setCurrentFlashcard(0);

            setShowFlashcardAnswer(false);

            setKnownFlashcards([]);

            setReviewFlashcards([]);

          }}
        >
          START AGAIN →
        </button>

      </div>

    )}

  </div>
)}


    {/* ================================
        COMPLETION SCREEN
    =====
        {/* ============================
            ASK OMNILEARN
        ============================ */}

        {activeTool === "ask" && (
          <div>

            <div className="panel-heading">

              <span>
                RAG • ASK OMNILEARN
              </span>

              <h3>
                Ask something about your
                document.
              </h3>

              <p>
                OmniLearn retrieves relevant
                content before generating
                the answer.
              </p>

            </div>


            <div className="control-row">

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value
                  )
                }
              >
                <option value="English">
                  English
                </option>

                <option value="Hindi">
                  Hindi
                </option>

                <option value="Bengali">
                  Bengali
                </option>

                <option value="Tamil">
                  Tamil
                </option>

                <option value="Telugu">
                  Telugu
                </option>

                <option value="Marathi">
                  Marathi
                </option>

                <option value="Gujarati">
                  Gujarati
                </option>

              </select>

            </div>


            <textarea
              className="workspace-textarea"
              placeholder="Ask something about your uploaded document..."
              value={question}
              onChange={(event) =>
                setQuestion(
                  event.target.value
                )
              }
            />


            <button
              className="workspace-button"
              onClick={handleAskDocument}
              disabled={loading}
            >
              {loading
                ? "THINKING..."
                : "ASK OMNILEARN →"}
            </button>


            {answer && (
              <div className="result-box">

                <div className="result-title">
                  OMNILEARN ANSWER
                </div>

                <p>
                  {answer}
                </p>

              </div>
            )}

          </div>
        )}


        {/* ============================
            VOICE LEARNING
        ============================ */}

        {activeTool === "voice" && (
          <div>

            <div className="panel-heading">

              <span>
                VOICE LEARNING
              </span>

              <h3>
                Ask OmniLearn using your
                voice.
              </h3>

              <p>
                Speak naturally. Whisper
                detects your language and
                Qwen generates the response.
              </p>

            </div>


            <div className="upload-area">

              {/* RECORD BUTTON */}

              {!isRecording ? (
                <button
                  className="workspace-button"
                  onClick={startRecording}
                  disabled={loading}
                >
                  🎙 START RECORDING
                </button>
              ) : (
                <button
                  className="workspace-button"
                  onClick={stopRecording}
                >
                  ⏹ STOP RECORDING
                </button>
              )}


              {/* TIMER */}

              {isRecording && (
                <p className="recording-status">
                  🔴 Recording{" "}
                  <strong>
                    {formatTime(
                      recordingTime
                    )}
                  </strong>
                </p>
              )}


              {/* SELECT AUDIO FILE OPTION */}

              <p>
                Or select an existing audio
                file:
              </p>

              <input
                type="file"
                accept="audio/*,.wav,.mp3,.ogg,.m4a"
                onChange={(event) => {

                  setAudioFile(
                    event.target.files[0]
                  );

                  clearStatus();
                }}
              />


              {/* SELECTED AUDIO */}

              {audioFile && (
                <p>
                  Audio ready:{" "}
                  <strong>
                    {audioFile.name}
                  </strong>
                </p>
              )}


              {/* SEND TO BACKEND */}

              <button
                className="workspace-button"
                onClick={handleVoice}
                disabled={
                  loading ||
                  isRecording ||
                  !audioFile
                }
              >
                {loading
                  ? "PROCESSING VOICE..."
                  : "ASK USING VOICE →"}
              </button>

            </div>


            {/* VOICE RESULT */}

            {voiceResult && (
              <div className="result-box">

                <div className="result-title">
                  VOICE RESULT
                </div>


                <p>
                  <strong>
                    Detected language:
                  </strong>{" "}
                  {voiceResult.language}
                </p>


                <p>
                  <strong>
                    Question:
                  </strong>{" "}
                  {voiceResult.question}
                </p>


                <hr />


                <p>
                  {voiceResult.answer}
                </p>

              </div>
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default Workspace;