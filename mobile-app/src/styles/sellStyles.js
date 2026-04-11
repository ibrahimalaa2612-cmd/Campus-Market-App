import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f4f6fb",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#111827",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  label: {
    marginBottom: 5,
    fontWeight: "600",
    color: "#374151",
  },

  pickerBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  /* ================= IMAGE UPLOAD (MODERN) ================= */
  uploadBox: {
    borderWidth: 2,
    borderColor: "#16a34a",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    backgroundColor: "#f0fdf4",
  },

  uploadText: {
    color: "#16a34a",
    fontWeight: "600",
    marginTop: 8,
  },

  uploadHint: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  imgBox: {
    width: "48%",
    margin: "1%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  img: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },

  submit: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
});
