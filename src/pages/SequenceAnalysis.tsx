import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SequenceInput, SequenceType } from "@/components/SequenceInput";
import { AnalysisTools } from "@/components/AnalysisTools";
import { SequenceVisualization } from "@/components/SequenceVisualization";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  analyzeSequence,
  analyzeProtein,
  SequenceAnalysis,
  ProteinAnalysis,
} from "@/lib/bioinformatics";
import { Dna, Info } from "lucide-react";

export default function SequenceAnalysisPage() {
  const [currentSequence, setCurrentSequence] = useState("");
  const [currentType, setCurrentType] = useState<SequenceType>("dna");
  const [analysis, setAnalysis] = useState<
    SequenceAnalysis | ProteinAnalysis | null
  >(null);

  const handleSequenceSubmit = (sequence: string, type: SequenceType) => {
    setCurrentSequence(sequence);
    setCurrentType(type);

    // Run basic analysis automatically
    if (type === "protein") {
      setAnalysis(analyzeProtein(sequence));
    } else {
      setAnalysis(analyzeSequence(sequence, type === "rna"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:pl-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <Dna className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Análise de Sequências</h1>
                <p className="text-muted-foreground">
                  Ferramentas abrangentes de análise para sequências de DNA, RNA
                  e proteínas
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Carregue ou cole sua sequência para começar. Formatos suportados
                incluem texto simples, arquivos FASTA e formatos comuns de
                arquivo de sequência. A análise detectará e validará
                automaticamente o tipo de sequência.
              </AlertDescription>
            </Alert>

            {/* Sequence Input */}
            <SequenceInput onSequenceSubmit={handleSequenceSubmit} />

            {/* Analysis Content */}
            {currentSequence && (
              <Tabs defaultValue="tools" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tools">
                    Ferramentas de Análise
                  </TabsTrigger>
                  <TabsTrigger value="visualization">Visualização</TabsTrigger>
                  <TabsTrigger value="results">Resultados</TabsTrigger>
                </TabsList>

                <TabsContent value="tools" className="space-y-6">
                  <AnalysisTools
                    sequence={currentSequence}
                    sequenceType={currentType}
                  />
                </TabsContent>

                <TabsContent value="visualization" className="space-y-6">
                  <SequenceVisualization
                    sequence={currentSequence}
                    sequenceType={currentType}
                  />
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  <ResultsDisplay
                    analysis={analysis}
                    sequenceType={currentType}
                    originalSequence={currentSequence}
                  />
                </TabsContent>
              </Tabs>
            )}

            {!currentSequence && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Dna className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Nenhuma Sequência Carregada
                </h3>
                <p className="text-muted-foreground">
                  Digite uma sequência acima para iniciar sua análise
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
