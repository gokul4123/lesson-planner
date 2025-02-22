import LessonForm from "../components/LessonForm";
import { useState } from "react";

export default function Dashboard() {
  const [ setLessonPlan] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Lesson Plan Creator</h1>
      <LessonForm setLessonPlan={setLessonPlan} />
    </div>
  );
}
