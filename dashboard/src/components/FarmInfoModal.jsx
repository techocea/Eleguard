import React, { useState } from 'react';
import { Droplets, TreePine, Calendar, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useFarmInfo } from '../hooks/useFarmInfo';
import { toast } from './Toast';

function FloatingInput({ id, label, type = 'text', value, onChange, placeholder, icon: Icon, unit, error, min }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs font-bold mb-1.5 transition-colors duration-200"
        style={{ color: focused ? '#81C784' : '#5F6B63', letterSpacing: '0.08em' }}>
        {label} <span style={{ color: '#EF5350' }}>*</span>
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4 transition-colors duration-200" style={{ color: focused ? '#81C784' : '#3D5C41' }} />
          </div>
        )}
        <input
          id={id} type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} min={min}
          className="w-full rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: focused ? 'rgba(15,20,18,0.95)' : 'rgba(15,20,18,0.7)',
            border: error ? '1.5px solid rgba(239,83,80,0.7)' : focused ? '1.5px solid rgba(129,199,132,0.7)' : '1.5px solid rgba(129,199,132,0.15)',
            color: '#E8F5E9', padding: Icon ? '12px 48px 12px 40px' : '12px 48px 12px 14px',
            boxShadow: focused ? '0 0 0 3px rgba(129,199,132,0.08)' : 'none', outline: 'none',
          }} />
        {unit && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-xs font-semibold" style={{ color: '#3D5C41' }}>{unit}</span>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" style={{ color: '#EF5350' }} />
          <p className="text-xs" style={{ color: '#EF5350' }}>{error}</p>
        </div>
      )}
    </div>
  );
}

function StepBar({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-1.5 rounded-full transition-all duration-500"
          style={{ flex: i === current ? 2 : 1, background: i <= current ? '#81C784' : 'rgba(129,199,132,0.2)' }} />
      ))}
    </div>
  );
}

