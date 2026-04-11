export const formatDate = (value) => {
  if (!value) return "غير محدد";

  // Firestore Timestamp
  if (value?.seconds) {
    return new Date(value.seconds * 1000).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // JS Date
  if (value instanceof Date) {
    return value.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // string fallback
  return new Date(value).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};