import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SequenceAnalysis, ProteinAnalysis } from "@/lib/bioinformatics";
import { SequenceType } from "./SequenceInput";
import { Download, FileText, Share } from "lucide-react";

interface ResultsDisplayProps {
  analysis: SequenceAnalysis | ProteinAnalysis | null;
  sequenceType: SequenceType;
  originalSequence: string;
}

export function ResultsDisplay({
  analysis,
  sequenceType,
  originalSequence,
}: ResultsDisplayProps) {
  if (!analysis) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum resultado de análise disponível. Execute uma análise para ver
            os resultados aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  const exportResults = () => {
    const results = {
      sequencia: originalSequence,
      tipoSequencia: sequenceType,
      analise: analysis,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analise_bioinformatica_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyResults = () => {
    const text = generateResultsText();
    navigator.clipboard.writeText(text);
  };

  const generateResultsText = () => {
    const lines = [];
    lines.push(`=== Resultados da Análise Bioinformática ===`);
    lines.push(`Tipo de Sequência: ${sequenceType.toUpperCase()}`);
    lines.push(`Data da Análise: ${new Date().toLocaleString()}`);
    lines.push("");

    lines.push("=== Estatísticas Básicas ===");
    lines.push(`Comprimento: ${analysis.length}`);

    if ("gcContent" in analysis) {
      lines.push(`Conteúdo GC: ${analysis.gcContent.toFixed(2)}%`);
      lines.push(`Conteúdo AT: ${analysis.atContent.toFixed(2)}%`);
    }

    if (analysis.molecularWeight) {
      lines.push(`Peso Molecular: ${analysis.molecularWeight.toFixed(2)} Da`);
    }

    if ("meltingTemperature" in analysis && analysis.meltingTemperature) {
      lines.push(
        `Temperatura de Fusão: ${analysis.meltingTemperature.toFixed(2)}°C`,
      );
    }

    lines.push("");
    lines.push("=== Composição ===");
    Object.entries(analysis.composition).forEach(([key, value]) => {
      if (value > 0) {
        const percentage = ((value / analysis.length) * 100).toFixed(2);
        lines.push(`${key}: ${value} (${percentage}%)`);
      }
    });

    lines.push("");
    lines.push("=== Sequência ===");
    lines.push(analysis.sequence);

    return lines.join("\n");
  };

  const isNucleotideSequence = "gcContent" in analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Resultados da Análise</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyResults}>
              <Share className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Resultados abrangentes da análise para sua sequência de{" "}
          {sequenceType.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estatísticas Resumidas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Estatísticas Resumidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {analysis.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {sequenceType === "protein" ? "Aminoácidos" : "Nucleotídeos"}
              </div>
            </div>

            {isNucleotideSequence && (
              <>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {analysis.gcContent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Conteúdo GC
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {analysis.atContent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Conteúdo AT
                  </div>
                </div>
              </>
            )}

            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {analysis.molecularWeight
                  ? `${(analysis.molecularWeight / 1000).toFixed(1)}`
                  : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">PM (kDa)</div>
            </div>
          </div>
        </div>

        {/* Propriedades Adicionais */}
        {isNucleotideSequence && analysis.meltingTemperature && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Propriedades Físicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-semibold">
                  {analysis.meltingTemperature.toFixed(1)}°C
                </div>
                <div className="text-sm text-muted-foreground">
                  Temperatura de Fusão
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Composição Detalhada */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Composição Detalhada</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabela de Composição */}
            <div>
              <h4 className="font-medium mb-2">
                Contagem de{" "}
                {sequenceType === "protein" ? "Aminoácidos" : "Nucleotídeos"}
              </h4>
              <ScrollArea className="h-64 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">
                        {sequenceType === "protein" ? "AA" : "Base"}
                      </TableHead>
                      <TableHead className="w-20">Contagem</TableHead>
                      <TableHead>Porcentagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(analysis.composition)
                      .filter(([_, count]) => count > 0)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, count]) => {
                        const percentage = (
                          (count / analysis.length) *
                          100
                        ).toFixed(2);
                        return (
                          <TableRow key={key}>
                            <TableCell className="font-mono font-bold">
                              {key}
                            </TableCell>
                            <TableCell>{count}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span>{percentage}%</span>
                                <div className="flex-1 bg-muted rounded-full h-2 max-w-16">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Tags de Composição */}
            <div>
              <h4 className="font-medium mb-2">Visão Geral da Composição</h4>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analysis.composition)
                    .filter(([_, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count]) => {
                      const percentage = (
                        (count / analysis.length) *
                        100
                      ).toFixed(1);
                      return (
                        <Badge key={key} variant="outline" className="text-sm">
                          {key}: {count} ({percentage}%)
                        </Badge>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Exibição da Sequência */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sequência</h3>
          <ScrollArea className="h-32 w-full border rounded-md p-3">
            <div className="font-mono text-sm break-all leading-relaxed">
              {analysis.sequence}
            </div>
          </ScrollArea>
          <div className="text-xs text-muted-foreground mt-2">
            Comprimento total: {analysis.sequence.length}{" "}
            {sequenceType === "protein" ? "aminoácidos" : "nucleotídeos"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
