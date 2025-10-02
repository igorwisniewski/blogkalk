import { IconType } from 'react-icons';

interface Option {
    value: string;
    label: string;
    icon?: IconType;
}

interface Props {
    options: Option[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export default function ToggleButtonGroup({ options, selectedValue, onChange }: Props) {
    // Logika do bezpiecznego przypisania klasy grid w zależności od liczby opcji
    let gridLayoutClass = '';
    switch (options.length) {
        case 2:
            gridLayoutClass = 'grid-cols-2';
            break;
        case 3:
            gridLayoutClass = 'grid-cols-3';
            break;
        default:
            // Domyślny układ, jeśli opcji jest mniej niż 2 lub więcej niż 3
            gridLayoutClass = `grid-cols-1 sm:grid-cols-${options.length}`;
    }

    return (
        <div className={`w-full mx-auto grid ${gridLayoutClass} gap-4`}>
            {options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        // Klasa `flex` wewnątrz przycisku jest poprawna - centruje ona ikonę i tekst
                        className={`p-6 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-center
              ${isSelected
                            ? 'bg-blue-800 border-blue-800 shadow-lg shadow-blue-500/20'
                            // Używamy `brand-bg-light` i `brand-border` z Twojego pliku tailwind.config.ts
                            : 'bg-brand-bg-light border-blue-800    border hover:border-blue-500'
                        }`}
                    >
                        {option.icon && <option.icon className={`mb-2 h-7 w-7 ${isSelected ? 'text-white' : 'text-blue-800'}`} />}
                        {/* POPRAWKA: `text-slate-300` dla lepszego kontrastu na ciemnym tle */}
                        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
