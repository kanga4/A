"use client";

import { useState } from "react";
import pageConfig from "@/lib/page-config";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [survey, setSurvey] = useState({ satisfaction: "", feedback: "" });

  const goToNextPage = () => {
    if (currentPage === "welcome") setCurrentPage("interview");
    else if (currentPage === "interview") setCurrentPage("survey");
    else if (currentPage === "survey") setCurrentPage("thankYou");
  };

  const handleSurveyChange = (e: any) => {
    setSurvey({ ...survey, [e.target.name]: e.target.value });
  };

  const handleSurveySubmit = (e: any) => {
    e.preventDefault();
    console.log("Survey Submitted:", survey);
    goToNextPage();
  };

  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md max-w-sm w-full text-center">
        <h3>End Session?</h3>
        <p className="mb-4">Do you want to complete this conversation?</p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowConfirmation(false)}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => { setShowConfirmation(false); goToNextPage(); }}>Yes</button>
        </div>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold">{pageConfig.welcome.title}</h2>
      <p>{pageConfig.welcome.content}</p>
      <label className="block my-4">
        <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} />
        <span className="ml-2">{pageConfig.welcome.consentText}</span>
      </label>
      <button className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50" onClick={goToNextPage} disabled={!consentGiven}>Continue</button>
    </div>
  );

  const renderInterview = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold">{pageConfig.interview.title}</h2>
      <p>{pageConfig.interview.content}</p>
      <div className="mt-6">
        <button className="px-6 py-2 bg-red-600 text-white rounded" onClick={() => setShowConfirmation(true)}>End Chat</button>
      </div>
      {showConfirmation && <ConfirmationDialog />}
    </div>
  );

  const renderSurvey = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold">{pageConfig.survey.title}</h2>
      <p>{pageConfig.survey.content}</p>
      <form onSubmit={handleSurveySubmit} className="space-y-3">
        <select name="satisfaction" onChange={handleSurveyChange} required className="border px-3 py-2 rounded w-full">
          <option value="">Rate our assistant</option>
          <option value="5">Excellent</option>
          <option value="4">Good</option>
          <option value="3">Average</option>
          <option value="2">Bad</option>
        </select>
        <textarea name="feedback" placeholder="Any comment?" onChange={handleSurveyChange} className="w-full border rounded px-3 py-2"></textarea>
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">{pageConfig.survey.submitButtonText}</button>
      </form>
    </div>
  );

  const renderThankYou = () => (
    <div className="text-center space-y-3">
      <h2 className="text-2xl font-semibold">{pageConfig.thankYou.title}</h2>
      <p>{pageConfig.thankYou.content}</p>
      <p>{pageConfig.thankYou.additionalInfo}</p>
      <p className="mt-6 font-bold text-blue-700">Built by Limits</p>
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
