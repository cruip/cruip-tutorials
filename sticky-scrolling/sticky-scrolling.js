// Sticky Scrolling Effect
class StickySections {
  constructor(containerElement) {
    this.container = {
      el: containerElement,
      height: 0,
      top: 0,
      bottom: 0,
    }
    this.sections = Array.from(this.container.el.querySelectorAll('section'));
    this.viewportTop = 0;
    this.activeIndex = 0;
    this.scrollValue = 0; // Scroll value of the sticky container
    this.onScroll = this.onScroll.bind(this);
    this.initContainer = this.initContainer.bind(this);
    this.handleSections = this.handleSections.bind(this);
    this.remapValue = this.remapValue.bind(this);
    this.init();
  }

  onScroll() {
    this.handleSections();   
  }

  initContainer() {
    this.container.el.style.setProperty('--stick-items', `${this.sections.length + 1}00vh`);
    this.container.el.classList.add('[&_*]:!transition-none');
    setTimeout(() => {
      this.container.el.classList.remove('[&_*]:!transition-none');
    }, 1);        
  }
  
  handleSections() {
    this.viewportTop = window.scrollY;
    this.container.height = this.container.el.clientHeight;
    this.container.top = this.container.el.offsetTop;
    this.container.bottom = this.container.top + this.container.height;

    if (this.container.bottom <= this.viewportTop) {
      // The bottom edge of the stickContainer is above the viewport
      this.scrollValue = this.sections.length + 1;
    } else if (this.container.top >= this.viewportTop) {
      // The top edge of the stickContainer is below the viewport
      this.scrollValue = 0;
    } else {
      // The stickContainer intersects with the viewport
      this.scrollValue = this.remapValue(this.viewportTop, this.container.top, this.container.bottom, 0, this.sections.length + 1);
    }
    this.activeIndex = Math.floor(this.scrollValue) >= this.sections.length ? this.sections.length - 1 : Math.floor(this.scrollValue);

    this.sections.forEach((section, i) => {
      if (i === this.activeIndex) {
        section.style.setProperty('--stick-visibility', '1');
        section.style.setProperty('--stick-scale', '1');
      } else {
        section.style.setProperty('--stick-visibility', '0');
        section.style.setProperty('--stick-scale', '.8');
      }
    });
  }  

  // This function remaps a value from one range to another range
  remapValue(value, start1, end1, start2, end2) {
    const remapped = (value - start1) * (end2 - start2) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  }
  
  init() {
    this.initContainer();
    this.handleSections();
    window.addEventListener('scroll', this.onScroll);
  }  
}

// Init StickySections
const sectionsContainer = document.querySelectorAll('[data-sticky-sections]');
sectionsContainer.forEach((section) => {
  new StickySections(section);
});
