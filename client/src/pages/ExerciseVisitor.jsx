import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Info } from "lucide-react";

const ExerciseVisitor = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        // Just take the first 8 exercises for the demo
        setExercises(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to load exercises", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Demo Banner */}
      <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 sm:p-6 mb-12 text-center max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-lg">
          <Info className="w-5 h-5" />
          <span>Demo Version</span>
        </div>
        <p className="text-zinc-700 dark:text-neutral-300">
          You are currently viewing a limited preview of our exercise library.
          Sign in or create an account to unlock hundreds of exercises, detailed
          video instructions, and personalized workout tracking.
        </p>
        <Link
          to="/login"
          className="mt-2 inline-flex items-center justify-center px-6 py-2.5 bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 rounded-xl text-white font-bold transition-all shadow-lg"
        >
          Sign In for Full Access
        </Link>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          Explore Our Exercise Library
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Browse a comprehensive collection of exercises to help you reach your
          fitness goals.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        /* Exercise Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.exerciseId}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-zinc-100 dark:border-white/10 flex flex-col"
            >
              <div className="h-48 bg-zinc-100 dark:bg-neutral-800 relative overflow-hidden">
                <img
                  src={exercise.imageUrl || exercise.imageUrls?.["480p"]}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop";
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4 line-clamp-2 flex-1">
                  {exercise.overview ||
                    "A great exercise to add to your fitness routine."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exercise.targetMuscles?.slice(0, 2).map((muscle, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full capitalize"
                    >
                      {muscle.toLowerCase()}
                    </span>
                  ))}
                  {exercise.bodyParts?.slice(0, 1).map((part, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-neutral-300 text-xs font-medium rounded-full capitalize"
                    >
                      {part.toLowerCase()}
                    </span>
                  ))}
                </div>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 text-sm mt-auto"
                >
                  <Dumbbell className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ExerciseVisitor;
