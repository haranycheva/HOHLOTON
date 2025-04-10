import React, { useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [theme, setTheme] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [aiLikenessScore, setAiLikenessScore] = useState(null);
  const [aiLikenessExplanation, setAiLikenessExplanation] = useState("");
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const handleInputChange = (e) => {
    setTheme(e.target.value);
  };

  const handleGenerateText = async () => {
    if (!theme.trim()) {
      alert("Будь ласка, введіть тему");
      return;
    }

    setIsLoadingText(true);
    setIsLoadingStats(false);
    setGeneratedText("");
    setAiLikenessScore(null);
    setAiLikenessExplanation("");

    try {
      const result = await axios.post("https://5965-128-124-205-220.ngrok-free.app/api/hohloton", { theme });
      const data = result.data.data.outputs;
      setGeneratedText(data.text2);
      setIsLoadingText(false);

      setIsLoadingStats(true);
      const stats = await axios.post("https://5965-128-124-205-220.ngrok-free.app/api/hohloton2", { text: data.text2 });
      const data2 = stats.data.data.outputs;
      setAiLikenessScore(data2.statistic.ai_likeness_score);
      setAiLikenessExplanation(data2.statistic.ai_likeness_explanation);
    } catch (error) {
      console.error("Помилка під час генерації:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsLoadingText(false);
      setIsLoadingStats(false);
    }
  };

  return (
    <div className="container">
      <h1>Створи свій твір</h1>
      <input
        value={theme}
        onChange={handleInputChange}
        placeholder="Введіть тему твору..."
      ></input>
      <button onClick={handleGenerateText}>Відправити</button>

      {isLoadingText && <p>Генеруємо текст...</p>}
      {generatedText && !isLoadingText && (
        <div className="result">
          <div className="text-container">
            <h2>Згенерований текст:</h2>
            <p>{generatedText}</p>
          </div>
        </div>
      )}

      {isLoadingStats && <p>Аналізуємо текст на штучність...</p>}
      {!isLoadingStats && aiLikenessScore !== null && (
        <>
          <div className="info-container">
            <div className="score">
              <h3>AI DETECTOR:</h3>
              <p>{aiLikenessScore}%</p>
            </div>
          </div>
          <div className="explanation">
            <h3>Пояснення:</h3>
            <p>{aiLikenessExplanation}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
