import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  validateDNASequence,
  validateRNASequence,
  validateProteinSequence,
  cleanSequence,
} from "@/lib/bioinformatics";
import { AlertCircle, Dna, Upload } from "lucide-react";

export type SequenceType = "dna" | "rna" | "protein";

interface SequenceInputProps {
  onSequenceSubmit: (sequence: string, type: SequenceType) => void;
  defaultType?: SequenceType;
}

export function SequenceInput({
  onSequenceSubmit,
  defaultType = "dna",
}: SequenceInputProps) {
  const [sequence, setSequence] = useState("");
  const [sequenceType, setSequenceType] = useState<SequenceType>(defaultType);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const validateSequence = (seq: string, type: SequenceType): boolean => {
    if (!seq.trim()) return false;

    switch (type) {
      case "dna":
        return validateDNASequence(seq);
      case "rna":
        return validateRNASequence(seq);
      case "protein":
        return validateProteinSequence(seq);
      default:
        return false;
    }
  };

  const handleSequenceChange = (value: string) => {
    setSequence(value);

    if (value.trim()) {
      const valid = validateSequence(value, sequenceType);
      setIsValid(valid);

      if (!valid) {
        const type = sequenceType.toUpperCase();
        setError(
          `Sequência ${type} inválida. Verifique se há caracteres inválidos.`,
        );
      } else {
        setError("");
      }
    } else {
      setIsValid(null);
      setError("");
    }
  };

  const handleTypeChange = (type: SequenceType) => {
    setSequenceType(type);
    if (sequence.trim()) {
      const valid = validateSequence(sequence, type);
      setIsValid(valid);

      if (!valid) {
        setError(
          `Sequência ${type.toUpperCase()} inválida. Verifique se há caracteres inválidos.`,
        );
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = () => {
    if (sequence.trim() && isValid) {
      onSequenceSubmit(sequence, sequenceType);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSequence(content);
        handleSequenceChange(content);
      };
      reader.readAsText(file);
    }
  };

  const exampleSequences = {
    dna: "ATGGCGATCGCGATCGCGATCGCGATCGCGTAGCGATCGCGATCGCGATCGCGATCGCGTAGCGATCGCGATCGCGATCGCGTAG",
    rna: "AUGGCGAUCGCGAUCGCGAUCGCGAUCGCGUAGCGAUCGCGAUCGCGAUCGCGAUCGCGUAGCGAUCGCGAUCGCGAUCGCGUAG",
    protein: "MVIAIAIAIARIAIAIAIAIARIAIAIAIAR",
  };

  const loadExample = () => {
    const example = exampleSequences[sequenceType];
    setSequence(example);
    handleSequenceChange(example);
  };

  const cleanedSequence = sequence ? cleanSequence(sequence) : "";
  const sequenceLength = cleanedSequence.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dna className="h-5 w-5" />
          <span>Entrada de Sequência</span>
        </CardTitle>
        <CardDescription>
          Digite ou carregue sua sequência para análise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sequence-type">Tipo de Sequência</Label>
          <Select value={sequenceType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dna">DNA</SelectItem>
              <SelectItem value="rna">RNA</SelectItem>
              <SelectItem value="protein">Proteína</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sequence">Sequência</Label>
          <Textarea
            id="sequence"
            placeholder={`Digite sua sequência de ${sequenceType.toUpperCase()} aqui...`}
            value={sequence}
            onChange={(e) => handleSequenceChange(e.target.value)}
            className="min-h-32 font-mono text-sm"
          />

          {sequence && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Badge variant="outline">Comprimento: {sequenceLength}</Badge>
              {isValid !== null && (
                <Badge variant={isValid ? "default" : "destructive"}>
                  {isValid ? "Válida" : "Inválida"}
                </Badge>
              )}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!sequence.trim() || !isValid}
            className="flex-1"
          >
            Analisar Sequência
          </Button>

          <Button onClick={loadExample} variant="outline" className="flex-1">
            Carregar Exemplo
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".txt,.fasta,.fa,.seq"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Carregar Arquivo
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Formatos suportados:</strong> Texto simples, FASTA (.fasta,
            .fa), arquivos de sequência (.seq, .txt)
          </p>
          <p>
            <strong>Caracteres válidos:</strong>
          </p>
          <ul className="list-disc list-inside ml-2">
            <li>DNA: A, T, G, C</li>
            <li>RNA: A, U, G, C</li>
            <li>Proteína: 20 aminoácidos padrão + códon de parada (*)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
