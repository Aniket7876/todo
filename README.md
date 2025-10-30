# Task Kanban Board

A beautiful task management application built with Next.js 14, TypeScript, and Tailwind CSS, featuring a Kanban board interface with stunning glass morphism effects.

## Features

- ✨ **Glass Morphism UI** - Modern, beautiful glass effects throughout the interface
- 📋 **Kanban Board** - Organize tasks in To Do, In Progress, and Done columns
- ✏️ **Task Management** - Create, edit, and delete tasks with ease
- 🔍 **Task Details** - View comprehensive information about each task
- 🎨 **Priority Levels** - Categorize tasks with Low, Medium, and High priorities
- 📅 **Due Dates** - Set optional due dates for tasks
- 🗄️ **Persistent Storage** - MongoDB-backed API keeps tasks in sync across sessions
- 🧲 **Drag & Drop** - Move tasks between stages with smooth drag interactions
- 🎯 **Responsive Design** - Works beautifully on all screen sizes

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Configure environment variables:

	- Copy `.env.example` to `.env.local` and update `MONGODB_URI` with your MongoDB connection string.

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom glass morphism utilities
- **Icons:** Lucide React
- **State Management:** React Hooks

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page with Kanban board
│   └── globals.css      # Global styles and glass utilities
├── components/
│   ├── KanbanColumn.tsx      # Column component
│   ├── TaskCard.tsx          # Individual task card
│   ├── TaskModal.tsx         # Modal for creating/editing tasks
│   └── TaskDetailsModal.tsx  # Modal for viewing task details
├── types/
│   └── task.ts          # TypeScript interfaces and types
└── public/              # Static assets
```

## Custom Glass Effects

The app includes custom Tailwind CSS utilities for glass morphism:

- `.glass` - Basic glass effect with blur
- `.glass-card` - Enhanced glass effect for cards
- `.glass-hover` - Smooth hover transitions for interactive elements

## Usage

1. **Create a Task:** Click the + button in any column
2. **Edit a Task:** Click the edit icon on a task card
3. **View Details:** Click anywhere on a task card
4. **Delete a Task:** Click the trash icon on a task card
5. **Organize Tasks:** Tasks are automatically filtered into their respective columns

## License

MIT

## Author

Built with ❤️ using Next.js and Tailwind CSS
