# Interactive Quiz Application

## Overview
This is a modern, interactive quiz application built with React and Node.js. The application provides an engaging platform for users to test their knowledge across various topics through a series of well-structured quizzes.

## Why This App?
I chose to create this quiz application for several reasons:

1. **Educational Value**: Quizzes are an effective way to test knowledge and reinforce learning. This app makes learning interactive and fun.

2. **Technical Challenge**: Building a quiz app involves handling various aspects of web development:
   - User state management
   - Real-time feedback
   - Score tracking
   - Responsive design
   - Data persistence

3. **Scalability**: The application is designed to be easily expandable, allowing for:
   - Adding new quiz categories
   - Implementing different question types
   - Supporting multiple users
   - Adding social features

## Features

### User Experience
- Clean, intuitive interface
- Responsive design for all devices
- Real-time feedback on answers
- Progress tracking
- Score history

### Quiz Features
- Multiple question types (Multiple Choice, True/False)
- Timer functionality
- Random question selection
- Difficulty levels
- Category-based quizzes

### Technical Features
- Modern React frontend
- Node.js backend
- RESTful API architecture
- Secure authentication
- Data persistence
- Error handling
- Unit testing with Jest

## Project Structure
```
quiz-app/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
├── src/              # Source files
├── public/           # Static assets
├── tests/            # Test files
└── sampleData/       # Sample quiz data
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
```bash
git clone https://github.com/caspermohit/quiz-quest.git
```

2. Install dependencies
```bash
cd quiz-app
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements
- User authentication and profiles
- Social sharing features
- Custom quiz creation
- Leaderboard system
- Mobile app version
- Offline support
- Analytics dashboard
