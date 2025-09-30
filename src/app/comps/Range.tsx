// components/form-elements/RangeSlider.tsx

interface Props {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    formatLabel: (value: number) => string; // Funkcja do formatowania etykiety
}

export default function RangeSlider({ label, min, max, step, value, onChange, name, formatLabel }: Props) {
    return (
        <div className="w-full">
            <label className="block text-lg font-medium text-slate-900 mb-8">{label}</label>
            <div className="relative">
                <div className="absolute top-[-25px] left-0 right-0 mx-auto text-center">
            <span className="px-4 py-1 text-white bg-blue-800 rounded-full font-bold text-lg">
                {formatLabel(value)}
            </span>
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    name={name}
                    onChange={onChange}
                    className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-800"
                />
                <div className="flex justify-between text-xs text-slate-900 mt-2">
                    <span>{formatLabel(min)}</span>
                    <span>{formatLabel(max)}</span>
                </div>
            </div>
        </div>
    );
}