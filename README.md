# Travex: Your Travel Canvas

# TASK: Build the Complete Frontend for "Travex" (Next-Gen Travel & Memories Web App)

You are an expert Principal Frontend Engineer and UI/UX Designer. Build a modern, highly interactive, and visually stunning frontend web application called "Travex".

---

## 1. TECH STACK & ARCHITECTURE GUIDELINES
- Framework: React / Next.js (App Router) + Tailwind CSS + Lucide Icons + Framer Motion.
- State Management: React Context or Zustand for auth session, active navigation views, modal overlays, and mascot states.
- Backend Architecture:
  - The AI assistant "Ghoomi" is ALREADY built separately as an external Agentic AI workflow using n8n + OpenAI + Supabase.
  - DO NOT create a new AI agent, AI chatbot backend, LLM, AI reasoning system, or autonomous agent inside the frontend.
  - DO NOT call OpenAI, Gemini, Claude, or any other LLM directly from the frontend.
  - DO NOT recreate Ghoomi's reasoning, memory retrieval, preference analysis, trip planning, transport logic, or price-watch logic in React/Next.js.
  - The frontend should ONLY provide the Ghoomi visual character, chat interface, interaction states, and a clean API/webhook integration layer for the EXISTING n8n Ghoomi agent.
  - Ghoomi will later be connected through an n8n webhook/API.
  - Supabase is the existing persistent backend/database/authentication/storage layer.
  - The frontend should be designed so that it can connect to the EXISTING Travex Supabase project without creating a duplicate backend.

- Provide cleanly stubbed API service hooks:
  - `services/ghoomiService.ts`
  - `services/supabaseAuth.ts`
  - `services/supabaseService.ts`

- `ghoomiService.ts` should ONLY handle communication with the existing n8n Ghoomi endpoint.

Example request structure:

{
  "user_id": "current-user-id",
  "group_id": "current-group-id",
  "message": "Plan our Goa trip",
  "context": {
    "page": "group-chat"
  }
}

The frontend should send this request to:

`NEXT_PUBLIC_GHOOMI_WEBHOOK_URL`

and display the response returned by the existing n8n Ghoomi agent.

The frontend must NOT contain the AI reasoning itself.

