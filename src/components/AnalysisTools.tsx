import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  analyzeSequence,
  analyzeProtein,
  reverseComplement,
  translateDNA,
  findORFs,
  SequenceAnalysis,
  ProteinAnalysis,
} from "@/lib/bioinformatics";
import { SequenceType } from "./SequenceInput";
import {
  BarChart3,
  Dna,
  RotateCcw,
  FileText,
  Target,
  Beaker,
} from "lucide-react";

interface AnalysisToolsProps {
  sequence: string;
  sequenceType: SequenceType;
}

interface ORF {
  start: number;
  end: number;
  frame: number;
  protein: string;
}

export function AnalysisTools({ sequence, sequenceType }: AnalysisToolsProps) {
  const [translationFrame, setTranslationFrame] = useState("0");
  const [analysis, setAnalysis] = useState<
    SequenceAnalysis | ProteinAnalysis | null
  >(null);
  const [reverseComp, setReverseComp] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [orfs, setOrfs] = useState<ORF[]>([]);
  const [minOrfLength, setMinOrfLength] = useState("100");

  const runBasicAnalysis = () => {
    if (sequenceType === "protein") {
      setAnalysis(analyzeProtein(sequence));
    } else {
      setAnalysis(analyzeSequence(sequence, sequenceType === "rna"));
    }
  };

  const generateReverseComplement = () => {
    if (sequenceType === "dna") {
      setReverseComp(reverseComplement(sequence));
    }
  };

  const translateSequence = () => {
    if (sequenceType === "dna") {
      const frame = parseInt(translationFrame);
      setTranslation(translateDNA(sequence, frame));
    }
  };

  const findOpenReadingFrames = () => {
    if (sequenceType === "dna") {
      const minLength = parseInt(minOrfLength);
      setOrfs(findORFs(sequence, minLength));
    }
  };

  const isNucleotideSequence = sequenceType === "dna" || sequenceType === "rna";
  const isDNA = sequenceType === "dna";

  return (
    <div className="space-y-6">
      {/* Basic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Análise Básica</span>
          </CardTitle>
          <CardDescription>
            Obtenha estatísticas abrangentes sobre sua sequência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runBasicAnalysis} className="mb-4">
            Executar Análise
          </Button>

          {analysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analysis.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Comprimento
                  </div>
                </div>

                {isNucleotideSequence && "gcContent" in analysis && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {analysis.gcContent.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conteúdo GC
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {analysis.atContent.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conteúdo AT
                      </div>
                    </div>
                  </>
                )}

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analysis.molecularWeight
                      ? `${(analysis.molecularWeight / 1000).toFixed(1)}`
                      : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">PM (kDa)</div>
                </div>
              </div>

              {isNucleotideSequence &&
                "meltingTemperature" in analysis &&
                analysis.meltingTemperature && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      Temperatura de Fusão:{" "}
                      {analysis.meltingTemperature.toFixed(1)}°C
                    </div>
                  </div>
                )}

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Composição</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {Object.entries(analysis.composition).map(
                    ([base, count]) =>
                      count > 0 && (
                        <div key={base} className="text-center">
                          <Badge variant="outline" className="w-full">
                            {base}: {count}
                          </Badge>
                        </div>
                      ),
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNA-specific tools */}
      {isDNA && (
        <>
          {/* Reverse Complement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5" />
                <span>Complemento Reverso</span>
              </CardTitle>
              <CardDescription>
                Gere o complemento reverso da sua sequência de DNA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generateReverseComplement} className="mb-4">
                Gerar Complemento Reverso
              </Button>

              {reverseComp && (
                <div className="space-y-2">
                  <Label>Complemento Reverso:</Label>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                    {reverseComp}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Comprimento: {reverseComp.length} nucleotídeos
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Translation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dna className="h-5 w-5" />
                <span>Tradução</span>
              </CardTitle>
              <CardDescription>
                Traduza sua sequência de DNA para proteína
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="space-y-2">
                  <Label>Quadro de Leitura</Label>
                  <Select
                    value={translationFrame}
                    onValueChange={setTranslationFrame}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Quadro 1 (+1)</SelectItem>
                      <SelectItem value="1">Quadro 2 (+2)</SelectItem>
                      <SelectItem value="2">Quadro 3 (+3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={translateSequence}>Traduzir</Button>
              </div>

              {translation && (
                <div className="space-y-2">
                  <Label>Proteína Traduzida:</Label>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                    {translation}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Comprimento: {translation.length} aminoácidos
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ORF Finder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Busca de ORFs</span>
              </CardTitle>
              <CardDescription>
                Encontre Quadros de Leitura Abertos na sua sequência de DNA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="space-y-2">
                  <Label>Comprimento Mínimo de ORF (pb)</Label>
                  <Select value={minOrfLength} onValueChange={setMinOrfLength}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="75">75</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="150">150</SelectItem>
                      <SelectItem value="300">300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={findOpenReadingFrames}>Buscar ORFs</Button>
              </div>

              {orfs.length > 0 && (
                <div className="space-y-4">
                  <div className="text-sm font-medium">
                    Encontrados {orfs.length} ORF{orfs.length !== 1 ? "s" : ""}:
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {orfs.map((orf, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={orf.frame > 0 ? "default" : "secondary"}
                          >
                            Quadro {orf.frame}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {orf.start + 1}-{orf.end + 1} (
                            {orf.end - orf.start + 1} pb)
                          </span>
                        </div>
                        <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                          {orf.protein.substring(0, 50)}
                          {orf.protein.length > 50 && "..."}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {orf.protein.length} aminoácidos
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
