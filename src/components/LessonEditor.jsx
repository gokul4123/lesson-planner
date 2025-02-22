export default function LessonEditor({ lessonPlan, setLessonPlan }) {
    return (
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-2">Edit Lesson Plan</h2>
        <textarea
          className="border p-2 w-full h-40 rounded"
          value={lessonPlan}
          onChange={(e) => setLessonPlan(e.target.value)}
        />
      </div>
    );
  }
  