import { useState, useMemo } from 'react';
import type { AdminAuditAction, AdminAuditEntityType } from '@/store/useAdminStore';
import { useAdminStore } from '@/store/useAdminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ClipboardList,
  Search,
  Trash2,
  MoreHorizontal,
  Download,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<AdminAuditAction, { label: string; class: string }> = {
  create:            { label: 'Create',            class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  update:            { label: 'Update',            class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  delete:            { label: 'Delete',            class: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  approve:           { label: 'Approve',           class: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  reject:            { label: 'Reject',            class: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  publish:           { label: 'Publish',           class: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  hide:              { label: 'Hide',              class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
  archive:           { label: 'Archive',           class: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300' },
  close:             { label: 'Close',             class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
  login:             { label: 'Login',             class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  logout:            { label: 'Logout',            class: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300' },
  export:            { label: 'Export',            class: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
  settings_update:   { label: 'Settings',          class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  status_change:     { label: 'Status Change',     class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  message_sent:      { label: 'Message Sent',      class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' },
  notification_sent: { label: 'Notification',      class: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300' },
};

const ENTITY_LABELS: Record<AdminAuditEntityType, string> = {
  user:         'User',
  seller:       'Seller',
  buyer:        'Buyer',
  listing:      'Listing',
  enquiry:      'Enquiry',
  conversation: 'Conversation',
  review:       'Review',
  notification: 'Notification',
  settings:     'Settings',
  report:       'Report',
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const d = Math.floor(hrs / 24);
  return `${d}d ago`;
}

function formatFullTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const PAGE_SIZE = 10;

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminActivityLog() {
  const { auditLogs, deleteAuditLog, clearAuditLogs } = useAdminStore();

  const [search, setSearch]             = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | AdminAuditAction>('all');
  const [entityFilter, setEntityFilter] = useState<'all' | AdminAuditEntityType>('all');
  const [dateRange, setDateRange]       = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [page, setPage]                 = useState(1);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // ── KPI stats ──────────────────────────────────────────────────────────────
  const totalLogs = auditLogs.length;
  const todayCutoff = new Date(); todayCutoff.setHours(0, 0, 0, 0);
  const logsToday = auditLogs.filter(l => new Date(l.createdAt) >= todayCutoff).length;
  const uniqueActors = new Set(auditLogs.map(l => l.performedById)).size;
  const actionCounts = auditLogs.reduce<Record<string, number>>((acc, l) => {
    acc[l.action] = (acc[l.action] ?? 0) + 1; return acc;
  }, {});
  const topAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as AdminAuditAction | undefined;

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const dateCutoff =
      dateRange === '7d'  ? Date.now() - 7  * 86400000 :
      dateRange === '30d' ? Date.now() - 30 * 86400000 :
      dateRange === '90d' ? Date.now() - 90 * 86400000 : 0;

    const q = search.toLowerCase();
    return auditLogs.filter(l => {
      if (dateRange !== 'all' && new Date(l.createdAt).getTime() < dateCutoff) return false;
      if (actionFilter !== 'all' && l.action !== actionFilter)                 return false;
      if (entityFilter !== 'all' && l.entityType !== entityFilter)             return false;
      if (q && !l.description.toLowerCase().includes(q) &&
               !l.performedBy.toLowerCase().includes(q) &&
               !(l.entityLabel ?? '').toLowerCase().includes(q))               return false;
      return true;
    });
  }, [auditLogs, search, actionFilter, entityFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => { setSearch(''); setActionFilter('all'); setEntityFilter('all'); setDateRange('all'); setPage(1); };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit-log-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearConfirm = () => { clearAuditLogs(); setClearDialogOpen(false); };

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Activity & Audit Log</h1>
            <p className="text-[15px] text-[#64748B] mt-1">Track all administrative actions performed on the platform.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportJSON}>
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => setClearDialogOpen(true)}
              disabled={auditLogs.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              Clear Log
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 min-w-0">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Logs</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
              <span className="text-3xl font-bold">{totalLogs}</span>
              <span className="text-xs text-muted-foreground">All recorded actions</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Today</span>
                <div className="w-10 h-10 rounded-xl bg-sky-50/80 text-sky-600 border border-sky-100/50 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <span className="text-3xl font-bold">{logsToday}</span>
              <span className="text-xs text-muted-foreground">Actions today</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Unique Actors</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50/80 text-purple-600 border border-purple-100/50 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <span className="text-3xl font-bold">{uniqueActors}</span>
              <span className="text-xs text-muted-foreground">Distinct admins</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Top Action</span>
                <div className="w-10 h-10 rounded-xl bg-teal-50/80 text-teal-600 border border-teal-100/50 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <span className="text-3xl font-bold capitalize">
                {topAction ? ACTION_STYLES[topAction]?.label : '—'}
              </span>
              <span className="text-xs text-muted-foreground">
                {topAction ? `${actionCounts[topAction]} occurrences` : 'No data'}
              </span>
            </CardContent>
          </Card>
        </div>


        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="audit-search"
                placeholder="Search description, actor, entity…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={v => { setActionFilter(v as typeof actionFilter); setPage(1); }}>
              <SelectTrigger id="action-filter" className="w-[170px]">
                <SelectValue placeholder="Action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {(Object.keys(ACTION_STYLES) as AdminAuditAction[]).map(a => (
                  <SelectItem key={a} value={a}>{ACTION_STYLES[a].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={v => { setEntityFilter(v as typeof entityFilter); setPage(1); }}>
              <SelectTrigger id="entity-filter" className="w-[150px]">
                <SelectValue placeholder="Entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {(Object.keys(ENTITY_LABELS) as AdminAuditEntityType[]).map(e => (
                  <SelectItem key={e} value={e}>{ENTITY_LABELS[e]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={v => { setDateRange(v as typeof dateRange); setPage(1); }}>
              <SelectTrigger id="date-filter" className="w-[140px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            {(search || actionFilter !== 'all' || entityFilter !== 'all' || dateRange !== 'all') && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                Reset filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ── Results summary ── */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filtered.length}</strong> of <strong>{totalLogs}</strong> log entries
          </p>
        </div>

        {/* ── Table ── */}
        {paginated.length === 0 ? (
          <Card>
            <CardContent className="py-20 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No audit logs found</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {totalLogs === 0
                    ? 'The activity log is empty. Actions taken in the admin portal will appear here.'
                    : 'No entries match your current filters. Try adjusting your search or filters.'}
                </p>
              </div>
              {totalLogs > 0 && (
                <Button variant="outline" onClick={resetFilters}>Clear filters</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Timestamp</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Actor</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Action</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Entity</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">IP Address</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map(log => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{formatRelativeTime(log.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">{formatFullTime(log.createdAt)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {log.performedBy.charAt(0)}
                          </div>
                          <span className="font-medium">{log.performedBy}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={cn(
                            'text-xs font-medium border-0',
                            ACTION_STYLES[log.action]?.class
                          )}
                        >
                          {ACTION_STYLES[log.action]?.label ?? log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-muted-foreground">{ENTITY_LABELS[log.entityType]}</div>
                        {log.entityLabel && (
                          <div className="font-medium truncate max-w-[120px]">{log.entityLabel}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[300px]">
                        <p className="text-sm line-clamp-2">{log.description}</p>
                        {log.metadata && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(log.metadata).map(([k, v]) => (
                              <span key={k} className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-muted-foreground">{log.ipAddress ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteAuditLog(log.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete entry
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Clear Logs Confirmation Dialog ── */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear All Audit Logs
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all <strong>{totalLogs}</strong> audit log entries. This action
              cannot be undone. The activity history will be empty.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleClearConfirm}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
