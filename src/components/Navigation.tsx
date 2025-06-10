import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Home, Dna, Upload, BarChart3, FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
const navigationItems = [
  {
    name: "Início",
    href: "/",
    icon: Home,
    description: "Visão geral e acesso rápido",
  },
  {
    name: "Análise de Sequências",
    href: "/sequence-analysis",
    icon: Dna,
    description: "Analise sequências de DNA, RNA e proteínas",
  },
  {
    name: "Upload de Arquivos",
    href: "/file-upload",
    icon: Upload,
    description: "Carregue arquivos FASTA para análise em lote",
  },
];

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavigationContent = () => (
    <div className="flex flex-col space-y-2">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <item.icon className="h-5 w-5" />
            <div className="flex flex-col">
              <span>{item.name}</span>
              <span className="text-xs opacity-70">{item.description}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-background border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <Dna className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">BioinfoLab</h1>
                <p className="text-xs text-muted-foreground">
                  Análise Bioinformática
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex-grow flex flex-col px-4">
            <NavigationContent />
          </div>
          <div className="p-4 border-t">
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center space-x-2">
            <Dna className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">BioinfoLab</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeSelector />
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center space-x-2 mb-8">
                <Dna className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">BioinfoLab</h1>
                  <p className="text-xs text-muted-foreground">
                    Análise Bioinformática
                  </p>
                </div>
              </div>
              <NavigationContent />
              <div className="mt-8 pt-4 border-t">
                <ThemeSelector />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
