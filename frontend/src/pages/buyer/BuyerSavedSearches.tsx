import { useBuyerStore } from '@/store/useBuyerStore';
import { SavedSearchCard } from '@/components/buyer/SavedSearchCard';
import { Button } from '@/components/ui/button';
import { Search, BellRing } from 'lucide-react';
import { Link } from 'react-router';

export default function BuyerSavedSearches() {
  const { savedSearches } = useBuyerStore();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Saved Searches & Alerts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your saved searches and receive notifications for matching listings.
          </p>
        </div>
        <Button asChild>
          <Link to="/buyer/browse">New Search</Link>
        </Button>
      </div>

      {/* Mock Alert Display to demonstrate UI */}
      {savedSearches.some(s => s.alertEnabled) && (
        <div className="mb-8 bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4">
          <div className="mt-1 bg-primary/20 p-2 rounded-full">
            <BellRing className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Mock Alert Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">
              "3 new businesses match your saved search for 'SaaS'." (This is a frontend UI demonstration only).
            </p>
          </div>
        </div>
      )}

      {savedSearches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No saved searches</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Save your favorite search filters to quickly find new listings and get alerted.
          </p>
          <Button asChild>
            <Link to="/buyer/browse">Browse Businesses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSearches.map(search => (
            <SavedSearchCard key={search.id} search={search} />
          ))}
        </div>
      )}
    </div>
  );
}