export default function FarmInfoModal() {
  const { showModal, saveFarmInfo } = useFarmInfo();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ farmername: '', water_canal_present: '', forest_distance_m: '', harvest_date: '' });
  const [errors, setErrors] = useState({});

  if (!showModal) return null;

  const today = new Date().toISOString().split('T')[0];

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && !form.farmername.trim()) errs.farmername = 'Farmer name is required';
    if (s === 1) {
      if (!form.water_canal_present) errs.water_canal_present = 'Distance is required';
      else if (Number(form.water_canal_present) < 0) errs.water_canal_present = 'Must be a positive number';
      if (!form.forest_distance_m) errs.forest_distance_m = 'Distance is required';
      else if (Number(form.forest_distance_m) < 0) errs.forest_distance_m = 'Must be a positive number';
    }
    if (s === 2) {
      if (!form.harvest_date) errs.harvest_date = 'Harvest date is required';
      else if (form.harvest_date < today) errs.harvest_date = 'Harvest date cannot be in the past';
    }
    return errs;
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const errs = validateStep(2);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await saveFarmInfo({
        farmername: form.farmername.trim(),
        water_canal_present: Number(form.water_canal_present),
        forest_distance_m: Number(form.forest_distance_m),
        harvest_date: form.harvest_date,
      });
      setSuccess(true);
      setTimeout(() => toast.success('Farm information saved successfully!'), 600);
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [
    {
      title: 'Your Details', subtitle: 'Tell us about yourself', icon: '👨‍🌾',
      content: (
        <FloatingInput id="farmername" label="FARMER NAME" value={form.farmername} onChange={set('farmername')}
          placeholder="e.g. Kamal Perera" error={errors.farmername}
          icon={({ className, style }) => <span style={{ ...style, fontSize: 14 }}>👤</span>} />
      ),
    },
    {
      title: 'Farm Proximity', subtitle: 'Distance measurements for threat analysis', icon: '📍',
      content: (
        <div className="space-y-4">
          <FloatingInput id="water_canal" label="DISTANCE TO WATER CANAL" type="number"
            value={form.water_canal_present} onChange={set('water_canal_present')}
            placeholder="Enter distance from nearest water canal" icon={Droplets} unit="m"
            error={errors.water_canal_present} min="0" />
          <FloatingInput id="forest_distance" label="DISTANCE TO FOREST BOUNDARY" type="number"
            value={form.forest_distance_m} onChange={set('forest_distance_m')}
            placeholder="Enter distance from forest boundary" icon={TreePine} unit="m"
            error={errors.forest_distance_m} min="0" />
        </div>
      ),
    },
    {
      title: 'Harvest Timeline', subtitle: 'Expected harvest date for risk calculation', icon: '🌾',
      content: (
        <FloatingInput id="harvest_date" label="EXPECTED HARVEST DATE" type="date"
          value={form.harvest_date} onChange={set('harvest_date')} icon={Calendar}
          error={errors.harvest_date} min={today} />
      ),
    },
  ];

  const cur = STEPS[step];

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: 'rgba(7,12,10,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease-out' }} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md" style={{ animation: success ? 'scaleOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards' : 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div className="rounded-3xl overflow-hidden shadow-2xl" style={{
            background: 'linear-gradient(145deg, rgba(23,35,27,0.99) 0%, rgba(13,18,15,0.99) 100%)',
            border: '1px solid rgba(129,199,132,0.22)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(129,199,132,0.05), inset 0 1px 0 rgba(129,199,132,0.12)',
          }}>
            {/* Header */}
            <div className="relative px-7 pt-7 pb-5" style={{ background: 'linear-gradient(135deg, rgba(27,94,32,0.25) 0%, transparent 60%)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, transparent, #81C784 40%, #A5D6A7 60%, transparent)' }} />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', boxShadow: '0 4px 15px rgba(46,125,50,0.45)' }}>🌱</div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold" style={{ color: '#E8F5E9' }}>Farm Information Setup</h2>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#5F6B63' }}>Please complete your cultivation details for accurate elephant threat prediction.</p>
                </div>
              </div>
              <div className="mt-4">
                <StepBar current={step} total={STEPS.length} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs" style={{ color: '#3D5C41' }}>Step {step + 1} of {STEPS.length}</span>
                  <span className="text-xs font-semibold" style={{ color: '#81C784' }}>{cur.title}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-7 pb-7">
              <div className="flex items-center gap-3 mb-5 p-3.5 rounded-2xl" style={{ background: 'rgba(15,20,18,0.5)', border: '1px solid rgba(129,199,132,0.08)' }}>
                <span className="text-2xl">{cur.icon}</span>
                <div>
                  <div className="font-display font-bold text-sm" style={{ color: '#E8F5E9' }}>{cur.title}</div>
                  <div className="text-xs" style={{ color: '#4A5C4E' }}>{cur.subtitle}</div>
                </div>
              </div>

              <div className="mb-6" key={step} style={{ animation: 'slideUp 0.25s ease-out' }}>
                {cur.content}
              </div>

              <div className="flex gap-3">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:brightness-110"
                    style={{ background: 'rgba(27,35,30,0.8)', border: '1px solid rgba(129,199,132,0.2)', color: '#A5D6A7' }}>
                    ← Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#E8F5E9', boxShadow: '0 4px 15px rgba(46,125,50,0.4)' }}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all duration-200"
                    style={{ background: submitting ? 'rgba(46,125,50,0.4)' : 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#E8F5E9', boxShadow: submitting ? 'none' : '0 4px 15px rgba(46,125,50,0.4)' }}>
                    {submitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Complete Setup</>}
                  </button>
                )}
              </div>
              <p className="text-center text-xs mt-4" style={{ color: '#2D3B30' }}>🔒 Your data is encrypted and used only for threat prediction</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.88) translateY(20px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes scaleOut { from { opacity:1; transform:scale(1) } to { opacity:0; transform:scale(0.92) translateY(-10px) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </>
  );
}
