import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  search: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  /* ================= TABS ================= */
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    margin: 4,
  },

  tabActive: {
    backgroundColor: "#16a34a",
  },

  tabText: {
    color: "#111",
    fontSize: 12,
  },

  tabTextActive: {
    color: "#fff",
  },

  /* ================= LIST ================= */
  listContainer: {
    paddingBottom: 120,
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: 180,
  },

  body: {
    padding: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  price: {
    color: "#16a34a",
    marginVertical: 5,
  },

  status: {
    fontSize: 12,
    padding: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
    color: "#fff",
  },

  pending: { backgroundColor: "#f59e0b" },
  approved: { backgroundColor: "#16a34a" },
  rejected: { backgroundColor: "#ef4444" },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 6,
  },

  btnText: {
    color: "#fff",
    fontSize: 12,
  },

  green: { backgroundColor: "#16a34a" },
  red: { backgroundColor: "#ef4444" },
  gray: { backgroundColor: "#6b7280" },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#6b7280",
  },
});
