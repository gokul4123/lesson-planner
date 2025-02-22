import React, { useState, useEffect } from "react";
import axios from "axios";
import PDFExport from "./PDFExport";

const LessonForm = () => {
  const [topic, setTopic] = useState("");
  const [lessonPlan, setLessonPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedLesson = localStorage.getItem("lessonPlan");
    if (savedLesson) {
      setLessonPlan(JSON.parse(savedLesson));
    }
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
  }, []);
  useEffect(() => {
    if (lessonPlan) {
      localStorage.setItem("lessonPlan", JSON.stringify(lessonPlan));
    }
  }, [lessonPlan]);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };
  const handleEdit = (field, value) => {
    setLessonPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const API_KEY = import.meta.env.GEMINI_API_KEY; // Replace with actual API key

  const generateLessonPlan = async () => {
    if (!topic) {
      alert("Please enter a topic first!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Create a structured lesson plan in valid JSON format for the topic: ${topic}. Ensure it includes: topic, grade_level, subject, duration, objectives, materials, procedure (array with step, description, duration), and assessment.`,
                },
              ],
            },
          ],
        }
      );

      let generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      generatedText = generatedText.replace(/^```json/, "").replace(/```$/, "").trim();

      if (!generatedText.startsWith("{")) {
        console.error("Invalid JSON format:", generatedText);
        alert("Received an invalid response. Please try again.");
        setLoading(false);
        return;
      }

      const parsedData = JSON.parse(generatedText);
      setLessonPlan(parsedData);
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      alert("Failed to generate lesson plan.");
    }

    setLoading(false);
  };

  return (
    <div className={`p-6 max-w-3xl mx-auto rounded-lg shadow-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      {/* Dark Mode Toggle */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Generate Lesson Plan</h2>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-md bg-gray-800 text-white dark:bg-gray-200 dark:text-black transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter lesson topic"
        className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
      />
      <button
        onClick={generateLessonPlan}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
      >
        {loading ? "Generating..." : "Generate Lesson Plan"}
      </button>

      {loading && <div className="mt-4 p-6 text-center text-gray-500">Loading lesson plan...</div>}
      {lessonPlan && (
        <div className={`mt-6 p-6 rounded-md shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="text-xl font-semibold">Lesson Plan</h3>
          <label className="block mt-2">Topic:</label>
          <input
            type="text"
            value={lessonPlan.topic}
            onChange={(e) => handleEdit("topic", e.target.value)}
            className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
          />

          <label className="block mt-2">Grade Level:</label>
          <input
            type="text"
            value={lessonPlan.grade_level}
            onChange={(e) => handleEdit("grade_level", e.target.value)}
            className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
          />

          <label className="block mt-2">Duration:</label>
          <input
            type="text"
            value={lessonPlan.duration}
            onChange={(e) => handleEdit("duration", e.target.value)}
            className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
          />

          <label className="block mt-2">Materials:</label>
          <textarea
            value={lessonPlan.materials?.join(", ")}
            onChange={(e) => handleEdit("materials", e.target.value.split(","))}
            className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
          />

          <h3 className="text-lg font-semibold mt-4">Lesson Outline</h3>
          <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-700">
            {lessonPlan.procedure.map((step, index) => (
              <div key={index} className="mb-3 border-b pb-2">
                <p className="font-semibold">Step {index + 1}</p>
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const newProcedure = [...lessonPlan.procedure];
                    newProcedure[index].description = e.target.value;
                    handleEdit("procedure", newProcedure);
                  }}
                  className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
                />
                <p className="text-gray-500 dark:text-gray-300">Duration: {step.duration}</p>
              </div>
            ))}
          </div>

          <label className="block mt-2">Assessment:</label>
          <textarea
            value={lessonPlan.assessment}
            onChange={(e) => handleEdit("assessment", e.target.value)}
            className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
          />
          <PDFExport lessonPlan={lessonPlan} />
        </div>
      )}
    </div>
  );
};

export default LessonForm;
