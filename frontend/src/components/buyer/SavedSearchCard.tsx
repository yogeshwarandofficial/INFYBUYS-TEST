import { useState } from 'react';
import { useUpdateSavedSearch } from '@/hooks/useSavedSearches';
import type { SavedSearch } from '@/hooks/useSavedSearches';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditSavedSearchDialog } from './EditSavedSearchDialog';
import { DeleteSavedSearchDialog } from './DeleteSavedSearchDialog';
import { MoreVertical, Play, Clock, MapPin, DollarSign, Tag, Bell, BellOff, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router';

interface SavedSearchCardProps {
  search: SavedSearch;
}

export function SavedSearchCard({ search }: SavedSearchCardProps) {
  const { mutate: updateSearch } = useUpdateSavedSearch();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filters = search.filtersJson || {
    query: search.search || '',
    category: search.category || 'all',
    location: search.location || 'all',
    minPrice: search.minPrice || 0,
    maxPrice: search.maxPrice || 0,
    minRevenue: 0,
    status: 'all',
  };
  const alertEnabled = search.alertFrequency && search.alertFrequency !== 'none';
  const toggleSearchAlert = () => updateSearch({ id: search.id, data: { alertFrequency: alertEnabled ? 'none' : 'daily' } });

  // Build the URL for running the search
  const runUrl = new URL('/buyer/browse', window.location.origin);
  if (filters.query) runUrl.searchParams.set('q', filters.query);
  if (filters.category !== 'all') runUrl.searchParams.set('cat', filters.category);
  if (filters.location !== 'all') runUrl.searchParams.set('loc', filters.location);
  if (filters.minPrice > 0) runUrl.searchParams.set('minP', filters.minPrice.toString());
  if (filters.maxPrice > 0) runUrl.searchParams.set('maxP', filters.maxPrice.toString());
  if (filters.minRevenue > 0) runUrl.searchParams.set('minR', filters.minRevenue.toString());
  if (filters.status !== 'all') runUrl.searchParams.set('st', filters.status);

  const runPath = runUrl.pathname + runUrl.search;

  return (
    <>
      <Card className="flex flex-col bg-white/80 backdrop-blur-md border border-[#E5E9F2] shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 border-b border-[#E5E9F2]/50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-1 text-[#111827]">{search.name}</CardTitle>
              <p className="text-[13px] font-medium text-[#64748B] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Created {new Date(search.createdAt).toLocaleDateString()}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                  <MoreVertical className="w-5 h-5" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={runPath} className="cursor-pointer">
                    <Play className="w-4 h-4 mr-2" />
                    Run Search
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowEdit(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Name & Alerts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleSearchAlert}>
                  {alertEnabled ? (
                    <><BellOff className="w-4 h-4 mr-2" /> Disable Alerts</>
                  ) : (
                    <><Bell className="w-4 h-4 mr-2" /> Enable Alerts</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDelete(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Search
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 pt-4">
          {/* Criteria Summary */}
          <div className="flex flex-wrap gap-2">
            {filters.query && (
              <Badge variant="secondary" className="font-normal bg-blue-50 text-blue-700 border-blue-100">
                <Tag className="w-3 h-3 mr-1" /> "{filters.query}"
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="outline" className="font-normal capitalize border-[#E5E9F2] text-[#334155] bg-white/50">
                {filters.category}
              </Badge>
            )}
            {filters.location !== 'all' && (
              <Badge variant="outline" className="font-normal flex items-center capitalize border-[#E5E9F2] text-[#334155] bg-white/50">
                <MapPin className="w-3 h-3 mr-1" /> {filters.location}
              </Badge>
            )}
            {(filters.minPrice > 0 || filters.maxPrice > 0) && (
              <Badge variant="outline" className="font-normal flex items-center border-[#E5E9F2] text-[#334155] bg-white/50">
                <DollarSign className="w-3 h-3 mr-1" />
                {filters.minPrice > 0 ? `${filters.minPrice / 1000}k` : '0'} - {filters.maxPrice > 0 ? `${filters.maxPrice / 1000}k` : 'Any'}
              </Badge>
            )}
            {filters.minRevenue > 0 && (
              <Badge variant="outline" className="font-normal border-[#E5E9F2] text-[#334155] bg-white/50">
                Min Rev: ${(filters.minRevenue / 1000).toFixed(0)}k
              </Badge>
            )}

            {!filters.query && filters.category === 'all' && filters.location === 'all' && filters.minPrice === 0 && filters.maxPrice === 0 && filters.minRevenue === 0 && (
              <span className="text-[13px] text-[#64748B] italic">No specific filters</span>
            )}
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg flex justify-between items-center text-[13px] border border-[#E5E9F2]/50">
            <span className="text-[#64748B] font-medium">Approx. Results</span>
            <span className="font-bold text-[#111827]">0 listings</span>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-[#E5E9F2]/50 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-2">
            <Switch
              checked={!!alertEnabled}
              onCheckedChange={toggleSearchAlert}
              aria-label={alertEnabled ? "Disable alerts" : "Enable alerts"}
            />
            <span className={`text-[13px] font-semibold ${alertEnabled ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
              {alertEnabled ? 'Alerts On' : 'Alerts Off'}
            </span>
          </div>
          <Button size="sm" asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm rounded-lg transition-colors">
            <Link to={runPath}>
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Run
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <EditSavedSearchDialog search={search} open={showEdit} onOpenChange={setShowEdit} />
      <DeleteSavedSearchDialog searchId={search.id} open={showDelete} onOpenChange={setShowDelete} />
    </>
  );
}
