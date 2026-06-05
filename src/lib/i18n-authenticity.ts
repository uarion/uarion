import type { Locale } from "@/lib/i18n";

type L = Record<Locale, string>;

function tr(ko: string, en: string): L {
  return { ko, en };
}

export const authenticityI18n = {
  comingSoon: tr("준비중", "Coming Soon"),
  hero: {
    label: tr("UARION Authenticity", "UARION Authenticity"),
    title: tr(
      "AI 합성 및 딥페이크 위험을 전문적으로 분석합니다.",
      "Professional analysis of AI synthesis and deepfake risk."
    ),
    description: tr(
      "사진, 영상, 음성, AI 창작물의 합성 흔적과 원본성, 저작권·사칭·불법 합성 위험을 검토합니다.",
      "Review synthesis traces, originality, copyright, impersonation, and illegal synthesis risk in photos, video, audio, and AI-created works."
    ),
    disclaimer: tr(
      "검사 결과는 법적 판단이 아니라 플랫폼 검토를 위한 위험도 분석입니다.",
      "Results are risk analysis for platform review—not legal determinations."
    ),
    btnStart: tr("진위검증 시작하기", "Start authenticity check"),
    btnSample: tr("예시 검사 리포트 보기", "View sample report"),
  },
  trust: {
    title: tr("UARION 신뢰 인프라의 3대 핵심 축", "Three pillars of UARION trust infrastructure"),
    emphasize: tr(
      "진위검증은 부가기능이 아니라 UARION 신뢰 시스템의 핵심 축입니다.",
      "Authenticity verification is a core pillar of UARION trust—not an add-on."
    ),
    cert: {
      title: tr("UARION 인증", "UARION Certification"),
      desc: tr(
        "AI 자산의 기본 정보·제출 자료·판매 적합성을 내부 기준으로 검토하는 민간 인증 체계",
        "Private certification reviewing AI asset metadata, submissions, and marketplace suitability"
      ),
    },
    authenticity: {
      title: tr("UARION 진위검증", "UARION Authenticity"),
      desc: tr(
        "합성·딥페이크·음성 클론·불법 합성 위험을 분석하는 탐지·위험도 리포트 체계",
        "Detection and risk reporting for synthesis, deepfakes, voice clones, and illegal composite risk"
      ),
    },
    registry: {
      title: tr("UARION 등록소", "UARION Registry"),
      desc: tr(
        "창작물·자동화에 고유 등록번호를 부여하고 제작 이력·버전을 추적하는 등록 체계",
        "Registry IDs and provenance tracking for creative works and automation"
      ),
    },
  },
  inspection: {
    title: tr("검사 항목", "Inspection areas"),
    deepfake: {
      title: tr("딥페이크 탐지", "Deepfake detection"),
      items: tr(
        "얼굴 합성 / 입모양·음성 싱크 / 프레임 왜곡 / 얼굴 경계 분석",
        "Face compositing / Lip–audio sync / Frame distortion / Face boundary analysis"
      ),
    },
    voice: {
      title: tr("AI 음성 탐지", "AI voice detection"),
      items: tr(
        "음성 클로닝 / 합성 흔적 / 원본 유사도 / 사칭 위험",
        "Voice cloning / Synthesis artifacts / Original similarity / Impersonation risk"
      ),
    },
    image: {
      title: tr("AI 이미지 탐지", "AI image detection"),
      items: tr(
        "AI 생성 여부 / 합성 흔적 / 메타데이터 / 원본성 검토",
        "AI-generated likelihood / Composite traces / Metadata / Originality review"
      ),
    },
    video: {
      title: tr("AI 영상 탐지", "AI video detection"),
      items: tr(
        "프레임 분석 / 얼굴 교체 / 배경 왜곡 / 립싱크 조작",
        "Frame analysis / Face swap / Background distortion / Lip-sync manipulation"
      ),
    },
    illegal: {
      title: tr("불법 합성 위험도", "Illegal synthesis risk"),
      items: tr(
        "사칭 / 명예훼손 / 금융사기 / 피싱 / 정치 조작 / 개인정보 침해",
        "Impersonation / Defamation / Financial fraud / Phishing / Political manipulation / Privacy violation"
      ),
    },
    report: {
      title: tr("검사 결과 리포트", "Inspection report"),
      items: tr(
        "Authenticity Score / Deepfake Risk / Voice Clone Risk / Copyright Risk / Illegal Synthesis Risk",
        "Authenticity Score / Deepfake Risk / Voice Clone Risk / Copyright Risk / Illegal Synthesis Risk"
      ),
    },
  },
  sampleReport: {
    title: tr("UARION Authenticity Report", "UARION Authenticity Report"),
    target: tr("검사 대상", "Subject"),
    targetValue: tr("영상 파일", "Video file"),
    rows: tr(
      "AI 합성 의심도:87%|딥페이크 위험도:HIGH|음성 클론 의심도:MEDIUM|불법 합성 위험도:HIGH",
      "AI synthesis suspicion:87%|Deepfake risk:HIGH|Voice clone suspicion:MEDIUM|Illegal synthesis risk:HIGH"
    ),
    actionsTitle: tr("권장 조치", "Recommended actions"),
    actions: tr(
      "거래 불가 / 관리자 검토 필요 / 원본 자료 제출 요청",
      "Block transaction / Admin review required / Request original materials"
    ),
    note: tr(
      "* 예시 리포트입니다. 실제 검사 결과가 아닙니다.",
      "* Sample report only. Not an actual inspection result."
    ),
  },
  badges: {
    title: tr("배지 시스템", "Badge system"),
    items: tr(
      "🟢 Authenticity Verified|🟡 AI Assisted|🟠 AI Composite|🔴 High Risk Deepfake|⛔ Prohibited",
      "🟢 Authenticity Verified|🟡 AI Assisted|🟠 AI Composite|🔴 High Risk Deepfake|⛔ Prohibited"
    ),
    note: tr(
      "이 결과는 탐지 도구의 위험도 분석이며 법적 판단이 아닙니다. (※ 예시 배지입니다.)",
      "These reflect detector risk analysis—not legal findings. (※ Sample badges only.)"
    ),
  },
  safety: {
    title: tr(
      "UARION 진위검증은 이렇게 준비되고 있습니다.",
      "How UARION Authenticity is being designed."
    ),
    importantNote: tr(
      "위 내용은 향후 설계 방향이며, 현재 실제 검사 시스템은 운영되지 않습니다.",
      "The following describes planned design direction; no live inspection system is operating today."
    ),
    uploadGate: {
      title: tr("업로드 게이트 (Upload Gate)", "Upload Gate"),
      desc: tr(
        "검사 전 불법물·고위험물을 사전 차단하도록 설계",
        "Designed to block illegal and high-risk content before inspection"
      ),
    },
    zeroRetention: {
      title: tr("저장하지 않음 (Zero-Retention)", "Zero-Retention"),
      desc: tr(
        "원본 파일은 검사 후 즉시 파기하도록 설계",
        "Original files designed to be deleted immediately after inspection"
      ),
    },
    isolated: {
      title: tr("격리 처리 (Isolated Processing)", "Isolated Processing"),
      desc: tr(
        "분석은 메인 시스템과 분리된 격리 환경에서 처리하도록 설계",
        "Analysis designed to run in isolation from the main platform"
      ),
    },
    noConclusions: {
      title: tr("단정 금지 (No Conclusions)", "No Conclusions"),
      desc: tr(
        "결과는 위험도·의심도로만 표시, 불법을 단정하지 않음",
        "Results show risk and suspicion levels only—never legal conclusions"
      ),
    },
    permission: {
      title: tr("권한·동의 (Permission/Consent)", "Permission / Consent"),
      desc: tr(
        "정당한 권한이 있는 파일만 검사 대상",
        "Only files the submitter is authorized to inspect"
      ),
    },
    reportBlock: {
      title: tr("신고·차단·기록 (Report/Block/Record)", "Report / Block / Record"),
      desc: tr(
        "고위험 결과는 신고·차단·관리자 검토로 연결",
        "High-risk outcomes linked to reporting, blocking, and admin review"
      ),
    },
  },
  userNotice: {
    title: tr("이용 안내", "User notice"),
    items: tr(
      "사진, 영상, 음성, AI 창작물의 합성 흔적과 위험도를 분석하는 도구입니다.|타인의 얼굴, 음성, 개인정보가 포함된 파일은 정당한 권한이 있을 때만 검사 대상이 됩니다.|검사 결과는 법적 판단이 아니라 내부 검토 및 거래 안정성을 위한 참고자료입니다.|성적 딥페이크, 사칭, 협박, 명예훼손, 피싱, 금융사기, 개인정보 침해 목적의 파일은 검사할 수 없습니다.",
      "A tool to analyze synthesis traces and risk in photos, video, audio, and AI-created works.|Files containing others’ faces, voices, or personal data may only be inspected with proper authorization.|Results are reference material for internal review and marketplace stability—not legal judgments.|Files intended for sexual deepfakes, impersonation, threats, defamation, phishing, fraud, or privacy violations cannot be inspected."
    ),
  },
  faq: {
    title: tr("자주 묻는 질문", "FAQ"),
    q1: tr("어떤 파일을 검사할 수 있나요?", "What files can be inspected?"),
    a1: tr(
      "향후 서비스에서는 사진·영상·음성·AI 창작물이 검사 대상이 될 예정입니다. 현재는 소개 페이지이며 실제 검사 기능은 제공되지 않습니다.",
      "Photos, video, audio, and AI works are planned for future inspection. This page is informational only—no live inspection is available."
    ),
    q2: tr("결과가 법적 증거인가요?", "Are results legal evidence?"),
    a2: tr(
      "아닙니다. 검사 결과는 법적 판단이 아닌 위험도·의심도 분석 참고자료이며, 플랫폼 내부 검토와 거래 안정성을 위한 용도입니다.",
      "No. Results are risk and suspicion analysis for platform review—not legal evidence or determinations."
    ),
    q3: tr("파일은 저장되나요?", "Are files stored?"),
    a3: tr(
      "향후 서비스는 원본 파일을 저장하지 않도록 설계될 예정입니다. 현재는 검사 기능이 없으며 파일 업로드·처리도 이루어지지 않습니다.",
      "Future service is designed for zero retention of originals. Today there is no inspection, upload, or file processing."
    ),
  },
  bottomDisclaimer: tr(
    "UARION 진위검증은 AI 합성 위험과 불법 악용 가능성을 분석하는 탐지 도구이며, 결과의 완전성·정확성·법적 적합성을 절대적으로 보장하지 않습니다. 본 결과는 법적 판단이 아닌 위험도 분석 결과입니다. 현재 본 페이지는 정적 소개 페이지이며 실제 검사 기능은 제공되지 않습니다.",
    "UARION Authenticity is a detection tool for AI synthesis and misuse risk; it does not absolutely guarantee completeness, accuracy, or legal suitability. Results are risk analysis—not legal judgments. This is a static information page; no live inspection is offered."
  ),
} as const;
