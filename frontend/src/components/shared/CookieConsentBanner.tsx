import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('infybuys-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (type: 'accept' | 'reject' | 'manage') => {
    if (type === 'manage') {
      // In a real app, open a modal to manage preferences
      alert('Manage Preferences Modal');
      return;
    }

    localStorage.setItem('infybuys-cookie-consent', type);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 md:p-6 flex justify-center pointer-events-none"
        >
          <Card className="w-full max-w-4xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6 pointer-events-auto bg-background/95 backdrop-blur-md border-border">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
              <Button variant="outline" onClick={() => handleConsent('manage')}>
                Manage Preferences
              </Button>
              <Button variant="secondary" onClick={() => handleConsent('reject')}>
                Reject All
              </Button>
              <Button onClick={() => handleConsent('accept')}>
                Accept All
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
