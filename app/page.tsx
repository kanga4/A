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
