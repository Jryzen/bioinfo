import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import {
  Dna,
  Upload,
  BarChart3,
  FileText,
  Zap,
  Target,
  Microscope,
  ArrowRight,
  Star,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Dna,
    title: "Análise de Sequências",
    description: "Análise abrangente de sequências de DNA, RNA e proteínas",
    href: "/sequence-analysis",
    capabilities: [
      "Conteúdo GC",
      "Tradução",
      "Busca de ORFs",
      "Análise de Composição",
    ],
  },
  {
    icon: Upload,
    title: "Processamento em Lote",
    description: "Carregue e analise múltiplos arquivos FASTA simultaneamente",
    href: "/file-upload",
    capabilities: [
      "Suporte FASTA",
      "Múltiplos Arquivos",
      "Exportação em Lote",
      "Acompanhamento de Progresso",
    ],
  },
  {
    icon: BarChart3,
    title: "Ferramentas de Visualização",
    description:
      "Gráficos e charts interativos integrados na análise de sequências",
    href: "/sequence-analysis",
    capabilities: [
      "Gráficos de Composição",
      "Codificação por Cores",
      "Plots Interativos",
      "Opções de Exportação",
    ],
  },
];

const quickActions = [
  {
    icon: Zap,
    title: "Análise Rápida",
    description: "Analise uma sequência em segundos",
    action: "Comece a analisar seus dados de sequência imediatamente",
    href: "/sequence-analysis",
  },
  {
    icon: Target,
    title: "Buscar ORFs",
    description: "Descubra quadros de leitura abertos",
    action: "Carregue sequência de DNA para encontrar regiões codificantes",
    href: "/sequence-analysis",
  },
  {
    icon: Microscope,
    title: "Análise de Proteínas",
    description: "Analise sequências de proteínas",
    action: "Obtenha peso molecular, composição e mais",
    href: "/sequence-analysis",
  },
];

const stats = [
  {
    label: "Tipos de Sequência Suportados",
    value: "3",
    description: "DNA, RNA, Proteína",
  },
  {
    label: "Ferramentas de Análise",
    value: "10+",
    description: "Kit de ferramentas abrangente",
  },
  {
    label: "Formatos de Arquivo",
    value: "5+",
    description: "FASTA, texto simples e mais",
  },
  {
    label: "Opções de Exportação",
    value: "Múltiplas",
    description: "JSON, texto, gráficos",
  },
];

