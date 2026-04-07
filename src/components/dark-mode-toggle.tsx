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
			className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
				isDark
					? "border-brand-blue/40 bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 text-foreground shadow-[0_0_20px_rgba(59,130,246,0.2)]"
					: "border-border/70 bg-muted/70 text-muted-foreground hover:text-foreground"
			} ${className || ""}`}
			aria-label="Toggle dark mode"
			title={isDark ? "Koyu mod açık" : "Açık mod açık"}
		>
			{isDark ? (
				<Moon className="h-4 w-4" />
			) : (
				<Sun className="h-4 w-4 text-amber-500" />
			)}
			<span className="hidden sm:inline">{isDark ? "Koyu" : "Açık"}</span>
		</button>
	);
}
