import { type SellerProfileData as SellerProfile } from '@/hooks/useSellerProfile';
import { Info, CheckCircle2 } from 'lucide-react';

interface SellerProfileCompletionProps {
  profile: SellerProfile;
}

export function SellerProfileCompletion({ profile }: SellerProfileCompletionProps) {
  const fields = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'companyName', label: 'Company' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'location', label: 'Location' },
    { key: 'bio', label: 'Bio' },
    { key: 'website', label: 'Website' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'yearsOfExperience', label: 'Experience' },
    { key: 'preferredCategories', label: 'Categories' },
    { key: 'preferredLocations', label: 'Locations' },
  ] as const;

  const filledFields = fields.filter((f) => {
    const val = profile[f.key];
    if (Array.isArray(val)) return val.length > 0;
    return val && typeof val === 'string' && val.trim() !== '';
  });

  const completionPercentage = Math.round((filledFields.length / fields.length) * 100);
  const isComplete = completionPercentage === 100;

  return (
    <div className="bg-white rounded-[24px] border border-blue-200 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] p-8 relative overflow-hidden">
      {/* Subtle BG glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          Profile Strength
          {isComplete ? (
            <CheckCircle2 className="text-emerald-500 w-4 h-4 fill-emerald-100" />
          ) : (
            <Info className="text-blue-400 w-4 h-4 fill-blue-50" />
          )}
        </h3>
        <span className="text-2xl font-extrabold text-blue-600 tracking-tight">{completionPercentage}%</span>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        {isComplete 
          ? 'Your profile is fully complete. Buyers can see all your details.' 
          : 'Complete your profile to build trust with potential buyers and increase listing views.'}
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-8 border border-slate-200/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] relative overflow-hidden transition-all duration-1000"
          style={{ width: `${completionPercentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[pan-bg_2s_linear_infinite]" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
        </div>
      </div>

      {!isComplete && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Action Required:</p>
          <div className="flex flex-wrap gap-2">
            {fields
              .filter((f) => !filledFields.includes(f))
              .map((f, index) => {
                // Highlight the first 3 missing items for emphasis
                const isPriority = index < 3;
                return (
                  <button 
                    key={f.key}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] transition-all ${
                      isPriority 
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60 font-bold hover:bg-amber-100 hover:shadow-sm hover:-translate-y-0.5' 
                        : 'bg-slate-50 text-slate-600 border-slate-200/60 font-semibold hover:bg-slate-100'
                    }`}
                  >
                    {f.label} {isPriority && '+'}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
