import { readApiJsonResponse } from "@/lib/parseApiResponse";

export async function requestProductDownloadUrl(
  productId: string,
  accessToken: string,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const res = await fetch(`/api/download/${encodeURIComponent(productId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const parsed = await readApiJsonResponse<{ url?: string }>(res, "다운로드");
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const url = parsed.data.url?.trim();
  if (!url) {
    return { ok: false, message: "다운로드 실패: 서버 응답에 URL이 없습니다." };
  }

  return { ok: true, url };
}

export function startFileDownload(url: string) {
  window.location.assign(url);
}
