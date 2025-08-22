/*
 * Modern Tic-Tac-Toe Game - JavaScript Logic
 * 
 * This file contains:
 * - Complete game logic and state management
 * - Web Audio API sound effects system
 * - Dynamic strikethrough line animations
 * - Local storage for persistent statistics
 * - Responsive event handling
 * - Debug and testing utilities
 * 
 * Author: RajaOjha98
 * License: MIT
 * Repository: https://github.com/RajaOjha98/TicTacToeGame
 */

/* ========================================
   SOUND MANAGEMENT SYSTEM
   ======================================== */

/**
 * Sound Manager Class for Audio Effects
 * Generates dynamic sound effects using Web Audio API
 * No external audio files required
 */
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = true;
        this.initAudio();
    }
    
    initAudio() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
            this.soundEnabled = false;
        }
    }
    
    // Resume audio context (required for some browsers)
    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // Generate a tone with specified frequency and duration
    playTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        this.resumeContext();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // X move sound (higher pitch, crisp)
    playXMove() {
        this.playTone(800, 0.15, 'square', 0.08);
        setTimeout(() => this.playTone(1000, 0.1, 'square', 0.06), 50);
    }
    
    // O move sound (lower pitch, smooth)
    playOMove() {
        this.playTone(400, 0.2, 'sine', 0.08);
        setTimeout(() => this.playTone(350, 0.15, 'sine', 0.06), 80);
    }
    
    // Win celebration sound
    playWinSound() {
        const notes = [523, 659, 784, 1047]; // C, E, G, C (major chord)
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playTone(note, 0.4, 'sine', 0.1);
            }, index * 100);
        });
        
        // Add sparkle effect
        setTimeout(() => {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    this.playTone(1500 + Math.random() * 500, 0.1, 'sine', 0.05);
                }, i * 50);
            }
        }, 500);
    }
    
    // Strikethrough line sound effect
    playStrikeThroughSound() {
        // Electric zap sound for the strike line
        this.playTone(1000, 0.1, 'square', 0.08);
        setTimeout(() => this.playTone(1200, 0.15, 'sawtooth', 0.06), 50);
        setTimeout(() => this.playTone(800, 0.2, 'square', 0.05), 150);
        
        // Add electric crackle effect
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.playTone(2000 + Math.random() * 1000, 0.05, 'square', 0.03);
                }, i * 30);
            }
        }, 300);
    }
    
    // Draw sound (neutral)
    playDrawSound() {
        this.playTone(300, 0.3, 'triangle', 0.08);
        setTimeout(() => this.playTone(250, 0.3, 'triangle', 0.08), 200);
    }
    
    // Button click sound
    playButtonClick() {
        this.playTone(600, 0.08, 'square', 0.05);
    }
    
    // Error sound (invalid move)
    playErrorSound() {
        this.playTone(200, 0.1, 'sawtooth', 0.08);
        setTimeout(() => this.playTone(150, 0.1, 'sawtooth', 0.08), 100);
    }
    
    // Hover sound (subtle)
    playHoverSound() {
        this.playTone(400, 0.05, 'sine', 0.02);
    }
    
    // Game start sound
    playGameStartSound() {
        const melody = [264, 297, 330, 352]; // C, D, E, F
        melody.forEach((note, index) => {
            setTimeout(() => {
                this.playTone(note, 0.15, 'sine', 0.06);
            }, index * 100);
        });
    }
    
    // Toggle sound on/off
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }
}

/* ========================================
   MAIN GAME CLASS
   ======================================== */

/**
 * TicTacToeGame Class - Core Game Logic
 * Handles all game state, user interactions, and UI updates
 */
class TicTacToeGame {
    constructor() {
        this.currentPlayer = 'X';
        this.gameBoard = Array(9).fill('');
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        // Initialize sound manager
        this.soundManager = new SoundManager();
        
        // Winning combinations (indices of the 3x3 grid)
        this.winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Main diagonal
            [2, 4, 6]  // Anti diagonal
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
        this.loadScores();
    }
    