const Index = () => {
  const { theme } = useTheme();

  // Classes específicas para cada tema
  const getThemeClasses = () => {
    switch (theme) {
      case "biogreen":
        return {
          hero: "bio-gradient",
          accent: "bg-green-100 text-green-800",
          special: "hover:bg-green-50",
        };
      case "neonpurple":
        return {
          hero: "neon-gradient",
          accent: "bg-purple-900/20 text-purple-300 neon-border",
          special: "hover:bg-purple-900/10 glow",
        };
      case "dark":
        return {
          hero: "bg-gradient-to-br from-gray-900 to-gray-800",
          accent: "bg-gray-800 text-gray-200",
          special: "hover:bg-gray-800/50",
        };
      default:
        return {
          hero: "bg-gradient-to-br from-blue-50 to-indigo-100",
          accent: "bg-blue-50 text-blue-800",
          special: "hover:bg-blue-50",
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:pl-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div
              className={`text-center space-y-4 py-12 rounded-2xl ${theme === "neonpurple" ? "neon-gradient pulse-glow" : theme === "biogreen" ? "bio-gradient" : "bg-gradient-to-br from-primary/10 to-primary/5"}`}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Dna
                  className={`h-12 w-12 ${theme === "neonpurple" ? "neon-text" : "text-primary"}`}
                />
                <div className="text-left">
                  <h1
                    className={`text-4xl font-bold tracking-tight ${theme === "neonpurple" ? "neon-text" : ""}`}
                  >
                    BioinfoLab
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Análise Bioinformática
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-foreground max-w-3xl mx-auto">
                Plataforma Completa de Análise Bioinformática
              </h2>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Analise sequências de DNA, RNA e proteínas com ferramentas
                poderosas para pesquisa, educação e descoberta. Obtenha insights
                desde análise de composição até busca de ORFs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  asChild
                  size="lg"
                  className={`text-lg px-8 ${theme === "neonpurple" ? "glow" : ""}`}
                >
                  <Link to="/sequence-analysis">
                    Iniciar Análise
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8"
                >
                  <Link to="/file-upload">
                    Carregar Arquivos
                    <Upload className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className={`text-center ${themeClasses.special} transition-all duration-300`}
                >
                  <CardContent className="pt-6">
                    <div
                      className={`text-3xl font-bold mb-2 ${theme === "neonpurple" ? "neon-text" : "text-primary"}`}
                    >
                      {stat.value}
                    </div>
                    <div className="font-medium">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className={`hover:shadow-md transition-all duration-300 ${themeClasses.special}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <action.icon
                          className={`h-6 w-6 ${theme === "neonpurple" ? "text-purple-400" : "text-primary"}`}
                        />
                        <span>{action.title}</span>
                      </CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {action.action}
                      </p>
                      <Button asChild className="w-full">
                        <Link to={action.href}>Começar</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Features */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center">
                Recursos Principais
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className={`hover:shadow-md transition-all duration-300 ${themeClasses.special}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <feature.icon
                          className={`h-6 w-6 ${theme === "neonpurple" ? "text-purple-400" : "text-primary"}`}
                        />
                        <span>{feature.title}</span>
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {feature.capabilities.map((capability, capIndex) => (
                          <Badge
                            key={capIndex}
                            variant="secondary"
                            className={
                              theme === "neonpurple"
                                ? "bg-purple-900/30 text-purple-300"
                                : ""
                            }
                          >
                            {capability}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild className="w-full">
                        <Link to={feature.href}>
                          Explorar {feature.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* About Section */}
            <Card className={`${themeClasses.accent} border-0`}>
              <CardHeader>
                <CardTitle className="text-center">
                  Sobre o BioinfoLab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center max-w-4xl mx-auto opacity-90">
                  O BioinfoLab é uma plataforma abrangente de análise
                  bioinformática desenvolvida para pesquisadores, estudantes e
                  profissionais que trabalham com sequências biológicas. Nossas
                  ferramentas fornecem capacidades de análise precisas, rápidas
                  e fáceis de usar para sequências de DNA, RNA e proteínas.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center space-y-2">
                    <Star
                      className={`h-8 w-8 mx-auto ${theme === "neonpurple" ? "text-purple-400" : theme === "biogreen" ? "text-green-600" : "text-primary"}`}
                    />
                    <h4 className="font-semibold">Resultados Confiáveis</h4>
                    <p className="text-sm opacity-80">
                      Algoritmos confiáveis e métodos de análise validados
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <Users
                      className={`h-8 w-8 mx-auto ${theme === "neonpurple" ? "text-purple-400" : theme === "biogreen" ? "text-green-600" : "text-primary"}`}
                    />
                    <h4 className="font-semibold">Fácil de Usar</h4>
                    <p className="text-sm opacity-80">
                      Interface intuitiva desenvolvida para todos os níveis de
                      habilidade
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <Clock
                      className={`h-8 w-8 mx-auto ${theme === "neonpurple" ? "text-purple-400" : theme === "biogreen" ? "text-green-600" : "text-primary"}`}
                    />
                    <h4 className="font-semibold">Processamento Rápido</h4>
                    <p className="text-sm opacity-80">
                      Performance otimizada para resultados de análise rápidos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Started */}
            <Card
              className={`text-center bg-primary text-primary-foreground ${theme === "neonpurple" ? "glow pulse-glow" : ""}`}
            >
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Pronto para Começar sua Análise?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Junte-se a pesquisadores do mundo todo usando o BioinfoLab
                  para suas necessidades de análise de sequências
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/sequence-analysis">
                      Começar Análise
                      <Dna className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    <Link to="/sequence-analysis">
                      Testar Análise
                      <FileText className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
