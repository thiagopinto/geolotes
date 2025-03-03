export function isSafeColumnName(
  columnName: string,
  allowedColumns: string[],
): boolean {
  if (!columnName) {
    return false; // Nome da coluna não pode ser vazio ou indefinido
  }

  const lowerCaseColumnName = columnName.toLowerCase();

  return allowedColumns.includes(lowerCaseColumnName);
}
