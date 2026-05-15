import type {
  ApiContext,
  ApiHandlerResult,
} from '../../../../nuxt/server/api/_types'

export async function handleNucauthApi(
  _ctx: ApiContext
): Promise<ApiHandlerResult> {
  // TODO: map Laravel routes/controllers to Supabase-first handlers.
  // Sources:
  // - modules/nuc_auth/routes/api.php
  // - modules/nuc_auth/app/Http/Controllers/DemoController.php
  return { handled: false }
}
