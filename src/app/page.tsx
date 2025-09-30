"use client";
import { useState } from 'react';
// Importowanie ikon
import { FaHome, FaTimes, FaBuilding, FaGavel, FaFileInvoiceDollar, FaUniversity, FaQuestionCircle, FaReceipt } from 'react-icons/fa';
// Importowanie komponentów
import ToggleButtonGroup from "@/app/comps/ToggleBtn";
import RangeSlider from "@/app/comps/Range";
import CounterCard from "@/app/comps/Counter";

// Definicja stanu formularza
interface DetailedFormData {
  posiadaNieruchomosc: string;
  chronicPrzedZajeciem: string;
  sumaDlugow: number;
  ileMiesiecznie: number;
  czyObecnieSplacasz: string;
  rodzajeZadluzen: { [key: string]: number };
  pilnoscSprawy: number;
}

// Typ dla statusu wysyłki
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function SzczegolowyFormularz() {
  const [formData, setFormData] = useState<DetailedFormData>({
    posiadaNieruchomosc: '',
    chronicPrzedZajeciem: '',
    sumaDlugow: 100000,
    ileMiesiecznie: 500,
    czyObecnieSplacasz: 'Nie',
    rodzajeZadluzen: {
      konsumenckie: 0,
      hipoteczne: 0,
      chwilowki: 0,
      alimenty: 0,
      zus: 0,
      inne: 0,
    },
    pilnoscSprawy: 7,
  });

  // NOWY STAN: do zarządzania procesem wysyłki
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');

  const handleToggleChange = (name: keyof DetailedFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleCounterChange = (name: string, type: 'inc' | 'dec') => {
    setFormData(prev => {
      const currentCount = prev.rodzajeZadluzen[name];
      const newCount = type === 'inc' ? currentCount + 1 : Math.max(0, currentCount - 1);
      return {
        ...prev,
        rodzajeZadluzen: { ...prev.rodzajeZadluzen, [name]: newCount }
      };
    });
  };

  // NOWA FUNKCJA: Wysyłka danych do Formspree
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Zapobiegamy domyślnemu przeładowaniu strony
    setSubmissionStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/mnnbwnlq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        throw new Error('Błąd podczas wysyłania formularza.');
      }
    } catch (error) {
      console.error(error);
      setSubmissionStatus('error');
    }
  };

  const formatCurrency = (value: number) => `${value.toLocaleString('pl-PL')} zł`;

  // Definicje opcji dla przełączników
  const opcjeNieruchomosc = [
    { value: 'Tak', label: 'Tak, mieszkam w niej', icon: FaHome },
    { value: 'Nie', label: 'Nie Posiadam', icon: FaTimes },
  ];
  const opcjeSplaty = [
    { value: 'Tak', label: 'Tak' },
    { value: 'Czesciowo', label: 'Częściowo' },
    { value: 'Nie', label: 'Nie' },
  ];

  // Widok po udanej wysyłce
  if (submissionStatus === 'success') {
    return (
        <div className="w-full max-w-2xl mx-auto p-8 text-center bg-brand-bg-light rounded-xl">
          <h3 className="text-3xl font-bold text-green-400">Dziękujemy!</h3>
          <p className="mt-4 text-slate-900 text-lg">Twoje zgłoszenie zostało pomyślnie wysłane. Wkrótce się z Tobą skontaktujemy.</p>
        </div>
    );
  }

  // Widok w razie błędu
  if (submissionStatus === 'error') {
    return (
        <div className="w-full max-w-2xl mx-auto p-8 text-center bg-brand-bg-light rounded-xl">
          <h3 className="text-3xl font-bold text-red-400">Coś poszło nie tak...</h3>
          <p className="mt-4 text-slate-900 text-lg">Wystąpił błąd podczas wysyłania formularza. Prosimy, spróbuj ponownie.</p>
          <button onClick={() => setSubmissionStatus('idle')} className="mt-8 px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
            Spróbuj jeszcze raz
          </button>
        </div>
    );
  }

  // Używamy tagu <form> do obsługi wysyłki
  return (
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4 sm:p-8 text-center rounded-xl space-y-12">

        {/* Pytanie 1 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-900">1. Czy posiadasz nieruchomość?</h3>
          <div className="w-full  mx-auto ">

            <ToggleButtonGroup options={opcjeNieruchomosc} selectedValue={formData.posiadaNieruchomosc}
                               onChange={(v) => handleToggleChange('posiadaNieruchomosc', v)}/>

          </div>
        </div>

        {/* Pytanie 3 */}
        <div className="space-y-2 text-slate-900">
        <RangeSlider label="3. Suma twoich długów" min={10000} max={1000000} step={1000} value={formData.sumaDlugow}
                       name="sumaDlugow" onChange={handleSliderChange} formatLabel={formatCurrency} />
        </div>

        {/* Pytanie 5 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-900">5. Czy obecnie spłacasz jakieś długi?</h3>
          <ToggleButtonGroup options={opcjeSplaty} selectedValue={formData.czyObecnieSplacasz} onChange={(v) => handleToggleChange('czyObecnieSplacasz', v)} />
        </div>

        {/* Pytanie 6 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-900">6. Jakie rodzaje zadłużeń posiadasz?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CounterCard title="Kredyty konsumenckie" description="Kredyty gotówkowe, karty, limity" icon={FaFileInvoiceDollar} count={formData.rodzajeZadluzen.konsumenckie} onIncrement={() => handleCounterChange('konsumenckie', 'inc')} onDecrement={() => handleCounterChange('konsumenckie', 'dec')} />
            <CounterCard title="Kredyt hipoteczny" description="Kredyty zabezpieczone na nieruchomości" icon={FaUniversity} count={formData.rodzajeZadluzen.hipoteczne} onIncrement={() => handleCounterChange('hipoteczne', 'inc')} onDecrement={() => handleCounterChange('hipoteczne', 'dec')} />
            <CounterCard title="Chwilówki" description="Pożyczki krótkoterminowe, parabanki" icon={FaReceipt} count={formData.rodzajeZadluzen.chwilowki} onIncrement={() => handleCounterChange('chwilowki', 'inc')} onDecrement={() => handleCounterChange('chwilowki', 'dec')} />
            <CounterCard title="Alimenty" description="Zaległe alimenty, fundusz alimentacyjny" icon={FaGavel} count={formData.rodzajeZadluzen.alimenty} onIncrement={() => handleCounterChange('alimenty', 'inc')} onDecrement={() => handleCounterChange('alimenty', 'dec')} />
            <CounterCard title="ZUS / US" description="Zaległości podatkowe, składki ZUS" icon={FaBuilding} count={formData.rodzajeZadluzen.zus} onIncrement={() => handleCounterChange('zus', 'inc')} onDecrement={() => handleCounterChange('zus', 'dec')} />
            <CounterCard title="Inne" description="Czynsz, polisy, telekomunikacja" icon={FaQuestionCircle} count={formData.rodzajeZadluzen.inne} onIncrement={() => handleCounterChange('inne', 'inc')} onDecrement={() => handleCounterChange('inne', 'dec')} />
          </div>
        </div>

        {/* Pytanie 7 */}
        <div className="space-y-2 pt-8 text-slate-900">
          <RangeSlider label="7. Jak pilna jest twoja sprawa?" min={1} max={10} step={1} value={formData.pilnoscSprawy} name="pilnoscSprawy" onChange={handleSliderChange} formatLabel={(v) => v === 1 ? "Mam czas" : v === 10 ? "Zaraz komornik" : v.toString()} />
        </div>

        <div className="text-center pt-8">
          <button
              type="submit"
              disabled={submissionStatus === 'submitting'}
              className="px-12 py-4 bg-blue-500 font-bold text-white text-xl rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 disabled:bg-slate-500 disabled:cursor-wait"
          >
            {submissionStatus === 'submitting' ? 'Wysyłanie...' : 'Oblicz moją ugodę'}
          </button>
        </div>

      </form>
  );
}
