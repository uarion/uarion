import type { MetadataRoute } from "next";
import { fetchApprovedProductsForSitemap } from "@/lib/productsPublic";

const SITE_URL = "https://uarion.com";

const staticPaths = [
  "",
  "/market",
  "/certification",
  "/authenticity",
  "/playbook",
  "/sell",
  "/registry",
  "/creators",
  "/community",
  "/terms",
  "/privacy",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/market" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/market" ? 0.9 : 0.7,
  }));

  const products = await fetchApprovedProductsForSitemap();
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/market/${product.id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