    bindEvents() {
        // Cell click events
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.makeMove(index));
        });
        
        // Button events
        document.getElementById('resetGame').addEventListener('click', () => {
            this.soundManager.playButtonClick();
            this.resetGame();
        });
        document.getElementById('resetScore').addEventListener('click', () => {
            this.soundManager.playButtonClick();
            this.resetScores();
        });
        document.getElementById('toggleSound').addEventListener('click', () => {
            this.toggleSound();
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
        });
    }
    
    makeMove(index) {
        // Check if move is valid
        if (!this.gameActive || this.gameBoard[index] !== '') {
            // Play error sound for invalid moves
            this.soundManager.playErrorSound();
            return;
        }
        
        // Play move sound based on current player
        if (this.currentPlayer === 'X') {
            this.soundManager.playXMove();
        } else {
            this.soundManager.playOMove();
        }
        
        // Make the move
        this.gameBoard[index] = this.currentPlayer;
        
        // Update the visual board
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = this.currentPlayer;
        cell.classList.add('taken', this.currentPlayer.toLowerCase());
        
        // Check for game end conditions
        const result = this.checkGameEnd();
        
        if (result.gameEnd) {
            this.handleGameEnd(result);
        } else {
            this.switchPlayer();
            this.updateDisplay();
        }
    }
    
    checkGameEnd() {
        // Check for wins
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.gameBoard[a] && 
                this.gameBoard[a] === this.gameBoard[b] && 
                this.gameBoard[a] === this.gameBoard[c]) {
                return {
                    gameEnd: true,
                    winner: this.gameBoard[a],
                    winningCells: combination
                };
            }
        }
        
        // Check for draw
        if (!this.gameBoard.includes('')) {
            return {
                gameEnd: true,
                winner: null,
                winningCells: []
            };
        }
        
        // Game continues
        return {
            gameEnd: false,
            winner: null,
            winningCells: []
        };
    }
    
    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result.winner) {
            // Handle win
            this.scores[result.winner]++;
            this.highlightWinningCells(result.winningCells);
            this.updateScoreDisplay();
            
            // Play victory sound
            setTimeout(() => this.soundManager.playWinSound(), 300);
            
            // Show win announcement in status panel
            this.showWinAnnouncement(`🎉 Player ${result.winner} Wins!`, 'win');
            this.updateStatus(`Player ${result.winner} wins! 🎉`);
        } else {
            // Handle draw
            this.scores.draw++;
            this.updateScoreDisplay();
            
            // Play draw sound
            setTimeout(() => this.soundManager.playDrawSound(), 300);
            
            // Show draw announcement in status panel
            this.showWinAnnouncement('🤝 It\'s a Draw!', 'draw');
            this.updateStatus('It\'s a draw! 🤝');
        }
        
        this.saveScores();
        this.updateGameStats();
    }
    
    highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('winning');
        });
        
        // Add strikethrough line animation
        setTimeout(() => {
            this.addStrikeThroughLine(winningCells);
            this.soundManager.playStrikeThroughSound();
        }, 500);
    }
    
    addStrikeThroughLine(winningCells) {
        const gameBoard = document.getElementById('gameBoard');
        const boardRect = gameBoard.getBoundingClientRect();
        
        // Remove any existing strike lines
        const existingLines = gameBoard.querySelectorAll('.strike-line');
        existingLines.forEach(line => line.remove());
        
        // Create strike line element
        const strikeLine = document.createElement('div');
        strikeLine.className = 'strike-line';
        
        // Calculate line position and orientation based on winning pattern
        const lineData = this.calculateLinePosition(winningCells);
        
        // Debug logging for diagonal patterns (development mode)
        if (lineData.type === 'diagonal' || lineData.type === 'anti-diagonal') {
            console.log(`[DEBUG] ${lineData.type} line positioning:`, {
                left: lineData.left,
                top: lineData.top,
                width: lineData.width,
                height: lineData.height,
                rotation: lineData.rotation,
                winningCells: winningCells
            });
        }
        
        // Set line type class
        strikeLine.classList.add(lineData.type);
        
        // Set CSS custom properties for animation
        strikeLine.style.setProperty('--line-width', lineData.width + 'px');
        strikeLine.style.setProperty('--line-height', lineData.height + 'px');
        
        // Position the line
        strikeLine.style.left = lineData.left + 'px';
        
        // For diagonal lines, set the rotation and origin BEFORE positioning
        if (lineData.rotation !== undefined) {
            strikeLine.style.transformOrigin = lineData.transformOrigin || 'left center';
            strikeLine.style.transform = `rotate(${lineData.rotation}deg)`;
            // Adjust position for diagonal lines to center the line vertically
            strikeLine.style.top = (lineData.top - 3) + 'px';
            // Set initial opacity to make it visible (overriding CSS)
            strikeLine.style.opacity = '1';
            
            // Add important style to ensure rotation persists
            strikeLine.style.setProperty('transform', `rotate(${lineData.rotation}deg)`, 'important');
        } else {
            strikeLine.style.top = lineData.top + 'px';
        }
        
        gameBoard.appendChild(strikeLine);
        
        // Force a reflow to ensure transforms are applied immediately for diagonal lines
        if (lineData.rotation !== undefined) {
            strikeLine.offsetHeight; // Force reflow
            
            // Debug: Add event listener to check what happens to the transform
            console.log(`Diagonal line applied with rotation: ${lineData.rotation}deg`);
            
            // Double-check the transform is applied after 2 seconds
            setTimeout(() => {
                const currentTransform = window.getComputedStyle(strikeLine).transform;
                console.log(`Transform after 2 seconds: ${currentTransform}`);
                if (!currentTransform.includes('matrix')) {
                    // If transform is lost, reapply it
                    strikeLine.style.setProperty('transform', `rotate(${lineData.rotation}deg)`, 'important');
                    console.log('Reapplied diagonal rotation');
                }
            }, 2000);
        }
    }
    
    calculateLinePosition(winningCells) {
        const [a, b, c] = winningCells;
        
        // Get actual DOM elements and their computed dimensions
        const gameBoard = document.getElementById('gameBoard');
        const boardStyle = window.getComputedStyle(gameBoard);
        const firstCell = document.querySelector('[data-index="0"]');
        const cellRect = firstCell.getBoundingClientRect();
        const boardRect = gameBoard.getBoundingClientRect();
        
        // Calculate actual dimensions from DOM
        const cellSize = cellRect.width;
        const gap = parseInt(boardStyle.gap) || 10;
        const boardPadding = parseInt(boardStyle.paddingLeft) || 20;
        
        // Get positions of the winning cells relative to the game board
        const cellPositions = winningCells.map(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            const rect = cell.getBoundingClientRect();
            return {
                left: rect.left - boardRect.left,
                top: rect.top - boardRect.top,
                centerX: rect.left - boardRect.left + rect.width / 2,
                centerY: rect.top - boardRect.top + rect.height / 2
            };
        });
        
        // Determine the type of win and calculate position
        if (a === 0 && b === 1 && c === 2) {
            // Top row
            return {
                type: 'horizontal',
                left: cellPositions[0].left,
                top: cellPositions[0].centerY - 3,
                width: cellPositions[2].left + cellSize - cellPositions[0].left,
                height: 6
            };
        } else if (a === 3 && b === 4 && c === 5) {
            // Middle row
            return {
                type: 'horizontal',
                left: cellPositions[0].left,
                top: cellPositions[0].centerY - 3,
                width: cellPositions[2].left + cellSize - cellPositions[0].left,
                height: 6
            };
        } else if (a === 6 && b === 7 && c === 8) {
            // Bottom row
            return {
                type: 'horizontal',
                left: cellPositions[0].left,
                top: cellPositions[0].centerY - 3,
                width: cellPositions[2].left + cellSize - cellPositions[0].left,
                height: 6
            };
        } else if (a === 0 && b === 3 && c === 6) {
            // Left column
            return {
                type: 'vertical',
                left: cellPositions[0].centerX - 3,
                top: cellPositions[0].top,
                width: 6,
                height: cellPositions[2].top + cellSize - cellPositions[0].top
            };
        } else if (a === 1 && b === 4 && c === 7) {
            // Middle column
            return {
                type: 'vertical',
                left: cellPositions[0].centerX - 3,
                top: cellPositions[0].top,
                width: 6,
                height: cellPositions[2].top + cellSize - cellPositions[0].top
            };
        } else if (a === 2 && b === 5 && c === 8) {
            // Right column
            return {
                type: 'vertical',
                left: cellPositions[0].centerX - 3,
                top: cellPositions[0].top,
                width: 6,
                height: cellPositions[2].top + cellSize - cellPositions[0].top
            };
        } else if (a === 0 && b === 4 && c === 8) {
            // Main diagonal (top-left to bottom-right)
            const startX = cellPositions[0].centerX;
            const startY = cellPositions[0].centerY;
            const endX = cellPositions[2].centerX;
            const endY = cellPositions[2].centerY;
            const diagonalLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
            
            return {
                type: 'diagonal',
                left: startX,
                top: startY,
                width: diagonalLength,
                height: 6,
                rotation: angle,
                transformOrigin: 'left center'
            };
        } else if (a === 2 && b === 4 && c === 6) {
            // Anti-diagonal (top-right to bottom-left)
            const startX = cellPositions[0].centerX;
            const startY = cellPositions[0].centerY;
            const endX = cellPositions[2].centerX;
            const endY = cellPositions[2].centerY;
            const diagonalLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
            
            return {
                type: 'anti-diagonal',
                left: startX,
                top: startY,
                width: diagonalLength,
                height: 6,
                rotation: angle,
                transformOrigin: 'left center'
            };
        }
        
        // Default fallback
        return {
            type: 'horizontal',
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
    
    resetGame() {
        this.currentPlayer = 'X';
        this.gameBoard = Array(9).fill('');
        this.gameActive = true;
        
        // Clear the visual board
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        // Remove any strike lines
        const gameBoard = document.getElementById('gameBoard');
        const existingLines = gameBoard.querySelectorAll('.strike-line');
        existingLines.forEach(line => line.remove());
        
        // Clear win announcement
        const announcementDiv = document.getElementById('winAnnouncement');
        announcementDiv.innerHTML = '';
        
        // Play game start sound
        setTimeout(() => this.soundManager.playGameStartSound(), 200);
        
        this.updateDisplay();
    }
    
    resetScores() {
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScoreDisplay();
        this.updateGameStats();
        this.saveScores();
        this.updateStatus('Scores reset! Let\'s start fresh! 🆕');
    }
    
    updateDisplay() {
        this.updateCurrentPlayer();
        this.updateStatus(`Player ${this.currentPlayer}'s turn`);
    }
    
    updateCurrentPlayer() {
        const currentPlayerElement = document.getElementById('currentPlayer');
        currentPlayerElement.textContent = this.currentPlayer;
        currentPlayerElement.style.background = this.currentPlayer === 'X' 
            ? 'linear-gradient(45deg, #ff6b6b, #ffa726)' 
            : 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    }
    
    updateScoreDisplay() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
        document.getElementById('scoreDraw').textContent = this.scores.draw;
    }
    
    updateStatus(message) {
        const statusElement = document.querySelector('.status-message');
        statusElement.textContent = message;
        
        // Add a subtle animation
        statusElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            statusElement.style.transform = 'scale(1)';
        }, 150);
    }
    
    showWinAnnouncement(message, type) {
        const announcementDiv = document.getElementById('winAnnouncement');
        
        // Clear existing announcement
        announcementDiv.innerHTML = '';
        
        // Create announcement element
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        
        if (type === 'win') {
            messageElement.className = 'win-message';
        } else if (type === 'draw') {
            messageElement.className = 'draw-message';
        }
        
        announcementDiv.appendChild(messageElement);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (announcementDiv.contains(messageElement)) {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'scale(0.9)';
                messageElement.style.transition = 'all 0.3s ease-out';
                
                setTimeout(() => {
                    if (announcementDiv.contains(messageElement)) {
                        announcementDiv.removeChild(messageElement);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }
    
    loadScores() {
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
            this.updateScoreDisplay();
        }
        this.updateGameStats();
    }
    
    // Helper method to get game statistics
    getGameStats() {
        const totalGames = this.scores.X + this.scores.O + this.scores.draw;
        return {
            totalGames,
            winRateX: totalGames > 0 ? ((this.scores.X / totalGames) * 100).toFixed(1) : 0,
            winRateO: totalGames > 0 ? ((this.scores.O / totalGames) * 100).toFixed(1) : 0,
            drawRate: totalGames > 0 ? ((this.scores.draw / totalGames) * 100).toFixed(1) : 0
        };
    }
    
    // Update game statistics display
    updateGameStats() {
        const stats = this.getGameStats();
        
        document.getElementById('totalGames').textContent = stats.totalGames;
        document.getElementById('xWinRate').textContent = stats.winRateX + '%';
        document.getElementById('oWinRate').textContent = stats.winRateO + '%';
        document.getElementById('drawRate').textContent = stats.drawRate + '%';
    }
    
    // Toggle sound on/off
    toggleSound() {
        const isEnabled = this.soundManager.toggleSound();
        const button = document.getElementById('toggleSound');
        
        if (isEnabled) {
            button.textContent = '🔊 Sound ON';
            button.classList.remove('disabled');
            this.soundManager.playButtonClick();
        } else {
            button.textContent = '🔇 Sound OFF';
            button.classList.add('disabled');
        }
        
        this.updateStatus(isEnabled ? 'Sound enabled! 🔊' : 'Sound disabled 🔇');
    }
    
    // Test function to verify all winning patterns (for debugging)
    testAllWinningPatterns() {
        console.log('🧪 Testing all winning patterns...');
        
        const testPatterns = [
            { name: 'Top Row', pattern: [0, 1, 2], board: ['X', 'X', 'X', '', '', '', '', '', ''] },
            { name: 'Middle Row', pattern: [3, 4, 5], board: ['', '', '', 'X', 'X', 'X', '', '', ''] },
            { name: 'Bottom Row', pattern: [6, 7, 8], board: ['', '', '', '', '', '', 'X', 'X', 'X'] },
            { name: 'Left Column', pattern: [0, 3, 6], board: ['X', '', '', 'X', '', '', 'X', '', ''] },
            { name: 'Middle Column', pattern: [1, 4, 7], board: ['', 'X', '', '', 'X', '', '', 'X', ''] },
            { name: 'Right Column', pattern: [2, 5, 8], board: ['', '', 'X', '', '', 'X', '', '', 'X'] },
            { name: 'Main Diagonal', pattern: [0, 4, 8], board: ['X', '', '', '', 'X', '', '', '', 'X'] },
            { name: 'Anti-Diagonal', pattern: [2, 4, 6], board: ['', '', 'X', '', 'X', '', 'X', '', ''] }
        ];
        
        for (let i = 0; i < testPatterns.length; i++) {
            const test = testPatterns[i];
            setTimeout(() => {
                console.log(`Testing: ${test.name}`);
                this.resetGame();
                
                // Set up the test board
                this.gameBoard = [...test.board];
                this.gameActive = false;
                
                // Update visual board
                const cells = document.querySelectorAll('.cell');
                cells.forEach((cell, index) => {
                    cell.textContent = test.board[index];
                    if (test.board[index]) {
                        cell.className = `cell taken ${test.board[index].toLowerCase()}`;
                    }
                });
                
                // Highlight winning cells
                this.highlightWinningCells(test.pattern);
                
                // Show status
                this.updateStatus(`Testing: ${test.name} pattern`);
            }, i * 3000); // 3 second delay between each test
        }
        
        // Reset after all tests
        setTimeout(() => {
            this.resetGame();
            console.log('✅ All pattern tests completed!');
        }, testPatterns.length * 3000);
    }
    
    // Quick test for just diagonal patterns
    testDiagonalPatterns() {
        console.log('🔄 Testing diagonal patterns...');
        
        const diagonalTests = [
            { name: 'Main Diagonal (0,4,8)', pattern: [0, 4, 8], board: ['X', '', '', '', 'X', '', '', '', 'X'] },
            { name: 'Anti-Diagonal (2,4,6)', pattern: [2, 4, 6], board: ['', '', 'X', '', 'X', '', 'X', '', ''] }
        ];
        
        for (let i = 0; i < diagonalTests.length; i++) {
            const test = diagonalTests[i];
            setTimeout(() => {
                console.log(`Testing: ${test.name}`);
                this.resetGame();
                
                // Set up the test board
                this.gameBoard = [...test.board];
                this.gameActive = false;
                
                // Update visual board
                const cells = document.querySelectorAll('.cell');
                cells.forEach((cell, index) => {
                    cell.textContent = test.board[index];
                    if (test.board[index]) {
                        cell.className = `cell taken ${test.board[index].toLowerCase()}`;
                    }
                });
                
                // Debug: log cell positions
                const cellPositions = test.pattern.map(index => {
                    const cell = document.querySelector(`[data-index="${index}"]`);
                    const rect = cell.getBoundingClientRect();
                    const boardRect = document.getElementById('gameBoard').getBoundingClientRect();
                    return {
                        index,
                        centerX: rect.left - boardRect.left + rect.width / 2,
                        centerY: rect.top - boardRect.top + rect.height / 2
                    };
                });
                
                console.log('Cell positions:', cellPositions);
                
                // Highlight winning cells
                this.highlightWinningCells(test.pattern);
                
                // Show status
                this.updateStatus(`Testing: ${test.name} pattern`);
                
                // Monitor the diagonal line for 5 seconds
                setTimeout(() => {
                    const strikeLine = document.querySelector('.strike-line');
                    if (strikeLine) {
                        const currentTransform = window.getComputedStyle(strikeLine).transform;
                        console.log(`Final transform check for ${test.name}: ${currentTransform}`);
                        
                        if (currentTransform === 'none') {
                            console.error('❌ Diagonal line lost its rotation!');
                        } else if (currentTransform.includes('matrix')) {
                            console.log('✅ Diagonal line maintained its rotation');
                        }
                    }
                }, 5000);
            }, i * 8000); // 8 second delay between each test to allow monitoring
        }
    }
    
    // Test diagonal persistence specifically
    testDiagonalPersistence() {
        console.log('🔍 Testing diagonal line persistence...');
        this.resetGame();
        
        // Set up main diagonal
        const testBoard = ['X', '', '', '', 'X', '', '', '', 'X'];
        this.gameBoard = [...testBoard];
        this.gameActive = false;
        
        // Update visual board
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = testBoard[index];
            if (testBoard[index]) {
                cell.className = `cell taken ${testBoard[index].toLowerCase()}`;
            }
        });
        
        // Trigger diagonal line
        this.highlightWinningCells([0, 4, 8]);
        this.updateStatus('Testing diagonal persistence - watch console for updates');
        
        // Monitor every second for 10 seconds
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
                const strikeLine = document.querySelector('.strike-line');
                if (strikeLine) {
                    const transform = window.getComputedStyle(strikeLine).transform;
                    const rotation = this.getRotationFromTransform(transform);
                    console.log(`Second ${i}: Transform = ${transform}, Rotation ≈ ${rotation}°`);
                }
            }, i * 1000);
        }
    }
    
    // Helper function to extract rotation from transform matrix
    getRotationFromTransform(transform) {
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
            const values = matrix[1].split(',').map(parseFloat);
            const a = values[0];
            const b = values[1];
            return Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        
        return 'unknown';
    }
}

