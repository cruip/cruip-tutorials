// Gradient Text Reveal
class TextReveal {
  constructor(element) {
    this.element = element;
    this.child = this.element.firstElementChild;
    this.revealValue = 0;
    this.opacityValue = 0;
    this.canReveal = this.canReveal.bind(this);
    this.getRects = this.getRects.bind(this);
    this.calculateRevealValue = this.calculateRevealValue.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.setupReveal = this.setupReveal.bind(this);
    this.init();
  }

  canReveal() {
    const { childRect } = this.getRects();
    // Returns false if the child container is taller than the viewport.
    return childRect.height <= window.innerHeight;
  }

  getRects() {
    return {
      rect: this.element.getBoundingClientRect(),
      childRect: this.child.getBoundingClientRect()
    };
  }

  calculateRevealValue() {
    const { rect, childRect } = this.getRects();

    if (!this.canReveal()) return 1;

    // Calculate the intersection value based on the provided conditions
    if (rect.top <= childRect.top && rect.bottom >= childRect.top) {
      const totalHeightDifference = rect.height - childRect.height;
      const currentHeightDifference = childRect.top - rect.top;
      this.revealValue = currentHeightDifference / totalHeightDifference;
    } else if (rect.bottom < childRect.top || Math.abs(childRect.top - rect.bottom) < 0.01) {
      this.revealValue = 1;
    } else {
      this.revealValue = 0;
    }

    // Clamp the value between 0 and 1
    this.revealValue = Math.max(0, Math.min(1, this.revealValue));

    return this.revealValue;
  }

  handleScroll() {
    this.revealValue = this.calculateRevealValue();
    this.element.style.setProperty('--reveal-value', this.revealValue);

    if (this.revealValue >= 0.3 && this.revealValue <= 0.7) {
      this.opacityValue = 1;
    } else if (this.revealValue >= 0.2 && this.revealValue < 0.3) {
      this.opacityValue = 10 * (this.revealValue - 0.2);
    } else if (this.revealValue > 0.7 && this.revealValue <= 0.8) {
      this.opacityValue = 1 - 10 * (this.revealValue - 0.7);
    } else {
      this.opacityValue = 0;
    }
    this.element.style.setProperty('--opacity-value', this.opacityValue);
  }

  setupReveal() {
    if (this.canReveal()) {
      this.handleScroll();
      window.addEventListener('scroll', this.handleScroll);
      // Remove the inline styles if previously set
      this.child.style.position = '';
      this.child.style.top = '';
      this.child.style.left = '';
      this.child.style.transform = '';
      this.element.style.height = '';
    } else {
      window.removeEventListener('scroll', this.handleScroll);
      this.element.style.setProperty('--reveal-value', 0.5);
      this.element.style.setProperty('--opacity-value', 1);
      // Set some inline styles if the effect isn't doable
      this.child.style.position = 'relative';
      this.child.style.top = '0';
      this.child.style.left = '0';
      this.child.style.transform = 'translate3d(0,0,0)';
      this.element.style.height = 'auto';
    }
  }

  init() {
    this.setupReveal();
    window.addEventListener('resize', this.setupReveal);
  }
}

// Init TextReveal
const els = document.querySelectorAll('[data-text-reveal]');
els.forEach((el) => {
  new TextReveal(el);
});
