import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    padding: 10,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  loading: {
    textAlign: "center",
    marginTop: 20,
  },

  row: {
    gap: 10,
  },

  /* CARD */
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 140,
  },

  body: {
    padding: 10,
  },

  title: {
    fontWeight: "bold",
  },

  price: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  meta: {
    fontSize: 12,
    color: "#6b7280",
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 10,
  },

  btn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  btnText: {
    color: "#fff",
    fontSize: 12,
  },

  green: {
    backgroundColor: "#16a34a",
  },

  red: {
    backgroundColor: "#ef4444",
  },

  blue: {
    backgroundColor: "#3b82f6",
  },

  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "red",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  textarea: {
    height: 80,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
