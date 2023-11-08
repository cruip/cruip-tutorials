// TextScramble animation on click
class TextScramble {
  constructor(element) {
    this.element = element;
    this.links = Array.from(this.element.querySelectorAll('a'));
    this.activeLink = this.links.find(link => link.getAttribute('aria-current') === 'page');
    this.input = null;
    this.prefix = '';
    this.suffix = '';
    this.isScrambling = false;
    this.intervalId = null;
    this.charset = 'abcdefghijklmnopqrstuvwxyz';
    this.charsetLength = this.charset.length;
    this.scrambleIteration = this.scrambleIteration.bind(this);
    this.init();
  }

  handleActiveLink = (link) => {
    if (this.activeLink) {
      this.activeLink.removeAttribute('aria-current');
    }
    this.activeLink = link;
    this.activeLink.setAttribute('aria-current', 'page');
  }

  startScramble = (link) => {
    if (this.isScrambling) {
      this.stopScramble(this.activeLink);
    }
    this.isScrambling = true;
    this.input = link.textContent;
    this.prefix = '';
    this.suffix = this.randomChars(this.input.length);
    this.intervalId = setInterval(() => this.scrambleIteration(link), 50);
  }

  scrambleIteration = (link) => {
    let nextChar = this.input.charAt(this.prefix.length);
    if (nextChar === '') {
      this.stopScramble(link);
    } else {
      this.prefix += nextChar;
      this.suffix = this.randomChars(this.input.length - this.prefix.length);
      link.textContent = this.prefix;
      link.setAttribute('data-scramble-suffix', this.suffix);
    }
  }

  stopScramble = (link) => {
    link.textContent = this.input;
    link.setAttribute('data-scramble-suffix', '');
    this.isScrambling = false;
    clearInterval(this.intervalId);
  }

  randomChars = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.charsetLength);
      result += `${this.charset[randomIndex]}`;
    }
    return result;
  }

  init = () => {
    this.links.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        if (link === this.activeLink) return;
        this.startScramble(link);
        this.handleActiveLink(link);
      });
    });
  }
}

// Init TextScramble
const scrambleElements = document.querySelectorAll('[data-text-scramble]');
scrambleElements.forEach((element) => {
  new TextScramble(element);
});