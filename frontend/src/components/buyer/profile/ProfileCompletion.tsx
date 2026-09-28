import { Info, CheckCircle2, Circle } from 'lucide-react';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';

export function ProfileCompletion() {
  const { data: profile } = useBuyerProfile();

  if (!profile) return null;

  const calculateCompletion = () => {
    let score = 0;
    const totalFields = 8;

    if (profile.fullName) score += 1;
    if (profile.email) score += 1;
    if (profile.phone) score += 1;
    if (profile.avatarUrl) score += 1;
    if (profile.company) score += 1;
    if (profile.location) score += 1;
    if (profile.bio) score += 1;
    if (profile.linkedin || profile.website) score += 1;

    return Math.round((score / totalFields) * 100);
  };

  const completion = calculateCompletion();
  const isComplete = completion === 100;

  const steps = [
    { label: 'Basic Information', done: !!profile.fullName && !!profile.email },
    { label: 'Professional Details', done: !!profile.company && !!profile.jobTitle },
    { label: 'Profile Picture', done: !!profile.avatarUrl },
    { label: 'Bio & Links', done: !!profile.bio && (!!profile.linkedin || !!profile.website) },
  ];

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
        <span className="text-2xl font-extrabold text-blue-600 tracking-tight">{completion}%</span>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        {isComplete 
          ? 'Your profile is fully complete. Sellers can see all your details.' 
          : 'Complete your profile to build trust with potential sellers.'}
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-8 border border-slate-200/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] relative overflow-hidden transition-all duration-1000"
          style={{ width: `${completion}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[pan-bg_2s_linear_infinite]" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Tasks:</p>
        <div className="flex flex-col gap-3.5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3 text-[14px]">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-[1px]" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-[1px]" />
              )}
              <span className={step.done ? 'text-slate-900 font-semibold' : 'text-slate-500 font-medium'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
