// Loader Class - La Básica Animation
class BasicaLoader {
    constructor() {
        this.loaderContainer = document.getElementById('loaderContainer');
        this.textContent = document.getElementById('textContent');
        this.colorSweep = document.getElementById('colorSweep');
        this.words = [
            document.getElementById('word1'),
            document.getElementById('word2'),
            document.getElementById('word3'),
            document.getElementById('word4')
        ];
        this.currentWordIndex = 0;
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Show initial text with fade-in effect
        setTimeout(() => {
            this.textContent.classList.add('show');
        }, 300);

        // Start sequence of changes
        setTimeout(() => {
            this.startSequence();
        }, 1000);
    }

    startSequence() {
        const sequence = [
            {wordIndex: 1, sweepClass: 'sweep-green', bgClass: 'bg-green'},
            {wordIndex: 2, sweepClass: 'sweep-blue', bgClass: 'bg-blue'},
            {wordIndex: 3, sweepClass: 'sweep-brown', bgClass: 'bg-brown', centerWhileAnimating: true}
        ];

        let currentStep = 0;

        const executeStep = () => {
            if (currentStep < sequence.length && !this.isAnimating) {
                this.isAnimating = true;
                const step = sequence[currentStep];

                this.changeToWord(step.wordIndex, step.sweepClass, step.bgClass, step.centerWhileAnimating);

                currentStep++;

                setTimeout(() => {
                    this.isAnimating = false;
                    if (currentStep < sequence.length) {
                        executeStep();
                    } else {
                        // Already centered, just wait and exit
                        setTimeout(() => {
                            this.exitLoader();
                        }, 800);
                    }
                }, 1500);
            }
        };

        executeStep();
    }

    changeToWord(wordIndex, sweepClass, bgClass, centerWhileAnimating = false) {
        // If it's the last change, center at the same time
        if (centerWhileAnimating) {
            this.textContent.classList.add('center');
        }

        // Determine if it's the green to blue change (index 2)
        const isVerticalSweep = wordIndex === 2;

        if (isVerticalSweep) {
            // Reset for vertical sweep (bottom to top)
            this.colorSweep.style.transition = 'none';
            this.colorSweep.style.width = '100%';
            this.colorSweep.style.height = '0%';
            this.colorSweep.style.top = '100%';
            this.colorSweep.className = 'color-sweep vertical';
            void this.colorSweep.offsetWidth; // Force reflow

            // Configure new vertical sweep animation
            this.colorSweep.classList.add(sweepClass);

            // Restore transition and start vertical sweep
            setTimeout(() => {
                this.colorSweep.style.transition = 'height 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                this.colorSweep.style.height = '100%';
                this.colorSweep.style.top = '0%';

                // Change container background when sweep is complete
                setTimeout(() => {
                    this.loaderContainer.classList.remove('bg-green', 'bg-blue', 'bg-brown');
                    this.loaderContainer.classList.add(bgClass);
                }, 1200);
            }, 50);
        } else {
            // Reset for horizontal sweep (left to right) - original behavior
            this.colorSweep.style.transition = 'none';
            this.colorSweep.style.width = '0%';
            this.colorSweep.style.height = '100%';
            this.colorSweep.style.top = '0';
            this.colorSweep.className = 'color-sweep';
            void this.colorSweep.offsetWidth; // Force reflow

            // Configure new horizontal sweep animation
            this.colorSweep.classList.add(sweepClass);

            // Restore transition and start horizontal sweep
            setTimeout(() => {
                this.colorSweep.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                this.colorSweep.style.width = '100%';

                // Change container background when sweep is complete
                setTimeout(() => {
                    this.loaderContainer.classList.remove('bg-green', 'bg-blue', 'bg-brown');
                    this.loaderContainer.classList.add(bgClass);
                }, 1200);
            }, 50);
        }

        // Animate words: current exits, new enters
        const currentWord = this.words[this.currentWordIndex];
        currentWord.classList.remove('active');
        currentWord.classList.add('exit');

        setTimeout(() => {
            // Remove exiting word
            currentWord.classList.remove('exit');
            currentWord.style.transform = 'translateX(100%)';

            // Show new word entering
            this.words[wordIndex].classList.add('active');
            this.currentWordIndex = wordIndex;
        }, 300);
    }

    exitLoader() {
        this.loaderContainer.classList.add('exit-up');

        // Hide loader completely
        setTimeout(() => {
            this.loaderContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }
}

// Initialize loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BasicaLoader();
});

// Loader functionality complete
