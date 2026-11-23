import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  gender: "",
  age: "",
  hypertension: "",
  heart_disease: "",
  ever_married: "",
  work_type: "",
  Residence_type: "",
  avg_glucose_level: "",
  bmi: "",
  smoking_status: "",
};

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
    placeholder: "Enter your age",
    min: 0,
    max: 90,
  },
  {
    name: "ever_married",
    label: "Ever Married",
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
    options: ["Yes", "No"],
  },
  {
    name: "heart_disease",
    label: "Heart Disease",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    name: "avg_glucose_level",
    label: "Average Glucose Level",
    type: "number",
    placeholder: "e.g. 105.5",
    min: 0,
    step: "any",
  },
  {
    name: "bmi",
    label: "BMI",
    type: "number",
    placeholder: "e.g. 25.4",
    min: 0,
    step: "any",
  },
  {
    name: "smoking_status",
    label: "Smoking Status",
    type: "select",
    options: ["Formerly Smoked", "Never Smoked", "Smokes", "Unknown"],
  },
];

const personalFields = [
  "gender",
  "age",
  "ever_married",
  "work_type",
  "Residence_type",
];

const medicalFields = [
  "hypertension",
  "heart_disease",
  "avg_glucose_level",
  "bmi",
  "smoking_status",
];

