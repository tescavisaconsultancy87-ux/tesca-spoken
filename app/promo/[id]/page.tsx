import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import PromoForm from './PromoForm';
import { Metadata } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getPopup(id: string) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from('popup_settings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const popup = await getPopup(id);
  if (!popup) {
    return {
      title: 'TESCA Spoken English',
    };
  }
  return {
    title: `${popup.title} | TESCA`,
    description: popup.subtitle || 'Register to receive details.',
  };
}

export default async function PromoLandingPage({ params }: PageProps) {
  const { id } = await params;
  const popup = await getPopup(id);
  if (!popup) {
    notFound();
  }

  const reqFields = Array.isArray(popup.required_fields) ? popup.required_fields : ['name', 'phone'];

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[500px]">
        {/* Left side: Flyer Image */}
        <div className="w-full md:w-1/2 relative bg-slate-900 overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-auto">
          <img src={popup.image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none select-none" />
          <img src={popup.image_url} alt={popup.title} className="absolute inset-0 m-auto max-w-full max-h-full object-contain p-4 md:p-8 pointer-events-none select-none" />
        </div>

        {/* Right side: Lead capture form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="space-y-6 text-left">
            <div>
              <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest text-[#067779] bg-[#f0fafa] border border-[#d9f2f2] px-2.5 py-0.5 rounded-full mb-3 font-sans">Featured Update</span>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 leading-tight">
                {popup.title}
              </h1>
              {popup.subtitle && (
                <p className="text-slate-500 text-xs mt-3 leading-relaxed font-sans font-normal">
                  {popup.subtitle}
                </p>
              )}
            </div>

            <PromoForm popupId={popup.id} popupTitle={popup.title} requiredFields={reqFields} />
          </div>
        </div>
      </div>
    </main>
  );
}
