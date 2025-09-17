This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


# Canaan: The Historical Insights Dashboard

Canaan is a sophisticated web application designed to manage, visualize, and interact with complex historical data. It serves as a comprehensive dashboard for researchers, students, and enthusiasts to explore historical events, figures, and locations through a modern, interactive interface. The platform integrates an AI-powered research assistant, gamification elements, and rich data visualization tools to create an engaging and powerful learning experience.

## ✨ Key Features

*   **🗂️ In-Depth Data Management:** A full-featured dashboard to create, read, update, and delete historical data, including Actors, Events, Locations, Sources, and their intricate relationships.
*   **🤖 AI-Powered Research Agent:** An intelligent assistant powered by large language models (like Google Gemini) to help users with their research, answer questions, and analyze historical documents.
*   **🗺️ Interactive Historical Maps:** Visualize historical events and data on an interactive map, leveraging technologies like Leaflet and MapLibre GL. Includes multiplayer map-based games.
*   **🎮 Gamification Engine:** Engages users with a complete gamification system, including achievements, rewards, challenges, leaderboards, and educational games like quizzes and bingo.
*   **🔐 Secure Authentication:** Robust user authentication and management handled by Firebase, ensuring secure access to the dashboard and user-specific data.
*   **☁️ Media & Storage Management:** Seamlessly upload and manage media files (images, documents) with Supabase Storage and UploadThing.
*   **📊 Rich Data Visualization:** Features network graphs to visualize relationships between historical entities and charts for user statistics.
*   **🎨 Modern, Themed UI:** Built with Next.js, Tailwind CSS, and Shadcn/UI for a beautiful, responsive, and themeable (light/dark mode) user interface.

## 🏗️ Project Structure

The project is built using the Next.js App Router, providing a clear and scalable structure. Key directories include:

```
canaan/
├── app/
│   ├── (auth)/             # Authentication routes (login, register)
│   ├── (marketing)/        # Static marketing pages (about, faq)
│   ├── agent/              # The AI research assistant interface
│   ├── dashboard/          # Core data management dashboard
│   ├── games/              # Gamification modules (bingo, map, quiz)
│   ├── library/            # Public-facing data library
│   └── api/                # Backend API routes
├── ai/                     # Logic for the AI agent (prompts, models)
├── components/             # Reusable React components (UI, layout, features)
├── config/                 # Server and client configuration
├── lib/                    # Shared utilities, helper functions, and clients
│   ├── prisma.ts           # Prisma client instance
│   └── supabase/           # Supabase helper functions
├── prisma/                 # Prisma schema, migrations, and seed scripts
├── providers/              # React Context providers for state management
└── public/                 # Static assets (images, icons)
```

## 🛠️ Tech Stack & Dependencies

This project utilizes a modern and powerful tech stack:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth) & [next-firebase-auth-edge](https://github.com/awinogrodzki/next-firebase-auth-edge)
*   **Storage:** [Supabase Storage](https://supabase.com/docs/guides/storage) & [UploadThing](https://uploadthing.com/)
*   **AI/LLM:** [LangChain.js](https://js.langchain.com/), [Google Gemini](https://ai.google.dev/), [Jina AI](https://jina.ai/) (for embeddings)
*   **State Management:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
*   **Mapping:** [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/), [MapLibre GL](https://maplibre.org/)
*   **UI Components:** Radix UI, Recharts, Tiptap (for rich text editing)

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

Ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [pnpm](https://pnpm.io/installation) (as the project uses a `pnpm-lock.yaml`)

### 2. Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/canaan.git
    cd canaan
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### 3. Environment Configuration

1.  Create a `.env.local` file in the root of the project. You can use the `.env.example` template below as a guide.

2.  Fill in the `.env.local` file with your credentials and keys from Supabase, Firebase, Google, and Jina AI.

#### `.env.example`

```env
# ------------------------------
# DATABASE (Prisma + Supabase)
# ------------------------------
# Found in Supabase -> Project Settings -> Database -> Connection string (use the one with pgbouncer for pooling)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0"
# Found in Supabase -> Project Settings -> Database -> Connection string (use the non-pooling one for migrations)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# ------------------------------
# SUPABASE (Client-side)
# ------------------------------
# Found in Supabase -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# ------------------------------
# FIREBASE AUTH (next-firebase-auth-edge)
# ------------------------------
# Create a service account in Firebase -> Project Settings -> Service Accounts -> Generate new private key
# These values are found inside the generated JSON file
# The full JSON content should be pasted as a single-line string.
FIREBASE_ADMIN_SDK_CONFIG='{"type": "service_account", "project_id": "...", ...}'

# Found in Firebase -> Project Settings -> General
NEXT_PUBLIC_FIREBASE_API_KEY="your-public-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# ------------------------------
# AUTH COOKIE SECRETS
# ------------------------------
# Generate two random strings (32+ characters) for cookie encryption
COOKIE_SECRET_CURRENT="a_very_strong_random_secret_string_1"
COOKIE_SECRET_PREVIOUS="a_very_strong_random_secret_string_2"
# Set to true in production with HTTPS
USE_SECURE_COOKIES=false

# ------------------------------
# AI SERVICES
# ------------------------------
# Found in Google AI Studio or Google Cloud Console
GEMINI_API_KEY="your_google_gemini_api_key"
# Found in your Jina AI dashboard
JINA_API_KEY="your_jina_api_key"

```

### 4. Database Setup

Run the Prisma migrations to set up your database schema. Prisma will use the `DIRECT_URL` from your `.env.local` file for this.
```bash
pnpm exec prisma migrate dev
```
This command will sync your database schema with the `prisma/schema.prisma` file.

### 5. Running the Application

Start the development server:
```bash
pnpm dev
```
The application should now be running on [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

This project comes with several useful scripts defined in `package.json`:

| Script          | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `pnpm dev`      | Starts the development server.                                   |
| `pnpm build`    | Builds the application for production.                           |
| `pnpm start`    | Starts the production server.                                    |
| `pnpm lint`     | Lints the code using Next.js's built-in ESLint.                  |
| `pnpm db:push`  | (Not Recommended for Prod) Pushes schema to the DB without migration. |
| `pnpm db:migrate` | Creates and applies a new database migration.                    |
| `pnpm db:generate`| Generates the Prisma Client based on your schema.                |
| `pnpm db:studio`  | Opens the Prisma Studio GUI to view/edit data.                   |
| `pnpm db:seed`  | Runs the database seed script (if configured).                   |