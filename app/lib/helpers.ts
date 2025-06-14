export function getInitials(name: string): string {
  const names = name.split(" ");
  if (names.length === 0) return "";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return `${names[0].charAt(0).toUpperCase()}${names[1]
    .charAt(0)
    .toUpperCase()}`;
}

export function filterData<
  T extends {
    name?: string;
    case_name?: string;
    intervention_date?: string | Date;
  }
>(
  data: T[],
  searchTerm: string,
  sortField: "name" | "case_name" | "date",
  sortDirection: "asc" | "desc"
): T[] {
  return data
    .filter((item) => {
      // Get the value to search in
      let value = "";
      if (sortField === "name") value = item.name ?? "";
      else if (sortField === "case_name") value = item.case_name ?? "";
      else if (sortField === "date")
        value = item.intervention_date ? String(item.intervention_date) : "";
      // Filter by search term (case-insensitive)
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      let aValue: string | number = "", bValue: string | number = "";
      if (sortField === "name") {
        aValue = a.name ?? "";
        bValue = b.name ?? "";
      } else if (sortField === "case_name") {
        aValue = a.case_name ?? "";
        bValue = b.case_name ?? "";
      } else if (sortField === "date") {
        aValue = new Date(a.intervention_date ?? 0).getTime();
        bValue = new Date(b.intervention_date ?? 0).getTime();
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
}
