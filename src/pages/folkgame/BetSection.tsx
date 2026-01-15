// BetSection.tsx
import { BetCard } from "./BetCard";

type Item = {
    name: string;
    rate: number;
    description?: string;
    type: string;
};
type SelectedBet = {
    name: string;
    rate: number;
    label: string;
    type: string;
    group: string;
    description?: string;
};
type Props = {
    label: string;
    description?: string;
    group: string;
    cols: number;
    items: Item[];
    selected: SelectedBet[];
    setSelected: React.Dispatch<React.SetStateAction<SelectedBet[]>>;
};



export const BetSection = ({ label, description, group, items, selected, setSelected }: Props) => {
    // const [selected, setSelected] = useState<string | null>(null);
    // const [selected, setSelected] = useState<string[]>([]);


    return (
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
            {/* Left label */}
            <div
                className="
			flex flex-row sm:flex-col
			w-full sm:w-32
			items-center justify-between sm:justify-center
			rounded-lg bg-blue-600 text-white font-semibold
			px-1 py-2 sm:px-0 sm:py-0
			text-center
		"
            >
                <div className="text-sm sm:text-base">{label}</div>
                <div className="text-[10px] sm:text-[9px] opacity-90">
                    {description}
                </div>
            </div>

            {/* Right grid */}
            <div
                className="
			grid flex-1 gap-2
			grid-cols-2
			sm:grid-cols-3
			md:grid-cols-6
		"
            >
                {items.map((item, index) => {
                    // const isSelected = selected === item.name;
                    // const isSelected = selected.includes(item.name);
                    const isSelected = selected.some(
                        s => s.group === group && s.name === item.name
                    );
                    return (
                        <BetCard
                            key={group + index}
                            name={item.name}
                            rate={item.rate}
                            description={item?.description || ""}
                            selected={isSelected}
                            onClick={() =>
                                // setSelected(prev =>
                                //     prev === item.name ? null : item.name
                                // )
                                // setSelected(prev =>
                                //     prev.includes(item.name)
                                //         ? prev.filter(n => n !== item.name)
                                //         : [...prev, item.name]
                                // )

                                setSelected(prev => {

                                    const existed = prev.find(
                                        s => s.group === group && s.name === item.name
                                    );

                                    if (existed) {
                                        return prev.filter(
                                            s => !(s.group === group && s.name === item.name)
                                        );
                                    }

                                    return [
                                        ...prev,
                                        {
                                            group,
                                            label,
                                            name: item.name,
                                            rate: item.rate,
                                            description: item.description,
                                            type: item?.type
                                        },
                                    ];
                                })

                            }
                        />
                    );
                })}
            </div>
        </div>

    );
};
