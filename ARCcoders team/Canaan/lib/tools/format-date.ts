export const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) {
    return "N/A"; // Or return an empty string: ''
  }

  // Step 1: Parse the string into a Date object
  const dateObject = new Date(dateString);

  // Step 2: Check if the parsed date is valid
  // new Date('invalid string') creates an "Invalid Date" object.
  // We can check for this with isNaN().
  if (isNaN(dateObject.getTime())) {
    return "Invalid Date";
  }

  // Step 3: Format the valid Date object
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
