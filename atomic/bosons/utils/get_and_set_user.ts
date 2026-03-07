// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { NucUserRequestsInterface } from 'nucleify'
import { setUserToSessionStorage, userRequests } from 'nucleify'

export async function getAndSetUser(): Promise<void> {
  const { results, getUser }: NucUserRequestsInterface = userRequests()

  await getUser()

  setUserToSessionStorage(results.value)
}
