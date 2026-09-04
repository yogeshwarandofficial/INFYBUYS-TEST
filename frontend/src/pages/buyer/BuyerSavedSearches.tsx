import { useSavedSearches } from '@/hooks/useSavedSearches';
import { SavedSearchCard } from '@/components/buyer/SavedSearchCard';
import { Button } from '@/components/ui/button';
import { Search, BellRing } from 'lucide-react';
import { Link } from 'react-router';

export default function BuyerSavedSearches() {
  const { data: savedSearches = [], isLoading } = useSavedSearches();

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading saved searches...</div>;
  }

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 xl:px-0 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">Saved Searches & Alerts</h1>
          <p className="text-[#64748B] mt-2 font-medium">
            Manage your saved searches and receive notifications for matching listings.
          </p>
        </div>
        <Button asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-xl h-11 px-6 transition-all hover:shadow-lg">
          <Link to="/buyer/browse">New Search</Link>
        </Button>
      </div>

      {/* Mock Alert Display to demonstrate UI */}
      {savedSearches.some((s: any) => s.alertFrequency && s.alertFrequency !== 'none') && (
        <div className="mb-8 bg-white/80 backdrop-blur-md border border-blue-100 shadow-sm rounded-xl p-5 flex items-start gap-4">
          <div className="mt-1 bg-blue-50 p-2.5 rounded-full shadow-inner ring-4 ring-blue-50/50">
            <BellRing className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111827] text-lg">Mock Alert Activity</h3>
            <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
              "3 new businesses match your saved search for 'SaaS'." (This is a frontend UI demonstration only).
            </p>
          </div>
        </div>
      )}

      {savedSearches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm">
          <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#EFF6FF]/50">
            <Search className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#111827]">No saved searches</h3>
          <p className="text-[#64748B] mb-8 max-w-sm mx-auto text-[15px] leading-relaxed">
            Save your favorite search filters to quickly find new listings and get alerted.
          </p>
          <Button asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-xl h-12 px-8 font-medium transition-all hover:shadow-lg">
            <Link to="/buyer/browse">Browse Businesses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedSearches.map(search => (
            <SavedSearchCard key={search.id} search={search} />
          ))}
        </div>
      )}
    </div>
  );
}
