// BetCard.tsx
type Props = {
    name: string;
    rate: number;
    description?: string;
    selected?: boolean;
    onClick?: () => void;
};

export const BetCard = ({ name, rate, description, selected, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`
				flex flex-col items-center justify-center
				rounded-lg
				px-0 py-0 sm:px-1 sm:py-0.5
				text-xs sm:text-sm font-semibold
				transition-all duration-200
                dark:shadow-[0_0_3px_rgb(6_80_254)] dark:border-blue-700
				${selected
                    ? "bg-blue-600 dark:bg-green-400 text-white ring-2 ring-yellow-300 shadow-[0_0_10px_rgba(255,215,0,0.6)]"
                    : "bg-blue-200 dark:bg-blue-950 hover:bg-blue-300"
                }
			`}
        >
            <span className="truncate max-w-full font-bold">{name}</span>

            {description && (
                <span className="mt-0 text-[9px] font-normal opacity-80 truncate">
                    {description}
                </span>
            )}

            <span className="mt-1 text-sm sm:text-base font-bold">
                {rate}
            </span>
        </button>
    );
};

