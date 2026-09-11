export class DateFormatter {
  static format(date: Date) {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
}
