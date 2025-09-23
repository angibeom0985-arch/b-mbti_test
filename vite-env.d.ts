/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 환경변수가 필요할 때 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}