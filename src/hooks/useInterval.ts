import { useEffect, useRef, useCallback } from "react";

const useInterval = (func: (...args: any[]) => void, initialInterval: number, subsequentInterval: number) => {
	const intervalId = useRef<number | null>(null);
	const isFirstCall = useRef(true);

	const startInterval = useCallback(
		(...args: any[]) => {
			if (intervalId.current) return; // Prevent multiple intervals

			intervalId.current = window.setInterval(() => {
				func(...args);

				if (isFirstCall.current) {
					if (intervalId.current) clearInterval(intervalId.current);
					isFirstCall.current = false;
					intervalId.current = window.setInterval(() => func(...args), subsequentInterval);
				}
			}, initialInterval);
		},
		[func, initialInterval, subsequentInterval]
	);

	const stopInterval = useCallback(() => {
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
			isFirstCall.current = true;
		}
	}, []);

	useEffect(() => {
		return () => stopInterval(); // Cleanup on unmount
	}, [stopInterval]);

	return { startInterval, stopInterval };
};

export default useInterval;
