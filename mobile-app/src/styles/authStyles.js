import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#22c55e",
    marginBottom: 20,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",

    paddingVertical: 14,
    paddingHorizontal: 12,

    borderRadius: 10,
    fontSize: 16,

    color: "#111827", // 👈 مهم جدًا عشان النص يبقى واضح

    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryBtn: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  error: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },

  link: {
    color: "#22c55e",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },

  textMuted: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 10,
  },
});
