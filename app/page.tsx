'use client';
import { useState } from 'react';
import { PhoneIcon } from 'lucide-react';
import pageConfig from '@/lib/page-config';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [feedback, setFeedback] = useState({ satisfaction: '', feedback: '' });

  const goToNextPage = () => {
    if (currentPage === 'welcome') setCurrentPage('interview');
    else if (currentPage === 'interview') setCurrentPage('survey');
    else if (currentPage === 'survey') setCurrentPage('thankYou');
  };

  const handleSurveyChange = (e: any) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
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
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">Welcome to Limits Edits AI</h2>
      <p>I create professional QR designs, thumbnails, posters, banners, and more.</p>
      <label className="block">
        <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} />
        <span className="ml-2">I agree to interact with the AI assistant</span>
      </label>
      <button onClick={goToNextPage} disabled={!consentGiven} className="bg-blue-600 text-white px-4 py-2 rounded">Continue</button>
    </div>
  );
const renderInterview = () => (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">Ask me anything about my services</h2>
      <p>I can design QR codes, posters, thumbnails, video edits, banners and more. What do you need?</p>
      
      {/* You can plug in a live AI chatbot or typing effect here */}
      <div className="border p-4 rounded shadow mt-4 bg-white text-black">
        <p className="italic">"Hi there! 👋 I’m Limits AI. Tell me what you're looking for – a QR design, poster, video edit, or more."</p>
      </div>

      <button
        onClick={() => setShowConfirmation(true)}
        className="bg-red-600 text-white px-4 py-2 rounded mt-6"
      >
        End Chat
      </button>

      {showConfirmation && <ConfirmationDialog />}
    </div>
  );

  const renderSurvey = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">Rate My AI Help</h2>
      <p>Your feedback helps improve the AI assistant.</p>
      <form onSubmit={handleSurveySubmit} className="space-y-4">
        <select
          name="satisfaction"
          onChange={handleSurveyChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Choose Rating</option>
          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
          <option value="4">⭐⭐⭐⭐ Good</option>
          <option value="3">⭐⭐⭐ Average</option>
          <option value="2">⭐⭐ Poor</option>
          <option value="1">⭐ Bad</option>
        </select>
        <textarea
          name="feedback"
          onChange={handleSurveyChange}
          placeholder="Any suggestions?"
          className="w-full p-2 border rounded"
        ></textarea>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );

  const renderThankYou = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">Thank You!</h2>
      <p>I appreciate your interest in Limits Edits.</p>
      <p className="text-sm">You can contact me anytime to get posters, thumbnails, banners, QR designs, or custom edits done professionally.</p>
      <p className="font-semibold text-blue-700 mt-4">WhatsApp: +91 93624 25113</p>
      <p className="text-gray-500 text-sm mt-6">Powered by Limits AI</p>
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
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        {renderCurrentPage()}
      </div>
    </main>
  );
}
