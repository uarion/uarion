import IntroCard from "@/components/IntroCard";
import PageHeader from "@/components/PageHeader";

const registryFields = [
  { label: "등록번호", value: "UA-2026-000001" },
  { label: "제작자", value: "creator@uarion.example" },
  { label: "등록일", value: "2026-06-05" },
  { label: "버전", value: "v1.2.0" },
  { label: "사용 AI 모델", value: "Claude · GPT-4 · n8n" },
  { label: "라이선스", value: "상업적 이용 가능 (명시)" },
  { label: "업데이트 이력", value: "v1.0 (2026-05-01) → v1.2.0 (2026-06-05)" },
  { label: "인증 상태", value: "UARION 검증 대기" },
];

export default function RegistryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader
        badge="AI Registry"
        title="AI Registry"
        description="창작물·자동화에 고유 등록번호를 부여하고, 제작 이력·버전·모델·라이선스를 한곳에서 추적하는 등록소입니다. (설계 소개 화면)"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <IntroCard title="이 공간에서 할 일">
          <ul className="space-y-3 leading-relaxed">
            <li>· 등록 신청 접수 및 고유 번호 발급</li>
            <li>· 버전·업데이트 이력 타임라인 기록</li>
            <li>· 인증 상태와 마켓 상품 연동</li>
            <li>· 분쟁·라이선스 확인용 공개 레지스트리 (정책 확정 후)</li>
          </ul>
        </IntroCard>

        <IntroCard title="등록 카드 예시">
          <dl className="space-y-3">
            {registryFields.map((field) => (
              <div
                key={field.label}
                className="flex flex-col gap-1 border-b border-navy-700/80 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between"
              >
                <dt className="text-slate-500">{field.label}</dt>
                <dd className="font-medium text-slate-200">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-body-muted mt-4">
            실제 등록·조회 기능은 다음 단계에서 연결됩니다.
          </p>
        </IntroCard>
      </div>
    </div>
  );
}
