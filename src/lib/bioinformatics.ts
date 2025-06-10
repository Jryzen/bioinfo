export interface SequenceAnalysis {
  sequence: string;
  length: number;
  gcContent: number;
  atContent: number;
  composition: {
    A: number;
    T: number;
    G: number;
    C: number;
    U?: number;
  };
  molecularWeight?: number;
  meltingTemperature?: number;
}

export interface ProteinAnalysis {
  sequence: string;
  length: number;
  molecularWeight: number;
  composition: Record<string, number>;
  isoelectricPoint?: number;
}

// DNA/RNA sequence validation
export const validateDNASequence = (sequence: string): boolean => {
  const dnaPattern = /^[ATCG\s\n\r]+$/i;
  return dnaPattern.test(sequence.replace(/\s/g, ""));
};

export const validateRNASequence = (sequence: string): boolean => {
  const rnaPattern = /^[AUCG\s\n\r]+$/i;
  return rnaPattern.test(sequence.replace(/\s/g, ""));
};

export const validateProteinSequence = (sequence: string): boolean => {
  const proteinPattern = /^[ACDEFGHIKLMNPQRSTVWY\s\n\r*]+$/i;
  return proteinPattern.test(sequence.replace(/\s/g, ""));
};

// Clean sequence (remove spaces, newlines, numbers)
export const cleanSequence = (sequence: string): string => {
  return sequence.replace(/[^A-Za-z]/g, "").toUpperCase();
};

// Calculate GC content
export const calculateGCContent = (sequence: string): number => {
  const cleanSeq = cleanSequence(sequence);
  const gcCount = (cleanSeq.match(/[GC]/g) || []).length;
  return cleanSeq.length > 0 ? (gcCount / cleanSeq.length) * 100 : 0;
};

// Calculate AT content
export const calculateATContent = (sequence: string): number => {
  const cleanSeq = cleanSequence(sequence);
  const atCount = (cleanSeq.match(/[AT]/g) || []).length;
  return cleanSeq.length > 0 ? (atCount / cleanSeq.length) * 100 : 0;
};

// Get nucleotide composition
export const getNucleotideComposition = (sequence: string) => {
  const cleanSeq = cleanSequence(sequence);
  const composition = { A: 0, T: 0, G: 0, C: 0, U: 0 };

  for (const nucleotide of cleanSeq) {
    if (nucleotide in composition) {
      composition[nucleotide as keyof typeof composition]++;
    }
  }

  return composition;
};

// Reverse complement for DNA
export const reverseComplement = (sequence: string): string => {
  const complement: Record<string, string> = {
    A: "T",
    T: "A",
    G: "C",
    C: "G",
    a: "t",
    t: "a",
    g: "c",
    c: "g",
  };

  return cleanSequence(sequence)
    .split("")
    .reverse()
    .map((nucleotide) => complement[nucleotide] || nucleotide)
    .join("");
};

// Translate DNA to protein
export const translateDNA = (sequence: string, frame: number = 0): string => {
  const geneticCode: Record<string, string> = {
    TTT: "F",
    TTC: "F",
    TTA: "L",
    TTG: "L",
    TCT: "S",
    TCC: "S",
    TCA: "S",
    TCG: "S",
    TAT: "Y",
    TAC: "Y",
    TAA: "*",
    TAG: "*",
    TGT: "C",
    TGC: "C",
    TGA: "*",
    TGG: "W",
    CTT: "L",
    CTC: "L",
    CTA: "L",
    CTG: "L",
    CCT: "P",
    CCC: "P",
    CCA: "P",
    CCG: "P",
    CAT: "H",
    CAC: "H",
    CAA: "Q",
    CAG: "Q",
    CGT: "R",
    CGC: "R",
    CGA: "R",
    CGG: "R",
    ATT: "I",
    ATC: "I",
    ATA: "I",
    ATG: "M",
    ACT: "T",
    ACC: "T",
    ACA: "T",
    ACG: "T",
    AAT: "N",
    AAC: "N",
    AAA: "K",
    AAG: "K",
    AGT: "S",
    AGC: "S",
    AGA: "R",
    AGG: "R",
    GTT: "V",
    GTC: "V",
    GTA: "V",
    GTG: "V",
    GCT: "A",
    GCC: "A",
    GCA: "A",
    GCG: "A",
    GAT: "D",
    GAC: "D",
    GAA: "E",
    GAG: "E",
    GGT: "G",
    GGC: "G",
    GGA: "G",
    GGG: "G",
  };

  const cleanSeq = cleanSequence(sequence);
  let protein = "";

  for (let i = frame; i < cleanSeq.length - 2; i += 3) {
    const codon = cleanSeq.substring(i, i + 3);
    if (codon.length === 3) {
      protein += geneticCode[codon] || "X";
    }
  }

  return protein;
};

// Calculate molecular weight for DNA/RNA
export const calculateMolecularWeight = (
  sequence: string,
  isRNA: boolean = false,
): number => {
  const cleanSeq = cleanSequence(sequence);
  const weights = isRNA
    ? { A: 331.2, U: 308.2, G: 347.2, C: 307.2 }
    : { A: 331.2, T: 322.2, G: 347.2, C: 307.2 };

  let totalWeight = 0;
  for (const nucleotide of cleanSeq) {
    totalWeight += weights[nucleotide as keyof typeof weights] || 0;
  }

  return totalWeight;
};

