import { useState } from "react";

const initialForm = {
  gender: "Male",
  age: "",
  hypertension: "No",
  heart_disease: "No",
  ever_married: "No",
  work_type: "Private",
  Residence_type: "Urban",
  avg_glucose_level: "",
  bmi: "",
  smoking_status: "Never Smoked",
};

const API_URL = import.meta.env.VITE_API_URL;

const fields = [
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female"],
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter age",
  },
  {
    name: "ever_married",
    label: "Marital Status",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    name: "work_type",
    label: "Work Type",
    type: "select",
    options: [
      "Private",
      "Self-employed",
      "Government Job",
      "Children",
      "Never Worked",
    ],
  },
  {
    name: "Residence_type",
    label: "Residence Type",
    type: "select",
    options: ["Urban", "Rural"],
  },
  {
    name: "hypertension",
    label: "Hypertension",
    type: "select",
    options: ["No", "Yes"],
  },
  {
    name: "heart_disease",
    label: "Heart Disease",
    type: "select",
    options: ["No", "Yes"],
  },
  {
    name: "avg_glucose_level",
    label: "Average Glucose Level",
    type: "number",
    placeholder: "e.g. 105.5",
  },
  {
    name: "bmi",
    label: "Body Mass Index (BMI)",
    type: "number",
    placeholder: "e.g. 24.5",
  },
  {
    name: "smoking_status",
    label: "Smoking Status",
    type: "select",
    options: [
      "Never Smoked",
      "Formerly Smoked",
      "Smokes",
      "Unknown",
    ],
  },
];

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult("");
    setError("");

    const payload = {
      ...formData,
      age: Number(formData.age),
      avg_glucose_level: Number(formData.avg_glucose_level),
      bmi: Number(formData.bmi),
    };

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(", ")
          : data.detail;

        throw new Error(detail || "Prediction failed.");
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure FastAPI is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setResult("");
    setError("");
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10";

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-800">

      {/* Navbar */}
      <header className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-2xl text-white shadow-lg shadow-teal-600/20">
              ♥
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                Stroke<span className="text-teal-600">Care</span>
              </h1>
              <p className="text-xs font-medium text-slate-400">
                AI-Powered Prediction System
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-700">
              Prediction System Online
            </span>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* Hero Section */}
        <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#102b3f] via-[#124b5b] to-[#087e80] px-7 py-10 text-white shadow-xl shadow-teal-900/10 sm:px-12 sm:py-14">

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-teal-100">
              <span className="h-2 w-2 rounded-full bg-teal-300"></span>
              MACHINE LEARNING BASED ASSESSMENT
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Understand Your
              <span className="block text-teal-300">
                Stroke Risk
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              Enter the required personal and medical information to
              generate a stroke risk prediction using our trained
              Random Forest machine learning model.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-xl font-bold">10</p>
                <p className="text-xs text-teal-100">Input Fields</p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-xl font-bold">AI</p>
                <p className="text-xs text-teal-100">Powered Model</p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-xl font-bold">RF</p>
                <p className="text-xs text-teal-100">Algorithm</p>
              </div>
            </div>
          </div>

          {/* Decorative circle */}
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[35px] border-white/5"></div>
          <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full border-[35px] border-white/5"></div>

          <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 items-center justify-center lg:flex">
            <div className="flex h-48 w-48 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
              <span className="text-8xl text-teal-200">♥</span>
            </div>
          </div>

        </section>

        {/* Form Section */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">

          {/* Form Header */}
          <div className="border-b border-slate-100 px-6 py-7 sm:px-10">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                    Patient Assessment
                  </span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Patient Information
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Provide accurate information for prediction.
                </p>
              </div>

              <div className="flex h-fit items-center gap-2 rounded-xl bg-teal-50 px-4 py-3">
                <span className="text-lg text-teal-600">✚</span>
                <span className="text-xs font-bold text-teal-700">
                  10 Required Fields
                </span>
              </div>

            </div>

          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10">

            {/* Personal Details */}
            <div className="mb-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  ♙
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Personal Details
                  </h4>
                  <p className="text-xs text-slate-400">
                    Basic patient information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">

                {fields.slice(0, 5).map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min="0"
                        max="90"
                        step="any"
                        required
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}

              </div>
            </div>

            {/* Medical Details */}
            <div className="mb-8 border-t border-slate-100 pt-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-lg text-rose-500">
                  ♥
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Medical Details
                  </h4>
                  <p className="text-xs text-slate-400">
                    Health indicators and medical history
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">

                {fields.slice(5).map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min="0.01"
                        step="any"
                        required
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}

              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row">

              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Predict Stroke Risk
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Reset Form
              </button>

            </div>

          </form>
        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600"></div>
            <div>
              <p className="text-sm font-bold text-teal-800">
                Analysing Patient Information
              </p>
              <p className="mt-1 text-xs text-teal-600">
                Please wait while the machine learning model processes the data.
              </p>
            </div>
          </div>
        )}

        {/* Prediction Result */}
        {result && (
          <section
            className={`mt-8 overflow-hidden rounded-3xl border p-7 sm:p-9 ${
              result.includes("High")
                ? "border-red-200 bg-gradient-to-br from-red-50 to-white"
                : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
            }`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                    result.includes("High")
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {result.includes("High") ? "!" : "✓"}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Prediction Result
                  </p>

                  <h3
                    className={`mt-2 text-2xl font-extrabold sm:text-3xl ${
                      result.includes("High")
                        ? "text-red-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {result}
                  </h3>
                </div>

              </div>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                New Assessment
              </button>

            </div>

            <div
              className={`mt-6 rounded-xl p-4 text-sm leading-6 ${
                result.includes("High")
                  ? "bg-red-100/60 text-red-800"
                  : "bg-emerald-100/60 text-emerald-800"
              }`}
            >
              {result.includes("High")
                ? "The model has classified this input as high risk. This result is not a medical diagnosis. Please consult a qualified healthcare professional."
                : "The model has classified this input as low risk. This does not rule out stroke or guarantee that a person is free from risk."}
            </div>

          </section>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <span className="text-lg">⚠</span>
            <div>
              <p className="font-bold">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <footer className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">

          <div className="flex items-start gap-3">
            <span className="text-xl text-amber-600">ⓘ</span>

            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Medical Disclaimer
              </h4>

              <p className="mt-1 text-xs leading-6 text-amber-800 sm:text-sm">
              This tool provides AI-based stroke risk predictions using the dataset for informational and educational purposes only. The results are not medical diagnoses and should not replace professional medical advice.
              </p>
            </div>
          </div>

        </footer>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs font-medium text-slate-400">
            StrokeCare · Machine Learning Based Stroke Prediction System
          </p>
        </div>

      </main>
    </div>
  );
}

export default App;