/* ========================================
   GAME ENHANCEMENTS & UX FEATURES
   ======================================== */

/**
 * GameEnhancements Class - Additional UX Features
 * Provides keyboard shortcuts, visual feedback, and advanced interactions
 */
class GameEnhancements {
    constructor(game) {
        this.game = game;
        this.addKeyboardShortcuts();
        this.addSoundEffects();
        this.addThemeAnimations();
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Number keys 1-9 for cell selection
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                this.game.makeMove(index);
            }
            
            // Space for new game
            if (e.key === ' ') {
                e.preventDefault();
                this.game.resetGame();
            }
        });
    }
    
    addSoundEffects() {
        // Create audio context for sound effects (optional)
        // This would require actual audio files, so we'll use CSS animations instead
        this.addVisualFeedback();
    }
    
    addVisualFeedback() {
        // Add ripple effect on cell click and hover sounds
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (!cell.classList.contains('taken')) {
                    this.createRippleEffect(e.target, e);
                }
            });
            
            // Add hover sound effect
            cell.addEventListener('mouseenter', () => {
                if (!cell.classList.contains('taken')) {
                    this.game.soundManager.playHoverSound();
                }
            });
        });
    }
    
    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    addThemeAnimations() {
        // Add periodic background color shifts
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            document.body.style.filter = `hue-rotate(${hue * 0.1}deg)`;
        }, 100);
    }
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ========================================
   GAME INITIALIZATION
   ======================================== */

