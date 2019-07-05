import {
  Component,
  OnInit,
  HostBinding,
  Input,
  HostListener,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output,
  SimpleChanges,
  ViewChild,
  OnChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GALLERY_CONF, GALLERY_IMAGE } from './interfaces';
import { DEFAULT_CONF, KEY_CODES } from './constants';

@Component({
  selector: 'app-image-gallary',
  templateUrl: './image-gallary.component.html',
  styleUrls: ['./image-gallary.component.scss']
})
export class ImageGallaryComponent implements OnInit, OnChanges {
  @HostBinding('class.active') opened = false;
  @Input() conf: GALLERY_CONF = {};
  @Input() images: GALLERY_IMAGE[] = [];

  @Output() onOpen = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onImageChange = new EventEmitter();
  @Output() onImageClicked = new EventEmitter();

  @ViewChild('thumbnails', { static: false }) thumbnailsElem: ElementRef;

  loading = false;

  activeImageIndex: number = null;

  thumbnailMargin = '0px 8px';
  thumbnailsScrollerLeftMargin = '0px';

  get activeImage(): GALLERY_IMAGE {
    return this.images[this.activeImageIndex];
  }

  get onFirstImage(): boolean {
    return this.activeImageIndex === 0;
  }

  get onLastImage(): boolean {
    return this.activeImageIndex === (this.images.length - 1);
  }

  get thumbnailsRenderParams(): {
    thumbnailsInView: number, newThumbnailMargin: number, newThumbnailSize: number, thumbnailsScrollerLeftMargin: any
  } {
    const thumbnailsContainerWidth = this.thumbnailsElem.nativeElement.offsetWidth;

    const thumbnailMargin = 16;
    const thumbnailSize = thumbnailMargin + this.conf.thumbnailSize;
    const thumbnailsInView = Math.floor(thumbnailsContainerWidth / thumbnailSize);
    const extraSpaceInThumbnailsContainer = thumbnailsContainerWidth - (thumbnailsInView * thumbnailSize);
    const extraMargin = extraSpaceInThumbnailsContainer / thumbnailsInView;

    const newThumbnailMargin = thumbnailMargin + extraMargin;
    const newThumbnailSize = newThumbnailMargin + this.conf.thumbnailSize;

    const relativePositionOfActiveImageThumbnailToScroller = thumbnailsInView - (thumbnailsInView - this.activeImageIndex);
    let thumbnailsScrollerLeftMargin: any;

    if (relativePositionOfActiveImageThumbnailToScroller > thumbnailsInView - 2) {
      const outThumbnails = ((this.activeImageIndex + 1) - thumbnailsInView) + 1;

      if (this.activeImageIndex !== (this.images.length - 1)) {
        thumbnailsScrollerLeftMargin = '-' + (newThumbnailSize * outThumbnails) + 'px';
      } else {
        thumbnailsScrollerLeftMargin = '-' + (newThumbnailSize * (outThumbnails - 1)) + 'px';
      }
    } else {
      thumbnailsScrollerLeftMargin = '0px';
    }

    return {
      thumbnailsInView,
      newThumbnailMargin,
      newThumbnailSize,
      thumbnailsScrollerLeftMargin
    };
  }

  private setGalleryConf(conf: GALLERY_CONF) {
    this.conf = Object.assign(DEFAULT_CONF, conf);
  }

  private loadImage(index: number): Promise<any> {
    const galleryImage: GALLERY_IMAGE = this.images[index];

    if (galleryImage._cached) {
      return Promise.resolve(index);
    } else {
      return new Promise((resolve, reject) => {
        this.loading = true;

        const image = new Image();
        image.src = galleryImage.url;

        image.onload = () => {
          this.loading = false;
          galleryImage._cached = true;
          resolve(index);
        };

        image.onerror = (error) => {
          this.loading = false;
          reject(error);
        };
      });
    }
  }

  private activateImage(imageIndex: number) {
    if (this.loading) {
      return false;
    }

    this.onImageChange.emit(imageIndex);

    this.loadImage(imageIndex)
      .then(imgIdx => {
        this.activeImageIndex = imgIdx;

        setTimeout(() => {
          setTimeout(() => this.scrollThumbnails(), 300);
        });
      })
      .catch(error => console.warn(error));
  }

  private scrollThumbnails() {
    if (this.conf.showThumbnails === false) {
      return false;
    }

    const thumbnailParams = this.thumbnailsRenderParams;
    this.thumbnailsScrollerLeftMargin = thumbnailParams.thumbnailsScrollerLeftMargin;
  }

  constructor(
    private galleryElem: ElementRef,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.setGalleryConf(this.conf);

    this.renderer.setStyle(this.galleryElem.nativeElement, 'background-color', this.conf.backdropColor);

    if (this.conf.inline) {
      this.renderer.addClass(this.galleryElem.nativeElement, 'inline');
      this.open(0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.conf && changes.conf.firstChange === false) {
      this.setGalleryConf(changes.conf.currentValue);

      this.renderer.setStyle(this.galleryElem.nativeElement, 'background-color', this.conf.backdropColor);

      if ((changes.conf.previousValue.inline !== true) && this.conf.inline) {
        this.renderer.addClass(this.galleryElem.nativeElement, 'inline');
        this.open(0);
      }
    }

    if (changes.images && changes.images.firstChange === false) {
      this.images = changes.images.currentValue;

      if (this.images.length) {
        this.activateImage(0);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyboardInput(event: KeyboardEvent) {
    if (this.conf.reactToKeyboard && this.opened && !this.loading) {
      if (KEY_CODES[event.keyCode] === 'RIGHT') {
        this.next();
      } else if (KEY_CODES[event.keyCode] === 'LEFT') {
        this.prev();
      } else if ((KEY_CODES[event.keyCode] === 'ESC') && this.conf.closeOnEsc) {
        this.close();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event) {
    if (this.opened && !this.loading) {
      setTimeout(() => this.scrollThumbnails(), 300);
    }
  }

  open(index: number = 0) {
    if (this.images.length) {
      this.opened = true;

      this.onOpen.emit(index);

      this.activateImage(index);
    } else {
      console.warn('No images provided to ngx-image-gallery!');
    }
  }

  close() {
    this.opened = false;
    this.activeImageIndex = 0;

    this.onClose.emit();
  }

  prev() {
    if (this.onFirstImage === false) {
      this.activateImage(this.activeImageIndex - 1);
    }
  }

  next() {
    if (this.onLastImage === false) {
      this.activateImage(this.activeImageIndex + 1);
    }
  }

  setActiveImage(index: number) {
    this.activateImage(index);
  }

  deleteImage(index: number) {
    this.onDelete.emit(index);
  }

  clickOnImage(index: number) {
    this.onImageClicked.emit(index);
  }

  rightClickOnImage(event: Event) {
    event.stopPropagation();
    return this.conf.reactToRightClick;
  }
}
