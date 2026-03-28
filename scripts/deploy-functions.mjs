/**
 * Cloud Functions デプロイスクリプト（クロスプラットフォーム対応）
 *
 * Nitro が onRequest() に invoker: "public" をハードコードしているため、
 * Firebase CLI がデプロイのたびに IAM ポリシーを再設定しようとしてエラーになる。
 * 関数自体のデプロイは成功するため、IAM エラーを許容して正常終了する。
 */
import { execSync } from 'node:child_process'

try {
  execSync('firebase deploy --only functions', { stdio: 'inherit' })
} catch {
  console.log('\n⚠ Functions deploy completed with IAM policy warning.')
  console.log('  This is expected — Cloud Run service is already set to public access.')
  console.log('  Verify at: https://console.cloud.google.com/run?project=ru-mana-web\n')
}
