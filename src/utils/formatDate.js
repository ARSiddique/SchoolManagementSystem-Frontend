import moment from "moment";
export function formatDate(date) {
  const formattedDate = moment(date).format("YYYY, MMMM DD"); // Output: "2024, January 03"
  return formattedDate;
}
