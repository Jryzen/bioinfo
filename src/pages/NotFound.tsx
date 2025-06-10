import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Home,
  Dna,
  Upload,
  ArrowLeft,
  Search,
  FileX,
  Info,
  Zap,
} from "lucide-react";

const NotFound = () => {
  const currentPath = window.location.pathname;

  const popularRoutes = [
    {
      path: "/",
      title: "Dashboard",
      description: "Página principal com visão geral",
      icon: Home,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      path: "/sequence-analysis",
      title: "Análise de Sequências",
      description: "Analise sequências de DNA, RNA e proteínas",
      icon: Dna,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      path: "/file-upload",
      title: "Upload de Arquivos",
      description: "Carregue arquivos FASTA para análise em lote",
      icon: Upload,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  const quickActions = [
    {
      title: "Análise Rápida",
      description: "Comece a analisar suas sequências agora",
      href: "/sequence-analysis",
      icon: Zap,
    },
    {
      title: "Upload de FASTA",
      description: "Carregue múltiplos arquivos para análise",
      href: "/file-upload",
      icon: Upload,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl space-y-8">
          {/* Main Error Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100 border-4 border-white shadow-lg">
                <FileX className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Página Não Encontrada
              </CardTitle>
              <CardDescription className="text-xl text-slate-600 mt-2">
                A página que você está procurando não existe ou foi movida
              </CardDescription>

              {currentPath && (
                <Alert className="mt-4 bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Rota acessada:</strong>{" "}
                    <code className="bg-amber-100 px-1 rounded">
                      {currentPath}
                    </code>
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Quick Actions */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Ações Rápidas
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Link to="/">
                      <Home className="mr-2 h-5 w-5" />
                      Ir para Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </Button>
                </div>
              </div>

              {/* Popular Routes */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                  Páginas Disponíveis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularRoutes.map((route, index) => (
                    <Link key={index} to={route.path} className="group">
                      <Card
                        className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${route.color} bg-white/50`}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="mb-4">
                            <route.icon className="h-12 w-12 mx-auto" />
                          </div>
                          <h4 className="font-semibold text-lg mb-2">
                            {route.title}
                          </h4>
                          <p className="text-sm opacity-80">
                            {route.description}
                          </p>
                          <Badge variant="secondary" className="mt-3">
                            Acessar
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Procurando algo específico?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.href} className="group">
                      <div className="flex items-center p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:border-blue-300">
                        <action.icon className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800 group-hover:text-blue-700">
                            {action.title}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="text-center pt-6 border-t border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">
                  Ainda está perdido?
                </h4>
                <p className="text-slate-600 mb-4">
                  O BioinfoLab oferece ferramentas completas para análise
                  bioinformática
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <Badge variant="outline">Análise de DNA</Badge>
                  <Badge variant="outline">Análise de RNA</Badge>
                  <Badge variant="outline">Análise de Proteínas</Badge>
                  <Badge variant="outline">Upload FASTA</Badge>
                  <Badge variant="outline">Visualizações</Badge>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-slate-500 pt-4">
                <p>
                  Volte ao{" "}
                  <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Dashboard
                  </Link>{" "}
                  para começar sua análise bioinformática
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
