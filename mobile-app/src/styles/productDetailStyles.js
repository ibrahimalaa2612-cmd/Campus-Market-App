import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },

  /* ================= IMAGE ================= */
  imageBox: {
    width: "100%",
    height: 280,
    backgroundColor: "#000",
    position: "relative",
  },

  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  arrow: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],

    width: 40,
    height: 40,

    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },

  left: {
    left: 10,
  },

  right: {
    right: 10,
  },

  arrowText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  /* ================= BOX ================= */
  box: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 14,
  },

  /* ================= TEXT ================= */
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: "#16a34a",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
    color: "#111827",
  },

  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  /* ================= TAGS ================= */
  tags: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },

  tag: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    color: "#374151",
  },

  /* ================= DESCRIPTION ================= */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  /* ================= SELLER ================= */
  sellerBox: {
    alignItems: "center",
  },

  sellerImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  sellerName: {
    fontSize: 16,
    fontWeight: "700",
  },

  sellerMeta: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
  },

  phoneBtn: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  phoneText: {
    color: "#fff",
    fontWeight: "600",
  },

  sold: {
    color: "red",
    fontWeight: "700",
    marginTop: 10,
  },

  /* ================= LOADING ================= */
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
