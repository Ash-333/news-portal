declare module 'bikram-sambat' {
  export function AD2BS(date: { year: number; month: number; day: number }): {
    year: number;
    month: number;
    day: number;
    strMonth: string;
  };
}