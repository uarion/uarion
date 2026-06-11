export type ApiJsonResult<T extends Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/** fetch 응답을 text → JSON.parse로 안전하게 읽습니다. */
export async function readApiJsonResponse<T extends Record<string, unknown>>(
  res: Response,
  actionLabel: string,
): Promise<ApiJsonResult<T>> {
  const text = await res.text();

  if (!text.trim()) {
    return {
      ok: false,
      message: `${actionLabel} 실패: ${res.status} (서버 응답이 비어 있습니다)`,
    };
  }

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    const preview = text.slice(0, 80).replace(/\s+/g, " ");
    return {
      ok: false,
      message: `${actionLabel} 실패: ${res.status} (JSON 파싱 오류${preview ? `: ${preview}` : ""})`,
    };
  }

  if (!res.ok) {
    const serverMessage = typeof data.error === "string" ? data.error : "알 수 없는 오류";
    return {
      ok: false,
      message: `${actionLabel} 실패: ${res.status} ${serverMessage}`,
    };
  }

  return { ok: true, data };
}
