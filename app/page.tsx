"use client";
import { useState } from "react";
import { PhoneIcon } from "lucide-react";
import Visualizer from "@/components/visualizer";
import useVapi from "@/hooks/use-vapi";
import pageConfig from "@/lib/page-config";

export default function Page() {
  const { toggleCall, isSessionActive } = useVapi();

  const [consentGiven, setConsentGiven] = useState(false);
  const [currentPage, setCurrentPage] = useState("welcome");
  const [surveyData, setSurveyData] = useState({ satisfaction: "", feedback: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const goToNextPage = () => {
    if (currentPage === "welcome") setCurrentPage("interview");
    else if (currentPage === "interview") setCurrentPage("survey");
    else if (currentPage === "survey") setCurrentPage("thankYou");
  };

  const handleSurveyChange = (e: any) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSurveySubmit = (e: any) => {
    e.preventDefault();
    console.log("Survey Submitted:", surveyData);
    goToNextPage();
  };

  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md max-w-sm w-full text-center">
        <h3>End Session?</h3>
        <p className="mb-4">Do you want to complete this conversation?</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
          <button onClick={() => { setShowConfirmation(false); goToNextPage(); }}>Yes</button>
        </div>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">{pageConfig.welcome.title}</h2>
      <p>{pageConfig.welcome.content}</p>
      <label className="block my-4">
        <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} />
        <span className="ml-2">{pageConfig.welcome.consentText}</span>
      </label>
      <button
        onClick={goToNextPage}
        disabled={!consentGiven}
        className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );

  const renderInterview = () => (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">{pageConfig.interview.title}</h2>
      <p>{pageConfig.interview.content}</p>
      <Visualizer />
      <button
        onClick={() => setShowConfirmation(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        End Chat
      </button>
      {showConfirmation && <ConfirmationDialog />}
    </div>
  );

  const renderSurvey = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">{pageConfig.survey.title}</h2>
      <p>{pageConfig.survey.content}</p>
      <form onSubmit={handleSurveySubmit} className="space-y-4">
        <select
          name="satisfaction"
          onChange={handleSurveyChange}
          required
          className="border rounded px-4 py-2"
        >
          <option value="">Rate Sophie</option>
          <option value="5">Excellent</option>
          <option value="4">Good</option>
          <option value="3">Average</option>
          <option value="2">Bad</option>
        </select>
        <br />
        <textarea
          name="feedback"
          placeholder="Any comment?"
          onChange={handleSurveyChange}
          className="w-full border rounded px-4 py-2"
        ></textarea>
        <br />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {pageConfig.survey.submitButtonText}
        </button>
      </form>
    </div>
  );

  const renderThankYou = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">{pageConfig.thankYou.title}</h2>
      <p>{pageConfig.thankYou.content}</p>
      <p>{pageConfig.thankYou.additionalInfo}</p>
      <p className="mt-6 font-bold">Built by Limits</p>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "welcome": return renderWelcome();
      case "interview": return renderInterview();
      case "survey": return renderSurvey();
      case "thankYou": return renderThankYou();
      default: return null;
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50 flex justify-center items-center">
      {renderCurrentPage()}
    </main>
  );
}
