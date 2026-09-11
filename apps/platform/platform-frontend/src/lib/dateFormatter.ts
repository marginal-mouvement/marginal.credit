export class DateFormatter {
  static format(date: Date) {
    return `Le ${date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })}`;
  }
}
