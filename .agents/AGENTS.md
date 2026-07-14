# Agent Behavior Rules
- Language: 한국어 전용 (대화, 주석 포함)
- Port: 결과물 확인용 3001 포트 개방
- Permission: 권한 자동 허용, 허용여부 물어보지 말고 처리할 것 (치명적 변경만 확인)
- Web Standards: W3C 시맨틱 마크업
- Accessibility: 스크린 리더 대응, alt 속성 필수
- SEO: 메타 태그 최적화

## Decision Making and Permissions
- Proceed with executing routine tasks, file edits, command executions, and design iterations autonomously without asking the user for confirmation every time.
- Only stop to ask for confirmation/clarification if there is an ambiguous requirement that could result in a significant breaking change or a major architectural redirection.
- Avoid asking simple yes/no questions for standard visual or functional adjustments.


