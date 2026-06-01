import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/shared/PageTransition';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0C0F] relative overflow-hidden flex flex-col items-center justify-center">
        <div className="forge-blob absolute inset-0 w-full h-full m-auto opacity-30 pointer-events-none" />
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="font-display font-bold text-[160px] leading-none text-[#F97316]/10 select-none">
            404
          </div>
          
          <h1 className="font-display text-2xl text-[#F97316] mt-4 font-bold">
            You've wandered off the blueprint.
          </h1>
          
          <p className="text-[#64748B] text-sm mt-2">
            This schematic doesn't exist or has been moved.
          </p>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-8 border border-[#1E2530] hover:bg-[#181C23] hover:text-white text-[#94A3B8] px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
