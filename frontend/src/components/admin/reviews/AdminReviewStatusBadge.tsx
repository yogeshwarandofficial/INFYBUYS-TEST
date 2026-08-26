import { Badge } from '../../ui/badge';
import type { AdminReviewStatus } from '../../../store/useAdminStore';

interface AdminReviewStatusBadgeProps {
  status: AdminReviewStatus;
}

export function AdminReviewStatusBadge({ status }: AdminReviewStatusBadgeProps) {
  switch (status) {
    case 'published':
      return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Published</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>;
    case 'flagged':
      return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">Flagged</Badge>;
    case 'hidden':
      return <Badge variant="outline" className="text-slate-500">Hidden</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
