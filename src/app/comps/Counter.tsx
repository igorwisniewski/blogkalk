// components/form-elements/CounterCard.tsx

import { IconType } from 'react-icons';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface Props {
    title: string;
    description: string;
    icon: IconType;
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export default function CounterCard({ title,description, icon: Icon, count, onIncrement, onDecrement }: Props) {
    const isActive = count > 0;

    return (
        // GŁÓWNY KONTENER: Domyślnie w pionie, od 'sm' w górę w poziomie
        <div className={`p-4 rounded-lg border-2 transition-colors duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between
      ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-brand-border bg-brand-bg-light'}`}>

            {/* Kontener na tekst i ikonę */}
            <div className="flex items-center w-full">
                <Icon className={`h-8 w-8 mr-4 flex-shrink-0 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-900'}`} />
                <div className="text-left">
                    <h4 className={`font-bold ${isActive ? 'text-slate-900': 'text-slate-900'}`}>{title}</h4>
                    <p className="text-sm text-slate-400">{description}</p>
                </div>
            </div>

            {/* KONTENER NA PRZYCISKI: Na telefonie ma margines u góry i jest wyrównany do prawej */}
            <div className="flex items-center gap-3 mt-4 sm:mt-0 self-end sm:self-center">

                {/* Przycisk "minus" pojawia się, gdy count > 0 */}
                {isActive && (
                    <button
                        type="button"
                        onClick={onDecrement}
                        className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-300 transition-colors"
                    >
                        <FaMinus />
                    </button>
                )}

                <span className="text-xl font-bold w-8 text-center">{count}</span>

                <button
                    type="button"
                    onClick={onIncrement}
                    className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-300 transition-colors"
                >
                    <FaPlus />
                </button>
            </div>
        </div>
    );
}