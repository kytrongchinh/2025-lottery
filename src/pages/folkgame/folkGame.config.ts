// folkGame.config.ts
export const folkGameData = [
    {
        label: "Top",
        cols: 6,
        items: [
            { name: "Big", rate: "1.96" },
            { name: "Small", rate: "1.96" },
            { name: "Odd", rate: "1.96" },
            { name: "Even", rate: "1.96" },
            { name: "Pair", rate: "1:9" },
            { name: "Dragon", rate: "1:96" },

            { name: "Big Odd", rate: "3.7" },
            { name: "Big Even", rate: "3.7" },
            { name: "Small Odd", rate: "3.7" },
            { name: "Small Even", rate: "3.7" },
        ],
    },
    {
        label: "Bottom",
        cols: 6,
        items: [
            { name: "Big", rate: "1.96" },
            { name: "Small", rate: "1.96" },
            { name: "Odd", rate: "1.96" },
            { name: "Even", rate: "1.96" },
            { name: "Pair", rate: "1:9" },
            { name: "Dragon", rate: "1:96" },

            { name: "Small Odd", rate: "3.7" },
            { name: "Small Even", rate: "3.7" },
        ],
    },
    {
        label: "Top & Bottom",
        cols: 4,
        items: [
            { name: "Big", rate: "3.7" },
            { name: "Small", rate: "3.7" },
            { name: "Odd", rate: "3.7" },
            { name: "Even", rate: "3.7" },
        ],
    },
    {
        label: "Top (E-W-S-N)",
        cols: 4,
        items: [
            { name: "East", rate: "3.7" },
            { name: "South", rate: "3.7" },
            { name: "West", rate: "3.7" },
            { name: "North", rate: "3.7" },
        ],
    },
];
