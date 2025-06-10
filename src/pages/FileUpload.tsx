import { useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  parseFASTA,
  analyzeSequence,
  analyzeProtein,
  validateDNASequence,
  validateRNASequence,
  validateProteinSequence,
  SequenceAnalysis,
  ProteinAnalysis,
} from "@/lib/bioinformatics";
import { SequenceType } from "@/components/SequenceInput";

interface UploadedSequence {
  id: string;
  header: string;
  sequence: string;
  type: SequenceType;
  isValid: boolean;
  analysis?: SequenceAnalysis | ProteinAnalysis;
}

export default function FileUploadPage() {
  const [uploadedSequences, setUploadedSequences] = useState<
    UploadedSequence[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedSequence, setSelectedSequence] =
    useState<UploadedSequence | null>(null);

  const detectSequenceType = (sequence: string): SequenceType => {
    if (validateDNASequence(sequence)) return "dna";
    if (validateRNASequence(sequence)) return "rna";
    if (validateProteinSequence(sequence)) return "protein";
    return "dna"; // fallback padrão
  };

  const processSequences = useCallback(
    (sequences: Array<{ header: string; sequence: string }>) => {
      const processed: UploadedSequence[] = sequences.map((seq, index) => {
        const type = detectSequenceType(seq.sequence);
        const isValid =
          type === "dna"
            ? validateDNASequence(seq.sequence)
            : type === "rna"
              ? validateRNASequence(seq.sequence)
              : validateProteinSequence(seq.sequence);

        let analysis;
        if (isValid) {
          analysis =
            type === "protein"
              ? analyzeProtein(seq.sequence)
              : analyzeSequence(seq.sequence, type === "rna");
        }

        return {
          id: `seq_${Date.now()}_${index}`,
          header: seq.header || `Sequência ${index + 1}`,
          sequence: seq.sequence,
          type,
          isValid,
          analysis,
        };
      });

      setUploadedSequences((prev) => [...prev, ...processed]);
    },
    [],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      setIsProcessing(true);
      setUploadProgress(0);

      Array.from(files).forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;

          // Tenta analisar como FASTA primeiro
          const fastaSequences = parseFASTA(content);

          if (fastaSequences.length > 0) {
            processSequences(fastaSequences);
          } else {
            // Trata como sequência única
            processSequences([
              {
                header: file.name.replace(/\.[^/.]+$/, ""),
                sequence: content,
              },
            ]);
          }

          setUploadProgress(((fileIndex + 1) / files.length) * 100);

          if (fileIndex === files.length - 1) {
            setTimeout(() => {
              setIsProcessing(false);
              setUploadProgress(0);
            }, 500);
          }
        };
        reader.readAsText(file);
      });

      // Reseta o input
      event.target.value = "";
    },
    [processSequences],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(fakeEvent);
    }
  };

  const removeSequence = (id: string) => {
    setUploadedSequences((prev) => prev.filter((seq) => seq.id !== id));
    if (selectedSequence?.id === id) {
      setSelectedSequence(null);
    }
  };

  const clearAll = () => {
    setUploadedSequences([]);
    setSelectedSequence(null);
  };

  const exportResults = () => {
    const results = {
      sequencias: uploadedSequences.map((seq) => ({
        cabecalho: seq.header,
        sequencia: seq.sequence,
        tipo: seq.type,
        analise: seq.analysis,
      })),
      totalSequencias: uploadedSequences.length,
      sequenciasValidas: uploadedSequences.filter((seq) => seq.isValid).length,
      dataExportacao: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultados_analise_lote_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validSequences = uploadedSequences.filter((seq) => seq.isValid);
  const invalidSequences = uploadedSequences.filter((seq) => !seq.isValid);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:pl-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Upload className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">
                    Upload de Arquivos em Lote
                  </h1>
                  <p className="text-muted-foreground">
                    Carregue e analise múltiplos arquivos de sequência de uma
                    vez
                  </p>
                </div>
              </div>

              {uploadedSequences.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={exportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Resultados
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Tudo
                  </Button>
                </div>
              )}
            </div>

            {/* Área de Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload de Arquivos</CardTitle>
                <CardDescription>
                  Carregue arquivos FASTA, arquivos de sequência ou arquivos de
                  texto simples contendo sequências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Carregar Arquivos de Sequência
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Arraste e solte os arquivos aqui ou clique para navegar
                  </p>

                  <input
                    type="file"
                    multiple
                    accept=".fasta,.fa,.seq,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>Escolher Arquivos</span>
                    </Button>
                  </label>

                  <div className="text-xs text-muted-foreground mt-4">
                    Formatos suportados: FASTA (.fasta, .fa), arquivos de
                    sequência (.seq), arquivos de texto (.txt)
                  </div>
                </div>

                {isProcessing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processando arquivos...</span>
                      <span>{uploadProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resultados */}
            {uploadedSequences.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resumo */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total de Sequências</span>
                          <Badge>{uploadedSequences.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Sequências Válidas</span>
                          <Badge variant="default">
                            {validSequences.length}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Sequências Inválidas</span>
                          <Badge variant="destructive">
                            {invalidSequences.length}
                          </Badge>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h4 className="font-medium">Tipos de Sequência</h4>
                          {["dna", "rna", "protein"].map((type) => {
                            const count = validSequences.filter(
                              (seq) => seq.type === type,
                            ).length;
                            const typeLabels = {
                              dna: "DNA",
                              rna: "RNA",
                              protein: "Proteína",
                            };
                            return (
                              count > 0 && (
                                <div
                                  key={type}
                                  className="flex justify-between text-sm"
                                >
                                  <span>
                                    {
                                      typeLabels[
                                        type as keyof typeof typeLabels
                                      ]
                                    }
                                  </span>
                                  <span>{count}</span>
                                </div>
                              )
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de Sequências e Detalhes */}
                <div className="lg:col-span-2">
                  <Tabs defaultValue="list">
                    <TabsList>
                      <TabsTrigger value="list">
                        Lista de Sequências
                      </TabsTrigger>
                      <TabsTrigger value="details" disabled={!selectedSequence}>
                        Detalhes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                      <Card>
                        <CardHeader>
                          <CardTitle>Sequências Carregadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-96">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Cabeçalho</TableHead>
                                  <TableHead>Tipo</TableHead>
                                  <TableHead>Comprimento</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {uploadedSequences.map((seq) => (
                                  <TableRow key={seq.id}>
                                    <TableCell className="max-w-48 truncate">
                                      {seq.header}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {seq.type === "dna"
                                          ? "DNA"
                                          : seq.type === "rna"
                                            ? "RNA"
                                            : "Proteína"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{seq.sequence.length}</TableCell>
                                    <TableCell>
                                      {seq.isValid ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            setSelectedSequence(seq)
                                          }
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeSequence(seq.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="details">
                      {selectedSequence && (
                        <Card>
                          <CardHeader>
                            <CardTitle>{selectedSequence.header}</CardTitle>
                            <CardDescription>
                              Sequência de{" "}
                              {selectedSequence.type === "dna"
                                ? "DNA"
                                : selectedSequence.type === "rna"
                                  ? "RNA"
                                  : "proteína"}{" "}
                              • {selectedSequence.sequence.length} caracteres
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {!selectedSequence.isValid ? (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Esta sequência contém caracteres inválidos
                                  para o tipo detectado.
                                </AlertDescription>
                              </Alert>
                            ) : (
                              selectedSequence.analysis && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                      <div className="text-lg font-bold">
                                        {selectedSequence.analysis.length}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Comprimento
                                      </div>
                                    </div>

                                    {"gcContent" in
                                      selectedSequence.analysis && (
                                      <>
                                        <div className="text-center p-3 bg-muted rounded-lg">
                                          <div className="text-lg font-bold">
                                            {selectedSequence.analysis.gcContent.toFixed(
                                              1,
                                            )}
                                            %
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Conteúdo GC
                                          </div>
                                        </div>
                                        <div className="text-center p-3 bg-muted rounded-lg">
                                          <div className="text-lg font-bold">
                                            {selectedSequence.analysis.atContent.toFixed(
                                              1,
                                            )}
                                            %
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Conteúdo AT
                                          </div>
                                        </div>
                                      </>
                                    )}

                                    <div className="text-center p-3 bg-muted rounded-lg">
                                      <div className="text-lg font-bold">
                                        {selectedSequence.analysis
                                          .molecularWeight
                                          ? `${(selectedSequence.analysis.molecularWeight / 1000).toFixed(1)}`
                                          : "N/A"}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        PM (kDa)
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Visualização da Sequência
                                    </h4>
                                    <ScrollArea className="h-32 border rounded-md p-3">
                                      <div className="font-mono text-sm break-all">
                                        {selectedSequence.sequence.substring(
                                          0,
                                          500,
                                        )}
                                        {selectedSequence.sequence.length >
                                          500 && "..."}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </div>
                              )
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
