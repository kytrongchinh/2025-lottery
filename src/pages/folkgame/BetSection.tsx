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

const EXCLUSIVE_RULES: Record<string, Record<string, string[]>> = {
    top: {
        big: ["small"],
        small: ["big"],
        odd: ["even"],
        even: ["odd"],

        big_odd: ["big_even", "small_even", "small_odd"],
        big_even: ["big_odd", "small_even", "small_odd"],
        small_odd: ["small_even", "big_even", "big_odd"],
        small_even: ["small_odd", "big_even", "big_odd"],
    },

    bottom: {
        big: ["small"],
        small: ["big"],
        odd: ["even"],
        even: ["odd"],

        small_odd: ["small_even"],
        small_even: ["small_odd"],
    },

    top_bottom: {
        big: ["small"],
        small: ["big"],
        odd: ["even"],
        even: ["odd"],
    },

    top_ewsn: {
        east: ["south", "west", "north"],
        south: ["east", "west", "north"],
        west: ["east", "south", "north"],
        north: ["east", "south", "west"],
    },
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
                    const isSelected = selected?.some(
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

                                // setSelected(prev => {

                                //     const existed = prev.find(
                                //         s => s.group === group && s.name === item.name
                                //     );

                                //     if (existed) {
                                //         return prev.filter(
                                //             s => !(s.group === group && s.name === item.name)
                                //         );
                                //     }

                                //     return [
                                //         ...prev,
                                //         {
                                //             group,
                                //             label,
                                //             name: item.name,
                                //             rate: item.rate,
                                //             description: item.description,
                                //             type: item?.type
                                //         },
                                //     ];
                                // })

                                setSelected(prev => {
                                    const existed = prev.find(
                                        s => s.group === group && s.name === item.name
                                    );

                                    // 1️⃣ Click lại → bỏ chọn
                                    if (existed) {
                                        return prev.filter(
                                            s => !(s.group === group && s.name === item.name)
                                        );
                                    }

                                    const bannedTypes =
                                        EXCLUSIVE_RULES[group]?.[item.type] || [];

                                    return [
                                        // 2️⃣ Giữ lại các item không xung đột
                                        ...prev.filter(s => {
                                            // khác group → giữ
                                            if (s.group !== group) return true;

                                            // group E-W-S-N → chỉ cho 1
                                            if (group === "top_ewsn") return false;

                                            // cùng group nhưng không bị cấm → giữ
                                            return !bannedTypes.includes(s.type);
                                        }),

                                        // 3️⃣ Add item mới
                                        {
                                            group,
                                            label,
                                            name: item.name,
                                            rate: item.rate,
                                            description: item.description,
                                            type: item.type,
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
