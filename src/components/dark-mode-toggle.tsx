import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface DarkModeToggleProps {
	className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
	const [isDark, setIsDark] = useState(() => {
		const stored = localStorage.getItem("theme");
		return stored === "dark";
	});

	useEffect(() => {
		// migrate legacy darkMode flag if present
		const legacyDark = localStorage.getItem("darkMode");
		const stored = localStorage.getItem("theme");
		let initialTheme = stored || "light";
		if (!stored && legacyDark) {
			try {
				const legacy = JSON.parse(legacyDark) as boolean;
				initialTheme = legacy ? "dark" : "light";
				localStorage.setItem("theme", initialTheme);
				localStorage.removeItem("darkMode");
			} catch {
				// Ignore parsing errors
			}
		}
		setIsDark(initialTheme === "dark");
	}, []);

	useEffect(() => {
		const rootElement = document.documentElement;
		rootElement.classList.remove("dark");
		if (isDark) {
			rootElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	return (
		<button
			onClick={toggleTheme}
			className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
				isDark ? "bg-primary" : "bg-muted"
			} ${className || ""}`}
			aria-label="Toggle dark mode"
		>
			{/* Icons */}
			<div className="absolute left-1 flex items-center justify-center">
				<Sun className="h-3 w-3 text-muted-foreground" />
			</div>
			<div className="absolute right-1 flex items-center justify-center">
				<Moon className="h-3 w-3 text-muted-foreground" />
			</div>
			
			{/* Slider */}
			<span
				className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 ease-in-out ${
					isDark ? "translate-x-6" : "translate-x-1"
				}`}
			/>
		</button>
	);
}
