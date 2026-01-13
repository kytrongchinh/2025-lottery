// BetCard.tsx
type Props = {
    name: string;
    rate: string;
    selected?: boolean;
    onClick?: () => void;
};

export const BetCard = ({ name, rate, selected, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`
        flex flex-col items-center justify-center
        rounded-lg px-3 py-4 font-semibold
        transition-all duration-200
        ${selected
                    ? "bg-blue-600 text-white ring-2 ring-yellow-300 scale-105 shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                    : "bg-blue-200 hover:bg-blue-300"
                }
    `}
        >
            <span>{name}</span>
            <span className="mt-1 text-sm font-normal">{rate}</span>
        </button>
    );
};
