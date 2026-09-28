import { Globe, Link as LinkIcon } from 'lucide-react';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';

export function SocialLinksCard() {
  const { data: profile } = useBuyerProfile();

  if (!profile) return null;

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 relative">
      <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider">Social & Web</h3>
      <ul className="space-y-3">
        {profile.website ? (
          <li className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 border-dashed">
            <Globe className="w-5 h-5 text-blue-500 shrink-0" />
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-semibold text-slate-900 hover:text-blue-600 hover:underline break-all"
            >
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          </li>
        ) : (
          <li className="flex items-center gap-3 text-slate-400 p-2 -mx-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 border-dashed">
            <Globe className="w-5 h-5 shrink-0" />
            <span className="text-[15px] font-medium italic">No website provided +</span>
          </li>
        )}

        {profile.linkedin ? (
          <li className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 border-dashed">
            <LinkIcon className="w-5 h-5 text-[#0077b5] shrink-0" />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-semibold text-slate-900 hover:text-[#0077b5] hover:underline break-all"
            >
              {profile.linkedin.split('/').filter(Boolean).pop() || 'LinkedIn Profile'}
            </a>
          </li>
        ) : (
          <li className="flex items-center gap-3 text-slate-400 p-2 -mx-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 border-dashed">
            <LinkIcon className="w-5 h-5 shrink-0" />
            <span className="text-[15px] font-medium italic">No LinkedIn provided +</span>
          </li>
        )}
      </ul>
    </div>
  );
}
