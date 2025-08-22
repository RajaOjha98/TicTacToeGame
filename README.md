# 🎮 Modern Tic-Tac-Toe Game

A beautiful, modern tic-tac-toe game built with HTML, CSS, and JavaScript featuring stunning neon effects, sound effects, and smooth animations.

![Tic-Tac-Toe Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

### 🎨 **Visual Design**
- **Modern Glass-morphism UI** with backdrop blur effects
- **Neon Glow Effects** for X and O symbols with multiple shadow layers
- **Animated Strikethrough Lines** that appear when someone wins
- **Responsive Design** that works perfectly on desktop, tablet, and mobile
- **Beautiful Gradient Backgrounds** with smooth color transitions

### 🔊 **Audio Experience**
- **Dynamic Sound Effects** for moves, wins, and interactions
- **Distinct Audio Cues** for X moves, O moves, victories, and draws
- **Interactive Hover Sounds** for enhanced user experience
- **Sound Toggle Control** to enable/disable audio

### ⚡ **Game Features**
- **Real-time Score Tracking** with persistent storage
- **Game Statistics** showing win rates and total games
- **Win Detection** for all 8 possible winning combinations
- **Draw Detection** and handling
- **Visual Win Announcements** in the status panel
- **Smooth Animations** for all game interactions

### 🎯 **Technical Highlights**
- **Pure JavaScript** - No external dependencies
- **Web Audio API** for dynamic sound generation
- **Local Storage** for persistent game statistics
- **CSS Grid & Flexbox** for perfect layouts
- **CSS Custom Properties** for dynamic animations
- **Responsive Breakpoints** for all screen sizes

## 🚀 Live Demo

[**Play the Game Now!**](https://rajaojha98.github.io/TicTacToeGame) *(Will be live after GitHub Pages setup)*

## 📱 Screenshots

### Desktop View
```
┌─────────────────────────────────────────┐
│  🎮 Modern Tic-Tac-Toe Game            │
├─────────────┬───────────────────────────┤
│             │  Game Status              │
│   X │   │ O │  Let's play! X starts    │
│  ───┼───┼───│                           │
│     │ X │   │  Game Statistics          │
│  ───┼───┼───│  Total Games: 0          │
│   O │   │   │  X Win Rate: 0%          │
│             │  O Win Rate: 0%          │
│ [New Game]  │  Draw Rate: 0%           │
│[Reset Score]│                           │
│[Sound ON]   │                           │
└─────────────┴───────────────────────────┘
```

## 🛠️ Installation & Setup

### Option 1: Direct Download
1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Start playing!** No additional setup required

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/RajaOjha98/TicTacToeGame.git

# Navigate to project directory
cd TicTacToeGame

# Open with live server (if you have it installed)
# Or simply open index.html in your browser
```

### Option 3: GitHub Pages
1. Fork this repository
2. Go to Settings > Pages
3. Select source: Deploy from branch `main`
4. Your game will be available at: `https://rajaojha98.github.io/TicTacToeGame`

## 🎮 How to Play

### Basic Rules
1. **Players take turns** clicking empty cells to place their symbol (X or O)
2. **First player with 3 in a row wins** (horizontal, vertical, or diagonal)
3. **If all 9 cells are filled** without a winner, it's a draw
4. **Scores are tracked** and saved automatically

### Controls
- **Click cells** to make your move
- **New Game** - Start a fresh game
- **Reset Score** - Clear all statistics
- **Sound Toggle** - Enable/disable audio effects

### Keyboard Shortcuts
- **Numbers 1-9** - Quick cell selection
- **R** - Reset game
- **Space** - New game

## 🏗️ Project Structure

```
tictactoe/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # Game logic and sound effects
├── README.md           # Project documentation
├── .gitignore          # Git ignore rules
└── LICENSE             # MIT License
```

## 🔧 Technical Implementation

### Core Technologies
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Modern styling with animations and transitions
- **JavaScript ES6+** - Game logic and interactive features

### Key Features Implementation
- **Sound System**: Web Audio API with synthesized tones
- **Animations**: CSS keyframes with JavaScript triggers
- **Persistence**: LocalStorage for game statistics
- **Responsiveness**: CSS Grid, Flexbox, and media queries

### Browser Compatibility
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Game Mechanics

### Win Detection Algorithm
The game checks for wins using an efficient algorithm that evaluates all 8 possible winning combinations:
- 3 horizontal lines
- 3 vertical lines  
- 2 diagonal lines

### Visual Feedback
- **Neon strike-through lines** animate across winning combinations
- **Cell highlighting** with golden glow effects
- **Status updates** in real-time panel
- **Sound effects** synchronized with visual feedback

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute
1. **Report bugs** or suggest features via Issues
2. **Submit pull requests** with improvements
3. **Share feedback** on user experience
4. **Add translations** for different languages

### Development Setup
```bash
# Fork and clone the repo
git clone https://github.com/RajaOjha98/TicTacToeGame.git
cd TicTacToeGame

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and test thoroughly
# Commit your changes
git commit -m "Add: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Modern CSS Techniques** inspired by glass-morphism design trends
- **Web Audio API** for creating dynamic sound effects without external files
- **CSS Grid & Flexbox** for responsive layouts
- **Animation inspiration** from modern UI/UX design patterns

## 📞 Contact & Support

- **GitHub Issues** - For bug reports and feature requests
- **Pull Requests** - For code contributions
- **Discussions** - For general questions and suggestions

---

⭐ **If you enjoyed this game, please give it a star!** ⭐

**Made with ❤️ and modern web technologies** 