import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#16a34a",
  },

  uploadBtn: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },

  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 16,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  textarea: {
    height: 80,
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
  },

  option: {
    padding: 8,
    color: "#374151",
  },

  saveBtn: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  success: {
    color: "#16a34a",
    marginTop: 10,
  },

  error: {
    color: "#ef4444",
    marginTop: 10,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});