- Use environment variables for:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GHOOMI_WEBHOOK_URL`

- NEVER expose Supabase service-role keys, n8n authentication secrets, OpenAI keys, or any private API credentials in frontend code.

- If the n8n webhook requires a secret, use a secure backend/API route or Supabase Edge Function as an intermediary rather than exposing the secret in browser code.

---

## 2. AESTHETICS & DESIGN SYSTEM
- Theme: Adventurous, warm wanderlust aesthetic (warm cream/sand canvas, terracotta/sunset-orange primary accents, deep slate typography, glassmorphism overlays, soft borders, and fluid micro-animations).
- Typography: Clean modern sans-serif with bold, wide-spaced headers for the hero sections.
- Responsiveness: Desktop-optimized with fluid mobile and tablet adaptation.
- The application should feel like a premium digital travel journal combined with a collaborative travel workspace.
- Avoid making the UI look like a generic SaaS dashboard or generic AI chatbot.

---

## 3. USER JOURNEY & SCREEN WORKFLOWS

### PHASE 1: AUTHENTICATION (GATEWAY SCREEN)
Travex must first open to an interactive Auth portal before granting access to the main dashboard.

- Layout: Split-screen or centered card with warm travel visuals and a bold "TRAVEX" badge with the tagline:
  "Your journeys, shared memories & smart co-pilot".

- Toggle Modes:
  1. Login Tab:
     - Email / Gmail field.
     - Password field with show/hide toggle.
     - "Remember me" + "Forgot Password?" link.
     - Primary button: "Log In to Travex".
     - Social login option: "Continue with Google".

  2. Sign-Up Tab ("Create New User"):
     - Full Name.
     - Gmail / Email address.
     - Create Password + Confirm Password with real-time strength indicators.
     - Primary button: "Create Account".

IMPORTANT AUTHENTICATION CHANGE:

Do NOT create a custom system that asks users to enter their Gmail password directly into Travex.

For the real implementation, use Supabase Auth with Google OAuth.

The primary real authentication action should be:

"Continue with Google"

After successful Google authentication:

1. Retrieve the authenticated Supabase user.
2. Check whether a Travex profile exists.
3. Create/retrieve the profile.
4. Ask for a display name if required.
5. Redirect to the Home page.

The Login/Sign-Up tabs may remain visually present for the initial prototype if desired, but do not implement a fake Gmail password system.

For the initial frontend prototype, authentication may be mocked through client state.

Structure the authentication code so it can later be connected directly to the existing Supabase Auth system without rebuilding the UI.

- Transition: On successful login/signup, trigger a smooth fade/scale transition into the main application.

Include:
- Loading state
- Authentication error state
- Session persistence
- Logout

---

### PHASE 2: GLOBAL NAVIGATION (HAMBURGER DRAWER)
- Position: Top-left collapsible 3-bar hamburger icon.
- Drawer Contents:
  - Travex brand header with current logged-in user profile pill.
  - 3 Core Navigation Links:
    1. "Home": Returns to the main dashboard.
    2. "Group Invites": Opens the trip groups hub.
    3. "My Space": Opens the creative AI studio featuring Ghoomi.
  - "Memories": Opens the travel memories section.
  - Logout action at the bottom of the drawer.

---

### PHASE 3: SCREEN SPECIFICATIONS

#### Screen A: Home Dashboard
- Hero Section:
  - Large, stylized, elegant typography: "TRAVEX".
  - Subtle subtitle: "Collect moments, preserve memories."
  - The composition should keep the main Travex branding and memories toward the left/center.
  - Ghoomi should be visually positioned toward the right side of the screen.

- Memories Carousel / Deck:
  - Header: "Memories".
  - Horizontal scrollable strip of trip memory cards (e.g., "Goa", "Varkala", "Delhi").
  - Each card features: Destination name, high-resolution cover photo thumbnail, trip date tag, and total photos badge.
  - Includes a dedicated "+ Add Trip" memory card.
  - Clicking any memory card opens that destination's "Group Highlights" view.
  - These can initially use mock data but must be structured so the data can later come from Supabase.

- Interactive Sleeping Mascot (Ghoomi):
  - Location: Docked towards the right edge of the screen.
  - Visual Design: An adorable, round-spectacled explorer fox wearing a travel backpack, based on the provided Ghoomi character reference.
  - State 1 (Idle/Sleeping): Curled up sleeping with floating animated "Zzz" bubbles and a pulsing badge: "Wake Ghoomi 💤".
  - State 2 (Wake Up): Clicking Ghoomi triggers a bouncy wake-up stretch animation (eyes opening, tail swishing, alert stance).
  - State 3 (Active Dialogue): Opens a floating companion dialog: "Hey explorer! Where are we going today?"

IMPORTANT:

GhoomiMascot is ONLY a frontend visual component.

It must NOT contain an AI model, LLM, reasoning engine, trip planner, or backend intelligence.

Ghoomi's actual intelligence already exists externally in the n8n workflow.

The mascot should only handle:
- sleeping animation
- wake-up animation
- expressions
- UI interaction
- opening/closing the Ghoomi chat interface

- Include frontend-only reaction states:
  - Happy
  - Curious
  - Thinking
  - Excited
  - Neutral

These states are visual states only and must not represent a separate AI system.

---

#### Screen B: Group Invites & Collaborative Trip Chat
- Trip List View:
  - Active trips list (e.g., "Goa 2026", "Varkala Backpacking") + a "+ New Chat / Create Trip" button.
  - Modal: "Create New Trip" where users input destination name (e.g., "Goa"), select trip dates, and generate an invite link/code to add friends.

- Collaborative Group Chat Room:
  - Header with Trip Name, active member avatars stack, and an "+ Invite Friends" shareable link button.
  - Chat Message Thread: Multi-user message bubbles with sender avatars and timestamps.
  - Ambient Ghoomi Presence: A persistent floating pill: "🦊 Ghoomi is active in this chat".
  - Ghoomi responses appear as styled assistant chat bubbles answering group travel queries.
  - Input Footer: Attachment button (+), text input field ("Plan your trip or ask Ghoomi..."), microphone icon, and send button.

IMPORTANT GROUP CHAT ARCHITECTURE:

The frontend must NOT reason about the group itself.

For example, if Ryan wants adventure and Zayan wants beaches, the frontend must NOT calculate conflicts or generate recommendations.

Instead:

Frontend
↓
Existing n8n Ghoomi Agent
↓
Ghoomi retrieves the correct group information from Supabase
↓
Ghoomi reasons and uses its available tools
↓
Ghoomi returns the response
↓
Frontend displays the response

The frontend should pass:

- `user_id`
- `group_id`
- `message`
- relevant page/context

to the existing Ghoomi webhook.

The frontend should not directly call Ghoomi's internal Supabase tools.

---

#### Screen C: "My Space" (Personal Creative AI Studio)
- Canvas Layout:
  - Dedicated creative room where Ghoomi is prominently featured in the center/upper section.
  - Dynamic reaction indicators reflecting Ghoomi's readiness.

- Action Prompt Chips:
  - "✨ Pick the best photo from our Goa trip"
  - "📐 Format for Pinterest Pin (2:3 / 9:16 vertical)"
  - "📸 Generate Instagram Story collage"
  - "🎞 Create a travel memory collage"
  - "What were our best moments?"

IMPORTANT:

My Space uses the SAME existing Ghoomi n8n agent.

Do NOT create a separate AI system for My Space.

These prompts should be sent through `ghoomiService.ts` to the existing n8n Ghoomi agent.

- Studio Input Bar:
  - Rounded input box with media upload (+) icon and voice icon.

- Creative Showcase Area:
  - Grid demonstrating mock generated results: Pinterest vertical preview cards, aesthetic polaroid frames, and story-ready collages with ready-to-download buttons.

IMPORTANT:

The showcase can use mock/generated placeholder results for the frontend prototype.

Do not claim that actual AI image generation exists unless a real image-generation backend is connected later.

---

#### Screen D: Memories & Group Highlights (e.g., "Goa")
- Header: Destination title in bold ("GOA") with back button and trip metadata.
- Group Highlight Circle:
  - Large circular highlight avatar with a pulsing gradient story ring labeled "Group Highlights".
  - Clicking the ring triggers a full-screen, tap-through Instagram Story viewer:
    - 5 to 10 randomly picked highlight photos from the trip.
    - Top segmented progress bars auto-advancing with timer.
    - Tap left to go back, tap right to advance, close button (X).

- Action Controls:
  - "Add" (+) Button: Opens a photo dropzone modal allowing any group member to upload trip photos to the shared pool.
  - "View" (Eye icon) Button: Toggles an aesthetic masonry photo gallery displaying all uploaded photos from the trip.

IMPORTANT MEMORY ARCHITECTURE:

Photos should eventually be stored using the existing Supabase backend/storage.

Do not create a separate storage backend.

The frontend should be prepared to use:

Supabase Storage
+
memory photo metadata

when the backend is connected.

---

## 4. CODE QUALITY & MODULAR COMPONENT BREAKDOWN

Deliver the application in modular, clean components:

- `components/auth/AuthModal.tsx`
- `components/layout/SidebarDrawer.tsx`
- `components/mascot/GhoomiMascot.tsx`
- `components/mascot/GhoomiChat.tsx`
- `components/home/MemoriesCarousel.tsx`
- `components/home/MemoryCard.tsx`
- `components/chat/GroupTripChat.tsx`
- `components/chat/ChatMessage.tsx`
- `components/myspace/MySpaceStudio.tsx`
- `components/memories/StoryViewerModal.tsx`
- `components/memories/HighlightsView.tsx`
- `components/memories/PhotoUploadModal.tsx`
- `components/memories/PhotoGallery.tsx`
- `services/ghoomiService.ts`
- `services/supabaseAuth.ts`
- `services/supabaseService.ts`
- `lib/mock-data.ts`
- `lib/types.ts`

### Ghoomi Service Requirements

`services/ghoomiService.ts` must be a simple integration layer.

It should provide functions such as:

`sendMessageToGhoomi()`

The function should send:

{
  user_id,
  group_id,
  message,
  context
}

to:

`NEXT_PUBLIC_GHOOMI_WEBHOOK_URL`

and return the response.

It must NOT contain:
- LLM calls
- AI reasoning
- prompt engineering for a new agent
- preference analysis
- itinerary generation logic
- transport logic
- price-watch logic

All of those responsibilities belong to the existing n8n Ghoomi agent.

### Supabase Service Requirements

`services/supabaseService.ts` should eventually provide frontend access to the existing Travex Supabase backend.

The frontend will eventually interact with existing data such as:

- profiles
- groups
- group_members
- messages
- member_preferences
- trips
- itineraries
- transport_options
- price_watches
- memories
- memory_photos

Do not create duplicate tables or replace the existing Travex backend architecture.

---

## 5. DATA FLOW

The final architecture should be:

                    TRAVEX FRONTEND
                           |
             +-------------+-------------+
             |                           |
             v                           v
         SUPABASE                    N8N WEBHOOK
       Auth / Data                       |
             |                           v
             |                       GHOOMI
             |                           |
             |                    Existing Supabase
             |                       AI Tools
             |                           |
             +-------------<-------------+
                           |
                       RESPONSE
                           |
                           v
                    TRAVEX FRONTEND

The frontend is responsible for the UI.

Supabase is responsible for persistent application data.

n8n/Ghoomi is responsible for AI reasoning and agentic actions.

---

## 6. IMPORTANT EXISTING BACKEND CAPABILITIES

The existing Travex n8n/Supabase system already supports real functionality including:

- retrieving group preferences
- retrieving group conversation
- detecting group conflicts
- updating explicit member preferences
- creating persistent price-watch records
- reading active price watches
- transport comparison using curated demo data

The frontend must be designed to consume these capabilities through Ghoomi rather than rebuilding them.

IMPORTANT:

Current transport information is curated demo data.

It is NOT live pricing, schedules, availability, or booking.

Do not display live booking functionality unless a real provider API is added later.

Similarly, do not claim that background price monitoring is implemented unless a real scheduler/notification system is connected.

---

## 7. MOCK MODE & LIVE MODE

For the initial frontend build, use mock data so the complete UI can be previewed without requiring the backend to be connected.

Create a centralized mock data layer:

`lib/mock-data.ts`

Do not scatter mock data throughout components.

The architecture must make it easy to switch later from:

MOCK MODE

to:

LIVE MODE

LIVE MODE will use:

- Supabase for application data
- Supabase Auth for authentication
- n8n webhook for Ghoomi

Do not rebuild the frontend when switching to live mode.

---

## 8. RESPONSIVENESS

Desktop:
- Large cinematic layout.
- Ghoomi occupies the right side.
- Travex and Memories occupy the left/center.

Mobile:
- Ghoomi becomes a floating assistant.
- Navigation becomes a drawer or bottom navigation.
- Memory cards become horizontally scrollable.
- Group chat becomes full-screen.
- Story viewer becomes immersive full-screen.

---

## 9. ANIMATION SYSTEM

Use Framer Motion.

Important animations:

- Page transitions
- Sidebar opening
- Memory card hover
- Image zoom
- Ghoomi breathing
- Ghoomi sleeping
- Ghoomi waking
- Ghoomi reaction changes
- Chat bubble appearance
- Ghoomi thinking indicator while waiting for n8n
- Story transitions
- Modal transitions
- Upload progress

Animations must feel premium and smooth.

Do not over-animate.

---

## 10. SECURITY

NEVER expose:

- Supabase service-role key
- n8n authentication secrets
- OpenAI API keys
- private API credentials

The browser may use:

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

If the n8n webhook requires authentication, use a secure server-side API route or Supabase Edge Function as an intermediary.

---

## 11. FINAL PRODUCT FEEL

Travex should feel like:

A living travel journal + collaborative group travel workspace + autonomous AI travel companion.

The user should feel that:

- Ghoomi understands the group.
- Ghoomi remembers preferences.
- Ghoomi understands group conversations.
- Ghoomi helps plan trips.
- Ghoomi can interact with group data.
- Ghoomi helps preserve memories.

BUT THE FRONTEND MUST NOT IMPLEMENT THE INTELLIGENCE.

The existing n8n Ghoomi agent is the intelligence layer.

The frontend is the visual and interaction layer.

---

## 12. CRITICAL "DO NOT BUILD" LIST

DO NOT:

- Create a new AI agent.
- Create a new AI chatbot backend.
- Create an LLM inside the frontend.
- Call OpenAI directly.
- Call Gemini directly.
- Call Claude directly.
- Implement AI reasoning in React.
- Implement group conflict reasoning in React.
- Implement preference analysis in React.
- Implement autonomous trip planning in React.
- Create a second Ghoomi.
- Create a separate AI backend.
- Create a duplicate Supabase backend.
- Create fake live transport APIs.
- Claim demo transport data is live.
- Expose private API keys.

Instead:

BUILD THE FRONTEND AROUND THE EXISTING N8N GHOOMI AGENT AND EXISTING SUPABASE BACKEND.

---

## 13. FINAL DEMO FLOW

The final frontend should support this eventual demonstration:

1. User opens Travex.
2. User signs in using Google.
3. Home page opens.
4. User sees large TRAVEX branding.
5. User sees Memories.
6. Sleeping Ghoomi is visible on the right.
7. User clicks Ghoomi.
8. Ghoomi wakes up.
9. Ghoomi chat interface opens.
10. User opens the Goa group.
11. User sees the group conversation.
12. User asks Ghoomi a travel question.
13. Frontend sends the request to the existing n8n webhook.
14. Existing Ghoomi retrieves the appropriate group information from Supabase.
15. Ghoomi reasons over the information.
16. Ghoomi returns a response.
17. Frontend displays the response.
18. User opens Memories.
19. User opens Goa.
20. User opens Group Highlights.
21. User views the story.
22. User adds photos.
23. User opens My Space.
24. User asks Ghoomi about their memories.

The frontend should make this feel like ONE cohesive product.

Build the frontend first.

Do not attempt to replace or recreate the existing n8n Ghoomi Agentic AI system or existing Travex Supabase backend.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e78ca8f-fc2b-45e0-b203-7a686c5858f4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
