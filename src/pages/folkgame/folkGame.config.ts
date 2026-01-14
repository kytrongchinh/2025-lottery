// folkGame.config.ts
export const folkGameData = [
    {
        label: "Top",
        description: "G8",
        cols: 6,
        items: [
            { name: "Big", rate: "1.96", description: "50-99" },
            { name: "Small", rate: "1.96", description: "00-49" },
            { name: "Odd", rate: "1.96", description: "last 1,3,5,7,9" },
            { name: "Even", rate: "1.96", description: "last 2,4,6,8" },
            { name: "Pair", rate: "1:9", description: "11,22,33,..." },
            { name: "Dragon", rate: "1:96", description: ">top" },

            { name: "Big Odd", rate: "3.7", description: "50-99 & last 2,4,6,8" },
            { name: "Big Even", rate: "3.7", description: "50-99 & last 1,3,5,7,9" },
            { name: "Small Odd", rate: "3.7", description: "00-49 & last 2,4,6,8" },
            { name: "Small Even", rate: "3.7", description: "00-49 & last 1,3,5,7,9" },
        ],
    },
    {
        label: "Bottom",
        description: "Last 2 digit GDB",
        cols: 6,
        items: [
            { name: "Big", rate: "1.96", description: "50-99" },
            { name: "Small", rate: "1.96", description: "00-49" },
            { name: "Odd", rate: "1.96", description: "last 2,4,6,8" },
            { name: "Even", rate: "1.96", description: "last 1,3,5,7,9" },
            { name: "Pair", rate: "1:9", description: "11,22,33,..." },
            { name: "Dragon", rate: "1:96", description: ">bottom" },

            { name: "Small Odd", rate: "3.7", description: "00-49 & last 2,4,6,8" },
            { name: "Small Even", rate: "3.7", description: "00-49 & last 1,3,5,7,9" },
        ],
    },
    {
        label: "Top & Bottom",
        description: "Top and Bottom",
        cols: 4,
        items: [
            { name: "Big", rate: "3.7", description: "50-99" },
            { name: "Small", rate: "3.7", description: "00-49" },
            { name: "Odd", rate: "3.7", description: "last 2,4,6,8" },
            { name: "Even", rate: "3.7", description: "last 1,3,5,7,9" },
        ],
    },
    {
        label: "Top (E-W-S-N)",
        description: "",
        cols: 4,
        items: [
            { name: "East", rate: "3.7", description: "1-24" },
            { name: "South", rate: "3.7", description: "25-49" },
            { name: "West", rate: "3.7", description: "50-74" },
            { name: "North", rate: "3.7", description: "75-99" },
        ],
    },
];
