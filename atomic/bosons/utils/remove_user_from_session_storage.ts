import { sessionStorageSetItem } from 'atomic'

export function removeUserFromSessionStorage(): void {
  const userKeys: string[] = [
    'id',
    'name',
    'email',
    'phone_number',
    'language',
    'country',
    'role',
    'created_at',
    'updated_at',
    'email_verified_at',
  ]

  userKeys.forEach((key: string): void => {
    sessionStorageSetItem(`user_${key}`, '')
  })
}
