import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";

const Contact = () => {
  const { API, user } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: user?.name || "",
      email: user?.email || "",
      message: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("username", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setServerError("");

    try {
      await axios.post(`${API}/api/form/contact`, data);
      toast.success("Message sent successfully!");
      reset({ ...data, message: "" });
    } catch (error) {
      const resData = error.response?.data;
      let errorMessage = "Failed to send message";

      if (resData) {
        if (resData.message || resData.msg) {
          errorMessage = resData.message || resData.msg;
        } else if (resData.extraDetails) {
          errorMessage = resData.extraDetails;
        }
      }

      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const inputClass = (error) =>
    [
      "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-neutral-900 border text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-neutral-500 outline-none transition",
      error
        ? "border-red-500/50 focus:border-red-500"
        : "border-zinc-200 dark:border-white/10 focus:border-primary-500",
    ].join(" ");

  return (
    <section className="min-h-[80vh] py-6 px-4 bg-zinc-50 dark:bg-neutral-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 md:gap-12 bg-white dark:bg-neutral-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 md:p-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Get in touch
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-neutral-400 text-lg">
            Have questions about your workouts, finding a bug, or just want to
            say hi? We'd love to hear from you.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Email
                </h3>
                <p className="text-zinc-500 dark:text-neutral-400">
                  smartfittrackv1@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-500/10 flex items-center justify-center text-secondary-500">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Location
                </h3>
                <p className="text-zinc-500 dark:text-neutral-400">India</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                Name
              </label>
              <input
                type="text"
                className={inputClass(errors.username)}
                placeholder="John Doe"
                {...register("username", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required",
                  },
                  maxLength: {
                    value: 30,
                    message: "Maximum 30 characters allowed",
                  },
                })}
              />
              <p className="min-h-5 text-red-500 text-xs mt-1">
                {errors.username?.message}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                Email
              </label>
              <input
                type="email"
                className={inputClass(errors.email)}
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter valid email",
                  },
                })}
              />
              <p className="min-h-5 text-red-500 text-xs mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                Message
              </label>
              <textarea
                rows={4}
                className={inputClass(errors.message)}
                placeholder="How can we help?"
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
              />
              <p className="min-h-5 text-red-500 text-xs mt-1">
                {errors.message?.message}
              </p>
            </div>

            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary-500/25 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
