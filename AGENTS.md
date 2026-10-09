<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Travex architecture
- Use TanStack Start file routes with a shared React context for preview session and local demo state; this preserves the supported framework and keeps each screen independently addressable.
- Keep all sample content in `src/lib/mock-data.ts` and all external communication in `src/services`; this lets the existing data and n8n services replace the preview without rebuilding presentation.
- Mock sessions may persist locally, but trip and photo mutations stay in preview memory; production persistence belongs to the existing backend, not a new one.
- Compose chat surfaces with installed AI Elements primitives; this keeps message rendering and input behavior consistent without adding an intelligence layer.
- Use browser-safe VITE-prefixed public configuration on this Vite project; never expose private credentials, and leave authenticated webhooks disconnected until a secure intermediary exists.
- Block production group creation, invite issuance/acceptance and agent requests from preview identities until existing authentication and membership checks are available; local sample state must never impersonate shared access.
- Keep explicit agent invocation rules in a tested browser-safe helper; ordinary group messages must not trigger the external workflow.