/**
 * Initialize the game when DOM is loaded
 * Sets up all game components and provides developer tools
 */
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToeGame();
    const enhancements = new GameEnhancements(game);
    
    // Make game available globally for testing
    window.ticTacToeGame = game;
    
    // Add a welcome message and sound
    setTimeout(() => {
        game.updateStatus('Welcome to Tic-Tac-Toe! ✨ Player X starts first.');
        game.soundManager.playGameStartSound();
    }, 1000);
    
    // Display helpful information for users and developers
    setTimeout(() => {
        console.log('%c🎮 Modern Tic-Tac-Toe Game', 'color: #ff6b6b; font-size: 18px; font-weight: bold;');
        console.log('');
        console.log('%cKeyboard Shortcuts:', 'color: #4ecdc4; font-weight: bold;');
        console.log('• Numbers 1-9: Quick cell selection');
        console.log('• R: Reset current game');
        console.log('• Space: Start new game');
        console.log('');
        console.log('%cDeveloper Commands:', 'color: #ffa726; font-weight: bold;');
        console.log('• ticTacToeGame.testAllWinningPatterns() - Test all winning patterns');
        console.log('• ticTacToeGame.testDiagonalPatterns() - Test diagonal patterns only');
        console.log('• ticTacToeGame.testDiagonalPersistence() - Monitor diagonal lines');
        console.log('• ticTacToeGame.resetGame() - Reset game state');
        console.log('');
        console.log('%cEnjoy the game! ⭐', 'color: #667eea; font-style: italic;');
    }, 2000);
}); 