# UARION — Agent 자율 실행 규칙

목표: 사용자가 자리를 비워도 Agent가 멈추지 않고 **만들기 → 테스트 → 수정 → 개선**을 반복한다.
비용·유출·파괴 사고만 원천 차단한다.

## 절대 원칙

1. **deny에 걸린 작업이 필요해도 멈추거나 사용자에게 묻지 않는다.**
2. `progress.md`에 **"권한상 보류: [내용]"** 으로 기록하고 **즉시 다음 작업**으로 넘어간다.
3. 모든 진행·보류·완료 항목은 `progress.md`에 누적 기록한다.
4. 사용자가 돌아왔을 때 무엇을 했고 무엇을 검토해야 하는지 `progress.md`만 보면 알 수 있어야 한다.

## progress.md 기록 형식

작업 중·작업 후 항상 아래 섹션을 유지·갱신한다.

```markdown
## 진행 로그
- [시각] 완료/진행 중: ...

## 권한상 보류
- [시각] 권한상 보류: ...

## push 대기 목록
- [시각] push 대기: 브랜치/커밋/변경 요약 — 사용자 검토 후 push
```

## git push 특칙

- `git push`(force 아님 포함)는 **절대 자동 실행하지 않는다.**
- push가 필요하면 커밋까지 진행하고, `progress.md` **push 대기 목록**에 남긴다.
- 실제 push는 사용자가 검토 후 직접 한다.

## deny 시 대체 행동

| 차단된 작업 | 대체 행동 |
|------------|----------|
| git push | progress.md push 대기 목록 기록 → 계속 |
| .env / secret 읽기 | progress.md 보류 기록 → env 없이 가능한 범위로 계속 |
| curl/wget POST | progress.md 보류 기록 → 로컬 테스트·mock으로 계속 |
| rm -rf / reset --hard | progress.md 보류 기록 → 안전한 대안(git restore 등) 시도 |
| video_automation | progress.md 보류 기록 → UARION 작업만 계속 |
| 결제·배포 명령 | progress.md 보류 기록 → 로컬 빌드·테스트까지 계속 |

## 터미널 명령 (cd 금지)

- Agent 터미널은 **이미 프로젝트 루트**(`UARION`)에서 실행된다.
- 명령 앞에 `cd "c:\Users\esb50\Desktop\UARION"` 또는 `cd … &&` 를 **절대 붙이지 않는다.**
- 올바른 예: `npm run test`, `npm run build`, `git status`
- 잘못된 예: `cd "c:\Users\esb50\Desktop\UARION" && npm run test`
- 이유: `cd`가 승인 요청을 유발해 작업이 멈추는 것을 방지한다.

## 작업 루프 (자리 비움 모드)

1. 목표 분해 → 구현
2. `npm run build` / `npm run lint` / 테스트 실행
3. 실패 시 수정 후 재시도 (deny에 안 걸리는 범위)
4. `progress.md` 갱신
5. 다음 미완 항목으로 이동 — **사용자 응답 대기 없이** 반복
