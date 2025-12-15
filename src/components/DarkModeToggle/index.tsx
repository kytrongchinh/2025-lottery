import { useEffect, useState } from "react";

export default function DarkModeToggle() {
	const [dark, setDark] = useState(localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches));

	useEffect(() => {
		if (dark) {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.theme = "light";
		}
		console.log(dark,"dark")
	}, [dark]);

	return (
		<button
			onClick={() => setDark(!dark)}
			className="
        w-14 h-7 flex items-center rounded-full p-1 transition 
        bg-gray-300 dark:bg-gray-700"
		>
			<span
				className={`w-5 h-5 bg-white dark:bg-black rounded-full shadow-md transform transition ${dark ? "translate-x-7" : ""}
        `}
			></span>
		</button>
		
	);
}
