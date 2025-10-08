import React, { useState } from 'react';
import { Loader2, Send, Check } from 'lucide-react';

function WebhookButton({ onClick }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setSent(false);

    await onClick(); // call webhook logic
    setLoading(false);
    setSent(true);

    setTimeout(() => setSent(false), 3000); // reset after 3s
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
        loading
          ? 'bg-blue-400 cursor-wait'
          : sent
          ? 'bg-green-600 hover:bg-green-700 animate-pulse'
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white shadow-md`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Sending...
        </>
      ) : sent ? (
        <>
          <Check className="w-5 h-5" />
          Sent!
        </>
      ) : (
        <>
          <Send className="w-5 h-5" />
          Send Telegram Notification
        </>
      )}
    </button>
  );
}

export default WebhookButton;
