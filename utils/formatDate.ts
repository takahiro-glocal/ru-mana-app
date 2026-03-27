/**
 * Firestore Timestamp / Date / string を指定ロケールでフォーマットする
 */
export const formatFirestoreDate = (
  date: FirebaseTimestamp | Date | string | null,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return ''
  const d = (typeof date === 'object' && 'seconds' in (date as any))
    ? new Date((date as FirebaseTimestamp).seconds * 1000)
    : new Date(date as string | Date)
  return d.toLocaleString(locale, options || { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/**
 * 相対時間表示付きのフォーマット（「たった今」「X分前」「X時間前」etc.）
 */
export const formatRelativeDate = (
  date: FirebaseTimestamp | Date | string | null,
  locale: string,
  t: (key: string, params?: Record<string, any>) => string
): string => {
  if (!date) return ''
  const d = (typeof date === 'object' && 'seconds' in (date as any))
    ? new Date((date as FirebaseTimestamp).seconds * 1000)
    : new Date(date as string | Date)

  const now = new Date()
  const diff = now.getTime() - d.getTime()

  if (diff < 60000) return t('thread.just_now')
  if (diff < 3600000) return t('thread.minutes_ago', { n: Math.floor(diff / 60000) })
  if (diff < 86400000) return t('thread.hours_ago', { n: Math.floor(diff / 3600000) })

  return d.toLocaleDateString(locale, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
