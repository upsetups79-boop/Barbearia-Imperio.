import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessional, getService } from '../../config/shop';
import { bookingRepository, BookingConflictError } from '../../data/supabaseBookingRepository';
import { isValidPhone } from '../../lib/format';
import type { ServiceId } from '../../types';
import { Button } from '../ui/Button';
import { ArrowLeftIcon, CheckIcon } from '../ui/Icons';
import { DetailsStep } from './DetailsStep';
import { ProfessionalStep } from './ProfessionalStep';
import { ScheduleStep } from './ScheduleStep';
import { ServiceStep } from './ServiceStep';
import { Stepper } from './Stepper';
import type { SummaryData } from './SummaryCard';

const STEPS = ['Servico', 'Profissional', 'Horario', 'Dados'];

const TITLES = [
  'O que vamos fazer hoje?',
  'Com quem voce quer cortar?',
  'Escolha o melhor horario',
  'Quase la, confirme seus dados',
];

export function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<ServiceId | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const service = serviceId ? getService(serviceId) : undefined;
  const professional = professionalId ? getProfessional(professionalId) : undefined;

  const summary: SummaryData | null = useMemo(() => {
    if (!service || !professional || !dateKey || !time) return null;
    return {
      serviceName: service.name,
      professionalName: professional.name,
      dateKey,
      startTime: time,
      durationMin: service.durationMin,
      price: service.price,
    };
  }, [service, professional, dateKey, time]);

  const canAdvance =
    (step === 0 && Boolean(serviceId)) ||
    (step === 1 && Boolean(professionalId)) ||
    (step === 2 && Boolean(dateKey && time)) ||
    step === 3;

  function goBack() {
    setFormError(null);
    setStep((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setFormError(null);
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  }

  function handleSelectService(id: ServiceId) {
    setServiceId(id);
    setTime(null);
    setStep(1);
  }

  function handleSelectProfessional(id: string) {
    setProfessionalId(id);
    setTime(null);
    setStep(2);
  }

  function handleField(field: 'name' | 'phone' | 'notes', value: string) {
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value);
    if (field === 'notes') setNotes(value);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit() {
    if (!service || !professional || !dateKey || !time) return;

    const errors: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) errors.name = 'Informe seu nome completo.';
    if (!isValidPhone(phone)) errors.phone = 'Informe um WhatsApp valido com DDD.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const booking = await bookingRepository.create({
        serviceId: service.id,
        serviceName: service.name,
        professionalId: professional.id,
        professionalName: professional.name,
        date: dateKey,
        startTime: time,
        durationMin: service.durationMin,
        price: service.price,
        customerName: name.trim(),
        customerPhone: phone,
        notes: notes.trim() || undefined,
      });
      navigate(`/confirmacao/${booking.id}`);
    } catch (error) {
      if (error instanceof BookingConflictError) {
        setTime(null);
        setStep(2);
        setFormError(error.message);
      } else {
        setFormError('Nao foi possivel concluir o agendamento. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="agendar" className="mx-auto w-full max-w-lg px-5 pb-32">
      <div className="sticky top-0 z-10 -mx-5 bg-ink/95 px-5 pt-5 pb-4 backdrop-blur">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="mb-5 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            aria-label="Voltar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-gold/60 hover:text-gold"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
        )}
        <h2 className="font-display text-2xl leading-tight font-semibold text-white">
          {TITLES[step]}
        </h2>
      </div>

      {formError && (
        <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      )}

      {step === 0 && <ServiceStep selectedId={serviceId} onSelect={handleSelectService} />}

      {step === 1 && (
        <ProfessionalStep selectedId={professionalId} onSelect={handleSelectProfessional} />
      )}

      {step === 2 && service && professionalId && (
        <ScheduleStep
          service={service}
          professionalId={professionalId}
          dateKey={dateKey}
          time={time}
          onSelectDate={(key) => {
            setDateKey(key);
            setTime(null);
          }}
          onSelectTime={setTime}
        />
      )}

      {step === 3 && summary && (
        <DetailsStep
          summary={summary}
          name={name}
          phone={phone}
          notes={notes}
          errors={fieldErrors}
          onChange={handleField}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ink/95 px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto w-full max-w-lg">
          {step < 3 ? (
            <Button full disabled={!canAdvance} onClick={goNext}>
              Continuar
            </Button>
          ) : (
            <Button full disabled={submitting} onClick={handleSubmit}>
              {submitting ? (
                'Confirmando...'
              ) : (
                <>
                  <CheckIcon className="h-5 w-5" />
                  Confirmar agendamento
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
