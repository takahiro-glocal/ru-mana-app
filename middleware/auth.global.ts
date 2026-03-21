export default defineNuxtRouteMiddleware(async (to, _from) => {
  // 認証が必要なパスパターン（投稿詳細ページなど、書込操作が発生するページ）
  // 閲覧のみのページ（/, /shiru, /miru, /kiku, /iku, /trouble 等）は認証不要
  // スレッド詳細ページは閲覧可能だが、投稿操作はコンポーネント側で認証チェック
  // 現時点では全ページ閲覧可能とし、書込操作はコンポーネント側で認証を要求する設計
  // この設計はSPA（ssr: false）に適合する
});
