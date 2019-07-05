import { GALLERY_CONF, GALLERY_IMAGE } from './interfaces';

// key codes to react
export const KEY_CODES = {
  37: 'LEFT',
  39: 'RIGHT',
  27: 'ESC'
};

// default gallery configuration
export const DEFAULT_CONF: GALLERY_CONF = {
  imageBorderRadius: '3px',
  imageOffset: '20px',
  imagePointer: false,
  showDeleteControl: false,
  showCloseControl: true,
  showExtUrlControl: true,
  showImageTitle: true,
  showThumbnails: true,
  closeOnEsc: true,
  reactToKeyboard: true,
  reactToMouseWheel: true,
  reactToRightClick: false,
  thumbnailSize: 30,
  backdropColor: 'rgba(13,13,14,0.85)',
  inline: false,
  showArrows: true
};

export const DEMO_GALLERY_CONF_INLINE: GALLERY_CONF = {
  imageOffset: '0px',
  imagePointer: true,
  showDeleteControl: false,
  showCloseControl: false,
  showExtUrlControl: false,
  closeOnEsc: true,
  showImageTitle: false,
  inline: true,
  backdropColor: 'default'
};