// Calculate melting temperature (simplified)
export const calculateMeltingTemperature = (sequence: string): number => {
  const cleanSeq = cleanSequence(sequence);
  const gcContent = calculateGCContent(cleanSeq);
  const length = cleanSeq.length;

  // Simplified calculation - for short sequences
  if (length < 14) {
    return (
      (cleanSeq.match(/[AT]/g) || []).length * 2 +
      (cleanSeq.match(/[GC]/g) || []).length * 4
    );
  }

  // For longer sequences
  return 64.9 + 41 * (gcContent / 100) - 675 / length;
};

// Analyze DNA/RNA sequence
export const analyzeSequence = (
  sequence: string,
  isRNA: boolean = false,
): SequenceAnalysis => {
  const cleanSeq = cleanSequence(sequence);
  const composition = getNucleotideComposition(cleanSeq);

  return {
    sequence: cleanSeq,
    length: cleanSeq.length,
    gcContent: calculateGCContent(cleanSeq),
    atContent: calculateATContent(cleanSeq),
    composition,
    molecularWeight: calculateMolecularWeight(cleanSeq, isRNA),
    meltingTemperature: calculateMeltingTemperature(cleanSeq),
  };
};

// Analyze protein sequence
export const analyzeProtein = (sequence: string): ProteinAnalysis => {
  const cleanSeq = cleanSequence(sequence);
  const composition: Record<string, number> = {};

  // Count amino acids
  for (const aa of cleanSeq) {
    composition[aa] = (composition[aa] || 0) + 1;
  }

  // Simplified molecular weight calculation for proteins
  const aaWeights: Record<string, number> = {
    A: 89.1,
    R: 174.2,
    N: 132.1,
    D: 133.1,
    C: 121.2,
    E: 147.1,
    Q: 146.2,
    G: 75.1,
    H: 155.2,
    I: 131.2,
    L: 131.2,
    K: 146.2,
    M: 149.2,
    F: 165.2,
    P: 115.1,
    S: 105.1,
    T: 119.1,
    W: 204.2,
    Y: 181.2,
    V: 117.1,
  };

  let molecularWeight = 0;
  for (const aa of cleanSeq) {
    molecularWeight += aaWeights[aa] || 0;
  }

  return {
    sequence: cleanSeq,
    length: cleanSeq.length,
    molecularWeight,
    composition,
  };
};

// Find ORFs (Open Reading Frames)
export const findORFs = (
  sequence: string,
  minLength: number = 100,
): Array<{ start: number; end: number; frame: number; protein: string }> => {
  const cleanSeq = cleanSequence(sequence);
  const orfs = [];

  // Check all 6 reading frames (3 forward, 3 reverse)
  for (let frame = 0; frame < 3; frame++) {
    // Forward frames
    const forwardProtein = translateDNA(cleanSeq, frame);
    let start = -1;

    for (let i = 0; i < forwardProtein.length; i++) {
      if (forwardProtein[i] === "M" && start === -1) {
        start = i;
      } else if (forwardProtein[i] === "*" && start !== -1) {
        const orfLength = (i - start) * 3;
        if (orfLength >= minLength) {
          orfs.push({
            start: start * 3 + frame,
            end: i * 3 + frame + 2,
            frame: frame + 1,
            protein: forwardProtein.substring(start, i),
          });
        }
        start = -1;
      }
    }

    // Reverse frames
    const reverseSeq = reverseComplement(cleanSeq);
    const reverseProtein = translateDNA(reverseSeq, frame);
    start = -1;

    for (let i = 0; i < reverseProtein.length; i++) {
      if (reverseProtein[i] === "M" && start === -1) {
        start = i;
      } else if (reverseProtein[i] === "*" && start !== -1) {
        const orfLength = (i - start) * 3;
        if (orfLength >= minLength) {
          orfs.push({
            start: cleanSeq.length - (i * 3 + frame + 2),
            end: cleanSeq.length - (start * 3 + frame),
            frame: -(frame + 1),
            protein: reverseProtein.substring(start, i),
          });
        }
        start = -1;
      }
    }
  }

  return orfs;
};

// Parse FASTA format
export const parseFASTA = (
  fastaText: string,
): Array<{ header: string; sequence: string }> => {
  const sequences = [];
  const lines = fastaText.split("\n");
  let currentHeader = "";
  let currentSequence = "";

  for (const line of lines) {
    if (line.startsWith(">")) {
      if (currentHeader && currentSequence) {
        sequences.push({
          header: currentHeader,
          sequence: cleanSequence(currentSequence),
        });
      }
      currentHeader = line.substring(1).trim();
      currentSequence = "";
    } else {
      currentSequence += line.trim();
    }
  }

  // Add the last sequence
  if (currentHeader && currentSequence) {
    sequences.push({
      header: currentHeader,
      sequence: cleanSequence(currentSequence),
    });
  }

  return sequences;
};
