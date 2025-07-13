"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/page.module.css";
import Visualizer from "../components/visualizer";

const pageConfig = {
  welcome: {
    enabled: true,
    order: 1,
    title: "Welcome to Sophie",
    content: "Before we begin, please agree below to talk to Sophie, your assistant.",
    consentText: "I agree to talk with Sophie and understand how my data will be used.",
  },
  interview: {
    enabled: true,
    order: 2,
    title: "Sophie – AI Assistant",
    content: "Sophie is here to help. You may speak naturally and ask any support-related questions.",
  },
  survey: {
    enabled: true,
    order: 3,
    title: "Feedback",
    content: "Please tell us how Sophie did today.",
    submitButtonText: "Send Feedback",
  },
  thankYou: {
    enabled: true,
    order: 4,
    title: "Thank You!",
    content: "Thanks for using Sophie. This conversation is complete.",
    additionalInfo: "You may close this window now.",
  }
};

const ACTIVE_COMPONENT = 'visualizer';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState({
    satisfaction: "",
    feedback: "",
    improvements: ""
  });

  useEffect(() => {
    if (currentPage === null) {
      const enabledPages = Object.entries(pageConfig)
        .filter(([_, config]) => config.enabled)
        .sort((a, b) => a[1].order - b[1].order);
      if (enabledPages.length > 0) {
        setCurrentPage(enabledPages[0][0]);
      }
    }
  }, [currentPage]);

  const goToNextPage = () => {
    const enabledPages = Object.entries(pageConfig)
      .filter(([_, config]) => config.enabled)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([key]) => key);

    const currentIndex = enabledPages.indexOf(currentPage as string);
    if (currentIndex < enabledPages.length - 1) {
      setCurrentPage(enabledPages[currentIndex + 1]);
    }
  };

  const handleSurveyChange = (e: any) => {
    const { name, value } = e.target;
    setSurveyResponses(prev => ({ ...prev, [name]: value }));
  };

  const handleSurveySubmit = (e: any) => {
    e.preventDefault();
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
    <div className={styles.container}>
      <h2 className={styles.title}>{pageConfig.welcome.title}</h2>
      <p className={styles.text}>{pageConfig.welcome.content}</p>
      <label className="block my-4">
        <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} />
        <span className="ml-2">{pageConfig.welcome.consentText}</span>
      </label>
      <button onClick={goToNextPage} disabled={!consentGiven}>Continue</button>
    </div>
  );

  const renderInterview = () => (
    <div className={styles.container}>
      <h2 className={styles.title}>{pageConfig.interview.title}</h2>
      <p className={styles.text}>{pageConfig.interview.content}</p>
      <Visualizer />
      <button onClick={() => setShowConfirmation(true)}>End Chat</button>
      {showConfirmation && <ConfirmationDialog />}
    </div>
  );

  const renderSurvey = () => (
    <div className={styles.container}>
      <h2 className={styles.title}>{pageConfig.survey.title}</h2>
      <p className={styles.text}>{pageConfig.survey.content}</p>
      <form onSubmit={handleSurveySubmit}>
        <select name="satisfaction" onChange={handleSurveyChange} required>
          <option value="">Rate Sophie</option>
          <option value="5">Excellent</option>
          <option value="4">Good</option>
          <option value="3">Average</option>
          <option value="2">Bad</option>
        </select>
        <textarea name="feedback" placeholder="Any comment?" onChange={handleSurveyChange}></textarea>
        <button type="submit">{pageConfig.survey.submitButtonText}</button>
      </form>
    </div>
  );

  const renderThankYou = () => (
    <div className={styles.container}>
      <h2 className={styles.title}>{pageConfig.thankYou.title}</h2>
      <p className={styles.text}>{pageConfig.thankYou.content}</p>
      <p>{pageConfig.thankYou.additionalInfo}</p>
      <p style={{ marginTop: "20px", fontWeight: "bold" }}>Built by Limits</p>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome': return renderWelcome();
      case 'interview': return renderInterview();
      case 'survey': return renderSurvey();
      case 'thankYou': return renderThankYou();
      default: return null;
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50 flex justify-center items-center">
      {renderCurrentPage()}
    </main>
  );
}
