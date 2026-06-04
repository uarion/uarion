import type { Product } from "@/types/product";

export const dummyProducts: Product[] = [
  {
    id: "1",
    title: "이메일 자동 분류 워크플로",
    description:
      "수신 메일을 카테고리별로 자동 분류하고 요약 알림을 보내는 n8n 워크플로 템플릿입니다.",
    price: 29000,
    verificationScore: 87,
    certificationStatus: "검증됨",
    registeredAt: "2026-06-05",
    verificationReport: {
      certificationLabel: "창작물 인증: 검증 완료",
      criteria: [
        { label: "실행 환경", score: 22, note: "n8n 호환 환경에서 정상 실행 확인" },
        { label: "결과물 품질", score: 24, note: "분류 정확도 샘플 테스트 통과" },
        { label: "확장성", score: 20, note: "노드 추가·커스터마이징 여지 충분" },
        { label: "업데이트 가능성", score: 21, note: "버전 관리 및 패치 경로 명시" },
      ],
    },
  },
  {
    id: "2",
    title: "SNS 콘텐츠 초안 생성기",
    description:
      "주제만 입력하면 인스타·블로그용 초안을 생성하는 AI 프롬프트 패키지입니다.",
    price: 15000,
    verificationScore: 72,
    certificationStatus: "인증 대기",
    registeredAt: "2026-06-04",
    verificationReport: {
      certificationLabel: "창작물 인증: 검증 대기",
      criteria: [
        { label: "실행 환경", score: 18, note: "주요 LLM API 연동 테스트 진행 중" },
        { label: "결과물 품질", score: 19, note: "초안 일관성 추가 샘플 필요" },
        { label: "확장성", score: 17, note: "플랫폼별 변형 가이드 보완 예정" },
        { label: "업데이트 가능성", score: 18, note: "프롬프트 버전 이력 등록됨" },
      ],
    },
  },
  {
    id: "3",
    title: "재고 알림 자동화 스크립트",
    description:
      "스프레드시트 재고가 임계값 이하일 때 슬랙으로 알림을 보내는 자동화 스크립트입니다.",
    price: 45000,
    verificationScore: 91,
    certificationStatus: "검증됨",
    registeredAt: "2026-06-03",
    verificationReport: {
      certificationLabel: "창작물 인증: 검증 완료",
      criteria: [
        { label: "실행 환경", score: 24, note: "Google Sheets·Slack 연동 검증" },
        { label: "결과물 품질", score: 23, note: "알림 지연·누락 없음" },
        { label: "확장성", score: 22, note: "다중 시트·채널 확장 가능" },
        { label: "업데이트 가능성", score: 22, note: "의존성 및 변경 이력 문서화" },
      ],
    },
  },
];

export function getDummyProductById(id: string): Product | undefined {
  return dummyProducts.find((p) => p.id === id);
}
