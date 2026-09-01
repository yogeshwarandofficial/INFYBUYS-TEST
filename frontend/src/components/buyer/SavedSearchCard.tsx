import { useState } from 'react';
import { useBuyerStore } from '@/store/useBuyerStore';
import type { SavedSearch } from '@/store/useBuyerStore';
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
  const { toggleSearchAlert } = useBuyerStore();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { filters } = search;

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
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-1">{search.name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" />
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
                <DropdownMenuItem onClick={() => toggleSearchAlert(search.id)}>
                  {search.alertEnabled ? (
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

        <CardContent className="flex-1 space-y-4">
          {/* Criteria Summary */}
          <div className="flex flex-wrap gap-2">
            {filters.query && (
              <Badge variant="secondary" className="font-normal">
                <Tag className="w-3 h-3 mr-1" /> "{filters.query}"
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="outline" className="font-normal capitalize">
                {filters.category}
              </Badge>
            )}
            {filters.location !== 'all' && (
              <Badge variant="outline" className="font-normal flex items-center capitalize">
                <MapPin className="w-3 h-3 mr-1" /> {filters.location}
              </Badge>
            )}
            {(filters.minPrice > 0 || filters.maxPrice > 0) && (
              <Badge variant="outline" className="font-normal flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                {filters.minPrice > 0 ? `${filters.minPrice / 1000}k` : '0'} - {filters.maxPrice > 0 ? `${filters.maxPrice / 1000}k` : 'Any'}
              </Badge>
            )}
            {filters.minRevenue > 0 && (
              <Badge variant="outline" className="font-normal">
                Min Rev: ${(filters.minRevenue / 1000).toFixed(0)}k
              </Badge>
            )}

            {!filters.query && filters.category === 'all' && filters.location === 'all' && filters.minPrice === 0 && filters.maxPrice === 0 && filters.minRevenue === 0 && (
              <span className="text-sm text-muted-foreground italic">No specific filters</span>
            )}
          </div>

          <div className="bg-muted p-3 rounded-md flex justify-between items-center text-sm">
            <span>Approx. Results</span>
            <span className="font-bold">{search.resultCount} listings</span>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t flex justify-between items-center bg-card rounded-b-xl">
          <div className="flex items-center gap-2">
            <Switch
              checked={search.alertEnabled}
              onCheckedChange={() => toggleSearchAlert(search.id)}
              aria-label={search.alertEnabled ? "Disable alerts" : "Enable alerts"}
            />
            <span className={`text-sm font-medium ${search.alertEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
              {search.alertEnabled ? 'Alerts On' : 'Alerts Off'}
            </span>
          </div>
          <Button size="sm" asChild>
            <Link to={runPath}>
              <Play className="w-4 h-4 mr-1" /> Run
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <EditSavedSearchDialog search={search} open={showEdit} onOpenChange={setShowEdit} />
      <DeleteSavedSearchDialog searchId={search.id} open={showDelete} onOpenChange={setShowDelete} />
    </>
  );
}
