import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface DashboardSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSelectModal({ isOpen, onClose }: DashboardSelectModalProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8 sm:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Where would you like to go?
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Choose a dashboard to start exploring or managing your listings.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
                {/* Buyer Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-8 text-center transition-all hover:border-blue-500 hover:shadow-xl"
                  onClick={() => {
                    onClose();
                    navigate('/buyer');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                    <ShoppingCart className="h-10 w-10" />
                  </div>
                  <h3 className="relative z-10 mt-6 text-2xl font-bold text-slate-900">
                    I am a Buyer
                  </h3>
                  <p className="relative z-10 mt-3 text-slate-500">
                    Discover premium businesses, manage saved searches, and contact sellers.
                  </p>
                  <div className="relative z-10 mt-6 flex items-center text-sm font-semibold text-blue-600">
                    Go to Buyer Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>

                {/* Seller Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-8 text-center transition-all hover:border-purple-500 hover:shadow-xl"
                  onClick={() => {
                    onClose();
                    navigate('/seller');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">
                    <Store className="h-10 w-10" />
                  </div>
                  <h3 className="relative z-10 mt-6 text-2xl font-bold text-slate-900">
                    I am a Seller
                  </h3>
                  <p className="relative z-10 mt-3 text-slate-500">
                    List your business, track performance, and manage buyer inquiries.
                  </p>
                  <div className="relative z-10 mt-6 flex items-center text-sm font-semibold text-purple-600">
                    Go to Seller Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </div>

              <div className="mt-10 text-center">
                <Button variant="ghost" className="text-slate-500 hover:text-slate-900" onClick={onClose}>
                  Stay on Homepage
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
