import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getNucleotideComposition,
  calculateGCContent,
  cleanSequence,
} from "@/lib/bioinformatics";
import { SequenceType } from "./SequenceInput";
import { Eye, PieChart as PieChartIcon } from "lucide-react";

interface SequenceVisualizationProps {
  sequence: string;
  sequenceType: SequenceType;
}

const NUCLEOTIDE_COLORS = {
  A: "#FF6B6B", // Vermelho
  T: "#4ECDC4", // Verde-azulado
  U: "#4ECDC4", // Verde-azulado (para RNA)
  G: "#45B7D1", // Azul
  C: "#96CEB4", // Verde
};

const AMINO_ACID_COLORS = {
  // Hidrofóbicos
  A: "#FF9999",
  V: "#FF9999",
  I: "#FF9999",
  L: "#FF9999",
  M: "#FF9999",
  F: "#FF9999",
  W: "#FF9999",
  P: "#FF9999",
  // Polares
  S: "#99CCFF",
  T: "#99CCFF",
  N: "#99CCFF",
  Q: "#99CCFF",
  Y: "#99CCFF",
  C: "#99CCFF",
  // Carregados (positivos)
  K: "#99FF99",
  R: "#99FF99",
  H: "#99FF99",
  // Carregados (negativos)
  D: "#FFB366",
  E: "#FFB366",
  // Especiais
  G: "#CCCCCC",
  "*": "#000000",
};

export function SequenceVisualization({
  sequence,
  sequenceType,
}: SequenceVisualizationProps) {
  const cleanSeq = cleanSequence(sequence);

  const compositionData = useMemo(() => {
    if (sequenceType === "protein") {
      const composition: Record<string, number> = {};
      for (const aa of cleanSeq) {
        composition[aa] = (composition[aa] || 0) + 1;
      }
      return Object.entries(composition)
        .map(([aa, count]) => ({
          name: aa,
          value: count,
          percentage: ((count / cleanSeq.length) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value);
    } else {
      const composition = getNucleotideComposition(cleanSeq);
      return Object.entries(composition)
        .filter(([_, count]) => count > 0)
        .map(([nucleotide, count]) => ({
          name: nucleotide,
          value: count,
          percentage: ((count / cleanSeq.length) * 100).toFixed(1),
        }));
    }
  }, [cleanSeq, sequenceType]);

  const gcContent = useMemo(() => {
    if (sequenceType !== "protein") {
      return calculateGCContent(cleanSeq);
    }
    return 0;
  }, [cleanSeq, sequenceType]);

  const renderSequenceString = () => {
    const maxDisplay = 1000; // Limita a exibição para performance
    const displaySeq = cleanSeq.substring(0, maxDisplay);

    return (
      <div className="font-mono text-xs leading-relaxed break-all">
        {displaySeq.split("").map((char, index) => {
          const colors =
            sequenceType === "protein" ? AMINO_ACID_COLORS : NUCLEOTIDE_COLORS;
          const color = colors[char as keyof typeof colors] || "#999999";

          return (
            <span
              key={index}
              className="inline-block w-3 h-3 text-center text-white text-xs leading-3 margin-0.5"
              style={{
                backgroundColor: color,
                margin: "1px",
              }}
              title={`${char} na posição ${index + 1}`}
            >
              {char}
            </span>
          );
        })}
        {cleanSeq.length > maxDisplay && (
          <div className="text-muted-foreground mt-2">
            ... e mais {cleanSeq.length - maxDisplay} caracteres
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Exibição da Sequência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Visualização da Sequência</span>
          </CardTitle>
          <CardDescription>
            Representação da sequência com codificação por cores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <Badge variant="outline">Comprimento: {cleanSeq.length}</Badge>
              {sequenceType !== "protein" && (
                <Badge variant="outline">
                  Conteúdo GC: {gcContent.toFixed(1)}%
                </Badge>
              )}
            </div>

            <div className="max-h-40 overflow-y-auto p-3 bg-muted rounded-md">
              {renderSequenceString()}
            </div>

            {/* Legenda de Cores */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legenda de Cores:</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {sequenceType === "protein" ? (
                  <>
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: "#FF9999" }}
                      ></div>
                      <span>Hidrofóbicos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: "#99CCFF" }}
                      ></div>
                      <span>Polares</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: "#99FF99" }}
                      ></div>
                      <span>Positivos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: "#FFB366" }}
                      ></div>
                      <span>Negativos</span>
                    </div>
                  </>
                ) : (
                  Object.entries(NUCLEOTIDE_COLORS).map(
                    ([nucleotide, color]) => (
                      <div
                        key={nucleotide}
                        className="flex items-center space-x-1"
                      >
                        <div
                          className="w-3 h-3"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span>{nucleotide}</span>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Composição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Gráfico de Barras da Composição</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={compositionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} (${compositionData.find((d) => d.name === name)?.percentage}%)`,
                    "Contagem",
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill={(entry) => {
                    const colors =
                      sequenceType === "protein"
                        ? AMINO_ACID_COLORS
                        : NUCLEOTIDE_COLORS;
                    return (
                      colors[entry?.name as keyof typeof colors] || "#8884d8"
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Gráfico de Pizza da Composição</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => {
                    const colors =
                      sequenceType === "protein"
                        ? AMINO_ACID_COLORS
                        : NUCLEOTIDE_COLORS;
                    const color =
                      colors[entry.name as keyof typeof colors] || "#8884d8";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} (${compositionData.find((d) => d.name === name)?.percentage}%)`,
                    "Contagem",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo GC/AT para nucleotídeos */}
      {sequenceType !== "protein" && (
        <Card>
          <CardHeader>
            <CardTitle>Análise de Conteúdo de Bases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conteúdo GC</span>
                  <span>{gcContent.toFixed(1)}%</span>
                </div>
                <Progress value={gcContent} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conteúdo AT</span>
                  <span>{(100 - gcContent).toFixed(1)}%</span>
                </div>
                <Progress value={100 - gcContent} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