function getError(field, value) {
  if (value === "" || value === undefined) {
    return field.type === "select"
      ? `Please select ${field.label.toLowerCase()}.`
      : `${field.label} is required.`;
  }

  if (field.type === "number") {
    const n = Number(value);
    if (Number.isNaN(n)) return "Enter a valid number.";
    if (field.min !== undefined && n < field.min)
      return `Must be at least ${field.min}.`;
    if (field.max !== undefined && n > field.max)
      return `Must be ${field.max} or less.`;
  }

  return "";
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const resultRef = useRef(null);
  const formRef = useRef(null);

  const errors = useMemo(() => {
    const out = {};
    fields.forEach((f) => {
      const msg = getError(f, form[f.name]);
      if (msg) out[f.name] = msg;
    });
    return out;
  }, [form]);

  const isHigh = result === "High Risk of Stroke";

  // Scroll to the result when it arrives
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [result]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setResult("");
    setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setTouched({});
    setResult("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before sending
    const firstBad = fields.find((f) => errors[f.name]);
    if (firstBad) {
      setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));
      setError("Please complete the highlighted fields to continue.");

      requestAnimationFrame(() => {
        const el = document.getElementById(firstBad.name);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus?.({ preventScroll: true });
      });
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        avg_glucose_level: Number(form.avg_glucose_level),
        bmi: Number(form.bmi),
      };

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail)
            : "Something went wrong. Please try again."
        );
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please make sure the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const showError = touched[field.name] && errors[field.name];

    const commonClasses = `w-full rounded-xl border px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
      showError
        ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-400/10"
        : "border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-teal-500/10"
    }`;

    return (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {field.label}
          <span className="ml-1 text-red-400">*</span>
        </label>

        {field.type === "select" ? (
          <select
            id={field.name}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showError ? "true" : "false"}
            className={`${commonClasses} cursor-pointer`}
          >
            <option value="" disabled>
              Select {field.label}
            </option>

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
            inputMode="decimal"
            value={form[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step || "1"}
            aria-invalid={showError ? "true" : "false"}
            className={commonClasses}
          />
        )}

        {showError && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors[field.name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-slate-50 to-blue-50 text-slate-800">
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-700 text-xl text-white shadow-lg shadow-teal-500/20 sm:h-11 sm:w-11 sm:text-2xl">
              ♥
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Stroke<span className="text-teal-600">Care</span>
              </h1>
              <p className="hidden text-[10px] font-medium tracking-widest text-slate-400 sm:block">
                INTELLIGENT HEALTHCARE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none"></span>
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
              <span className="sm:hidden">Online</span>
              <span className="hidden sm:inline">Prediction System Online</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-14">
        {/* Hero Section */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#102b3f] via-[#124b5b] to-[#087e80] px-5 py-10 text-white shadow-2xl shadow-teal-900/15 sm:mb-10 sm:px-12 sm:py-16">
          {/* Background Effects */}
          <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"></div>
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[35px] border-white/5"></div>
          <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full border-[35px] border-white/5"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2">
              <span className="text-teal-300">✦</span>
              <span className="text-[10px] font-semibold tracking-wide text-teal-100 sm:text-xs">
                MACHINE LEARNING POWERED ASSESSMENT
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Understand Your
              <span className="block text-teal-300">Stroke Risk</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:mt-6 sm:text-base">
              Enter your health information to receive an AI-based stroke
              risk prediction. Our machine learning model analyzes your
              information to provide an estimated risk category.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4">
                <p className="text-xl font-bold text-white sm:text-2xl">10</p>
                <p className="mt-1 text-xs text-slate-300">Input Fields</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4">
                <p className="text-xl font-bold text-white sm:text-2xl">AI</p>
                <p className="mt-1 text-xs text-slate-300">Powered Model</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4">
                <p className="text-xl font-bold text-white sm:text-2xl">RF</p>
                <p className="mt-1 text-xs text-slate-300">Algorithm</p>
              </div>
            </div>
          </div>

          {/* Hero Icon */}
          <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-teal-300/20 bg-teal-300/10 text-8xl text-teal-200">
                ♥
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60">
          {/* Form Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-teal-50/50 px-5 py-5 sm:px-9 sm:py-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-lg text-teal-700">
                    ♧
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Health Information
                  </h3>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Please provide accurate information for your prediction.
                </p>
              </div>

              <div className="w-fit rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700">
                All fields are required
              </div>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="p-5 sm:p-9"
          >
            {/* Personal Details */}
            <div className="mb-8 sm:mb-9">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-teal-500"></div>

                <div>
                  <h4 className="font-bold text-slate-900">Personal Details</h4>
                  <p className="text-xs text-slate-400">
                    Basic demographic information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fields
                  .filter((field) => personalFields.includes(field.name))
                  .map(renderField)}
              </div>
            </div>

            {/* Medical Details */}
            <div className="mb-8 sm:mb-9">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-cyan-500"></div>

                <div>
                  <h4 className="font-bold text-slate-900">Medical Details</h4>
                  <p className="text-xs text-slate-400">
                    Health-related information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fields
                  .filter((field) => medicalFields.includes(field.name))
                  .map(renderField)}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <span className="text-lg">⚠</span>
                <p>{error}</p>
              </div>
            )}

            {/* Prediction Result */}
            {result && (
              <div
                ref={resultRef}
                role="status"
                aria-live="polite"
                className={`mb-7 animate-[fadeIn_0.4s_ease-out] rounded-2xl border p-5 motion-reduce:animate-none sm:p-6 ${
                  isHigh
                    ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                    : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                        isHigh
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {isHigh ? "!" : "✓"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Prediction Result
                      </p>

                      <h4
                        className={`mt-1 text-lg font-extrabold sm:text-xl ${
                          isHigh ? "text-red-700" : "text-emerald-700"
                        }`}
                      >
                        {result}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                      isHigh
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isHigh ? "HIGH RISK" : "LOW RISK"}
                  </span>
                </div>

                <p className="mt-5 border-t border-slate-200/70 pt-4 text-sm leading-6 text-slate-600">
                  {isHigh
                    ? "The model has identified a higher estimated stroke risk based on the information provided. Please consult a qualified healthcare professional for proper medical evaluation."
                    : "The model has identified a lower estimated stroke risk based on the information provided. Continue maintaining a healthy lifestyle and consult a healthcare professional for medical advice."}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-600/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"></span>
                    Analyzing Information...
                  </>
                ) : (
                  <>
                    <span className="text-lg">✦</span>
                    Predict Stroke Risk
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ Reset Form
              </button>
            </div>
          </form>
        </section>

        {/* Disclaimer */}
        <footer className="mt-8 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl text-teal-600">ⓘ</span>

            <div>
              <h4 className="text-sm font-bold text-teal-900">
                Medical Disclaimer
              </h4>

              <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">
                This tool provides AI-based stroke risk predictions using
                the dataset for informational and educational purposes only.
                The results are not medical diagnoses and should not replace
                professional medical advice.
              </p>
            </div>
          </div>
        </footer>

        {/* Bottom Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400">
            © 2026 StrokeCare. All rights reserved.
          </p>

          <p className="text-xs font-medium text-slate-500">
            Powered by Machine Learning
            <span className="mx-2 text-teal-500">●</span>
            Random Forest Algorithm
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;