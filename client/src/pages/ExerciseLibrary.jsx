import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, Dumbbell, Target, Info, X } from "lucide-react";

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openExerciseDetails = async (exerciseId) => {
    setModalLoading(true);
    setSelectedExercise({ exerciseId });
    try {
      const response = await axios.get(
        `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/${exerciseId}`,
        {
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host":
              "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
          },
        },
      );

      const exercise = response.data?.data;

      if (!exercise) {
        throw new Error("Invalid API response");
      }
      setSelectedExercise(response.data.data);
    } catch (error) {
      console.error("Failed to fetch details:", error);
      setSelectedExercise(null);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises?limit=50",
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
              "X-RapidAPI-Host":
                "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
            },
          },
        );

        const exercise = response.data?.data;

        if (!exercise) {
          throw new Error("Invalid API response");
        }

        setExercises(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((ex) => {
    const searchLower = searchTerm.toLowerCase();
    const targetStr = ex.targetMuscles
      ? ex.targetMuscles.join(" ").toLowerCase()
      : (ex.target || "").toLowerCase();
    return (
      (ex.name && ex.name.toLowerCase().includes(searchLower)) ||
      targetStr.includes(searchLower)
    );
  });

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "beginner":
        return "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20";
      case "intermediate":
        return "text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";
      case "advanced":
        return "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
      default:
        return "text-zinc-600 bg-zinc-50 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-neutral-950 p-6 md:p-8 text-zinc-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary-600 dark:text-primary-500">
              Exercise Library
            </h1>
            <p className="text-zinc-500 dark:text-neutral-400 mt-1">
              Powered by ExerciseDB. Explore our database of workouts.
            </p>
          </div>

          <div className="relative w-full md:w-72 mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search exercises or targets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-white/10 rounded-full text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all dark:placeholder-neutral-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
            <p className="text-zinc-500 dark:text-neutral-400">
              Loading exercise database...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.exerciseId || exercise.id}
                onClick={() =>
                  openExerciseDetails(exercise.exerciseId || exercise.id)
                }
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden hover:border-primary-500/30 transition-all duration-300 flex flex-col shadow-sm cursor-pointer hover:-translate-y-1"
              >
                {/* Image Section */}
                {exercise.imageUrl && (
                  <div className="w-full h-48 bg-zinc-100 dark:bg-neutral-800 overflow-hidden">
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Body Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl leading-tight capitalize text-zinc-800 dark:text-zinc-100 pr-2">
                      {exercise.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border shrink-0 ${getDifficultyColor(exercise.exerciseType?.toLowerCase() || exercise.difficulty)}`}
                    >
                      {exercise.exerciseType ||
                        exercise.difficulty ||
                        "All Levels"}
                    </span>
                  </div>

                  {exercise.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                      {exercise.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 rounded-lg shrink-0">
                      <Target className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">
                        {exercise.targetMuscles
                          ? exercise.targetMuscles.join(", ")
                          : exercise.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-white/5 dark:text-zinc-300 rounded-lg shrink-0">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">
                        {exercise.equipments
                          ? exercise.equipments.join(", ")
                          : exercise.equipment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredExercises.length === 0 && (
          <div className="text-center py-20 text-zinc-500 dark:text-neutral-500">
            No exercises found matching "{searchTerm}".
          </div>
        )}

        {/* Modal content here */}
        {selectedExercise && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedExercise(null)}
          >
            <div
              className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-white/5 absolute top-0 w-full z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
                <h2 className="text-xl font-bold capitalize text-zinc-900 dark:text-white truncate pr-4">
                  {selectedExercise.name || "Loading..."}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-neutral-800 transition-colors bg-zinc-100 dark:bg-neutral-800"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 cursor-pointer text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>

              <div className="overflow-y-auto w-full h-full pt-20 p-6 custom-scrollbar">
                {modalLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 h-full">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                    <p className="text-zinc-500 dark:text-neutral-400">
                      Loading details...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {/* Video/Image Area */}
                    {selectedExercise.videoUrl ? (
                      <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video relative group">
                        <video
                          src={selectedExercise.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                          poster={selectedExercise.imageUrl}
                        />
                      </div>
                    ) : selectedExercise.imageUrl ? (
                      <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video">
                        <img
                          src={selectedExercise.imageUrl}
                          alt={selectedExercise.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : null}

                    {/* Info sections */}
                    <div>
                      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary-500" />
                        Overview
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {selectedExercise.overview ||
                          selectedExercise.description ||
                          "No overview available."}
                      </p>
                    </div>

                    {selectedExercise.instructions &&
                      selectedExercise.instructions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-3">
                            Instructions
                          </h3>
                          <ol className="space-y-4 list-decimal pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                            {selectedExercise.instructions.map((step, idx) => (
                              <li key={idx} className="pl-2 leading-relaxed">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                    {selectedExercise.exerciseTips &&
                      selectedExercise.exerciseTips.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-3">
                            Tips
                          </h3>
                          <ul className="space-y-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                            {selectedExercise.exerciseTips.map((tip, idx) => (
                              <li key={idx} className="pl-2 leading-relaxed">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
