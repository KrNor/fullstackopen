export interface Diagnosies {
  code: string;
  name: string;
  latin?: string;
}

export type DiagnosesNoLatin = Omit<Diagnosies, "latin">;
