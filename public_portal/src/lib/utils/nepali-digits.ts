const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliDigits(value: number | string): string {
  const str = value.toString();
  return str.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)]);
}
