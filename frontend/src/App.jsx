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
    name: "avg_glucose_level",
    label: "Average Glucose Level",
    type: "number",
    placeholder: "Enter glucose level",
  },
  {
    name: "bmi",
    label: "BMI",
    type: "number",
    placeholder: "Enter BMI",
  },
  {
    name: "smoking_status",
    label: "Smoking Status",
    type: "select",
    options: [
      "Formerly Smoked",
      "Never Smoked",
      "Smokes",
      "Unknown",
    ],
  },
];

const  API_URL=import.meta.env.VITE_API_URL;

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
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
            ♥
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Stroke Prediction
            </h1>
            <p className="text-sm text-slate-500">
              Machine Learning Based Prediction System
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        {/* Introduction */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Patient Assessment
          </p>

          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Patient Information
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Enter the patient's details below to generate a stroke risk
            prediction using the trained Random Forest model.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
        >
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Personal & Medical Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                All fields are required.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              10 Fields
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
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
                    min={field.name === "age" ? "0" : "0.01"}
                    max={field.name === "age" ? "90" : undefined}
                    step="any"
                    required
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Predict Stroke Risk →"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-7 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset Form
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center text-sm font-medium text-blue-700">
            Processing patient information...
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`mt-7 rounded-3xl border p-7 ${
              result.includes("High")
                ? "border-red-200 bg-red-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Prediction Result
            </p>

            <h3
              className={`mt-3 text-2xl font-bold ${
                result.includes("High")
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >
              {result}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {result.includes("High")
                ? "The model has classified this input as high risk. This is not a medical diagnosis."
                : "The model has classified this input as low risk. This does not rule out stroke."}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Disclaimer */}
        <footer className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-amber-900">
            <strong>Disclaimer:</strong> This application is developed for
            educational and demonstration purposes only. Predictions are
            not medical diagnoses and should not be used to make medical
            decisions. Seek professional medical care for health concerns.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;