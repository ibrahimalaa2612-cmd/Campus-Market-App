import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },

  /* ================= HEADER ================= */
  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  searchInput: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    fontSize: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  /* ================= FILTERS ================= */
  filterWrapper: {
    marginTop: 10,
  },

  categoriesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  categoryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,

    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  categoryBtnActive: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },

  categoryText: {
    fontSize: 12,
    color: "#374151",
  },

  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },

  cardBody: {
    padding: 12,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#16a34a",
    marginTop: 4,
  },

  meta: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 3,
  },

  /* ================= EMPTY ================= */
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#9ca3af",
  },
});
