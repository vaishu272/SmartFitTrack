import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";

export default function Onboarding() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      height: "",
      weight: "",
      age: "",
      gender: "Male",
      fitnessGoal: "General Fitness",
    },
  });

  const { API, user, authorizationToken, userAuthentication } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.onboardingComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    // Coerce values for the API since they might be strings from inputs
    const payload = {
      ...data,
      height: Number(data.height),
      weight: Number(data.weight),
      age: Number(data.age),
    };

    try {
      await axios.put(`${API}/api/auth/onboarding`, payload, {
        headers: { Authorization: authorizationToken },
      });
      await userAuthentication(); // Update local auth context
      toast.success("Profile saved — let’s train!");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.extraDetails || "Could not save onboarding";
      toast.error(msg);
    }
  };

  const inputClass = (error) =>
    `w-full bg-zinc-50 dark:bg-dark-800 text-zinc-900 dark:text-white rounded-lg p-3 border outline-none transition-colors ${
      error
        ? "border-red-500/50 focus:border-red-500"
        : "border-zinc-200 dark:border-dark-900 focus:border-primary-500"
    }`;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-zinc-100 dark:bg-dark-950 px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-dark-900 p-8 rounded-xl border border-zinc-200 dark:border-primary-500/20 shadow-lg shadow-zinc-900/5 dark:shadow-primary-500/5 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-500 mb-2 text-center">
          Complete your profile
        </h2>
        <p className="text-zinc-600 dark:text-neutral-400 text-sm text-center mb-6">
          We use this to personalize your dashboard and goals.
        </p>
        <div className="space-y-4">
          <div>
            <input
              type="number"
              placeholder="Height (cm)"
              className={inputClass(errors.height)}
              {...register("height", {
                required: "Height is required",
                min: { value: 50, message: "Min height is 50cm" },
                max: { value: 300, message: "Max height is 300cm" },
              })}
            />
            {errors.height && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.height.message}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              className={inputClass(errors.weight)}
              {...register("weight", {
                required: "Weight is required",
                min: { value: 20, message: "Min weight is 20kg" },
                max: { value: 400, message: "Max weight is 400kg" },
              })}
            />
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.weight.message}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Age"
              className={inputClass(errors.age)}
              {...register("age", {
                required: "Age is required",
                min: { value: 10, message: "Min age is 10" },
                max: { value: 120, message: "Max age is 120" },
              })}
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.age.message}</p>
            )}
          </div>

          <div>
            <select
              className={inputClass(errors.gender)}
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <select
              className={inputClass(errors.fitnessGoal)}
              {...register("fitnessGoal", { required: "Goal is required" })}
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
              <option value="General Fitness">General Fitness</option>
            </select>
            {errors.fitnessGoal && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.fitnessGoal.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_18px_rgba(14,165,233,0.45)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Continue to dashboard"}
          </button>
        </div>
      </form>
    </div>
  );
}
