// BetSection.tsx
import { useState } from "react";
import { BetCard } from "./BetCard";

type Item = {
    name: string;
    rate: string;
};

type Props = {
    label: string;
    cols: number;
    items: Item[];
};

export const BetSection = ({ label, cols, items }: Props) => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <div className="mb-6 flex gap-4">
            {/* Left label */}
            <div className="flex w-32 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-center">
                {label}
            </div>

            {/* Right grid */}
            <div
                className="flex-1 grid gap-3"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {items.map((item, index) => {
                    const isSelected = selected === item.name;
                    return (
                        <BetCard
                            key={index}
                            name={item.name}
                            rate={item.rate}
                            // onClick={() => console.log(label, item.name)}
                            selected={isSelected}
                            onClick={() =>
                                setSelected(prev =>
                                    prev === item.name ? null : item.name
                                )
                            }
                        />
                    )
                })}
            </div>
        </div>
    );
};
