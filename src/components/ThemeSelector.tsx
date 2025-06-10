import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { Palette, Sun, Moon, Leaf, Zap, Check } from "lucide-react";

const themes = [
  {
    name: "light",
    label: "Cores Brancas",
    icon: Sun,
    description: "Tema claro e limpo",
  },
  {
    name: "dark",
    label: "Dark",
    icon: Moon,
    description: "Tema escuro elegante",
  },
  {
    name: "biogreen",
    label: "Verde Bioinformático",
    icon: Leaf,
    description: "Verde científico",
  },
  {
    name: "neonpurple",
    label: "Neon Roxo",
    icon: Zap,
    description: "Roxo vibrante",
  },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const currentTheme = themes.find((t) => t.name === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {currentTheme ? (
            <>
              <currentTheme.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{currentTheme.label}</span>
            </>
          ) : (
            <>
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.name}
            onClick={() => setTheme(themeOption.name as any)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <themeOption.icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{themeOption.label}</span>
                <span className="text-xs text-muted-foreground">
                  {themeOption.description}
                </span>
              </div>
            </div>
            {theme === themeOption.name && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
