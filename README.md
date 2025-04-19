# IB Class Tracker

A comprehensive task management application designed specifically for International Baccalaureate (IB) students to organize their coursework, track assignments, and access study guides across different subjects.

![IB Class Tracker Screenshot](https://placeholder.svg?height=400&width=800)

## Features

- **Subject-based Organization**: Tasks are organized by IB subjects, units, and subtopics
- **Progress Tracking**: Visual progress indicators for each subject and subtopic
- **Due Date Management**: Set and track task deadlines with calendar integration
- **Reminder System**: Get notifications for upcoming tasks
- **Study Guides**: Access comprehensive study guides for each subtopic
- **Multi-language Support**: Available in English and French
- **Dark/Light Mode**: Choose your preferred theme
- **User Authentication**: Save your data across devices with account creation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/ib-class-tracker.git
   cd ib-class-tracker
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Start the development server
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Tasks

1. Navigate to the subject tab
2. Select the unit and subtopic
3. Click "Add Task"
4. Enter task details and optional due date
5. Set reminder if needed

### Tracking Progress

- The home tab shows all upcoming tasks
- Each subject tab displays progress percentages
- Complete tasks by checking them off

### Using Study Guides

1. Navigate to a specific subtopic
2. Click the book icon to open the study guide
3. Study guides contain key concepts, formulas, and tips

### Changing Language

- Click the language toggle in the top right corner
- Select your preferred language

## Project Structure

\`\`\`
ib-class-tracker/
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # UI components
├── contexts/             # React contexts
├── data/                 # Subject data
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the CC BY-NC-ND 4.0 License - see the LICENSE file for details.

## Acknowledgments

- Created by Zayd El Motassadeq
- Designed for IB students worldwide
- Inspired by the need for better organization tools in the IB program
