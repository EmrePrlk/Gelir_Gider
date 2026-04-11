import { type ExtendFile } from './types';

// ----------------------------------------------------------------------

// Define more types here
const FORMAT_PDF = new Set(['pdf']);
const FORMAT_TEXT = new Set(['txt']);
const FORMAT_PHOTOSHOP = new Set(['psd']);
const FORMAT_WORD = new Set(['doc', 'docx']);
const FORMAT_EXCEL = new Set(['xls', 'xlsx']);
const FORMAT_ZIP = new Set(['zip', 'rar', 'iso']);
const FORMAT_ILLUSTRATOR = new Set(['ai', 'esp']);
const FORMAT_POWERPOINT = new Set(['ppt', 'pptx']);
const FORMAT_AUDIO = new Set(['wav', 'aif', 'mp3', 'aac']);
const FORMAT_IMG = new Set(['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg']);
const FORMAT_VIDEO = new Set(['m4v', 'avi', 'mpg', 'mp4', 'webm']);

const iconUrl = (icon: string) => `/assets/icons/files/${icon}.svg`;

// ----------------------------------------------------------------------

export function fileFormat(fileUrl: string | undefined) {
  let format;

  switch (fileUrl?.includes(fileTypeByUrl(fileUrl))) {
    case FORMAT_TEXT.has(fileTypeByUrl(fileUrl)): {
      format = 'txt';
      break;
    }
    case FORMAT_ZIP.has(fileTypeByUrl(fileUrl)): {
      format = 'zip';
      break;
    }
    case FORMAT_AUDIO.has(fileTypeByUrl(fileUrl)): {
      format = 'audio';
      break;
    }
    case FORMAT_IMG.has(fileTypeByUrl(fileUrl)): {
      format = 'image';
      break;
    }
    case FORMAT_VIDEO.has(fileTypeByUrl(fileUrl)): {
      format = 'video';
      break;
    }
    case FORMAT_WORD.has(fileTypeByUrl(fileUrl)): {
      format = 'word';
      break;
    }
    case FORMAT_EXCEL.has(fileTypeByUrl(fileUrl)): {
      format = 'excel';
      break;
    }
    case FORMAT_POWERPOINT.has(fileTypeByUrl(fileUrl)): {
      format = 'powerpoint';
      break;
    }
    case FORMAT_PDF.has(fileTypeByUrl(fileUrl)): {
      format = 'pdf';
      break;
    }
    case FORMAT_PHOTOSHOP.has(fileTypeByUrl(fileUrl)): {
      format = 'photoshop';
      break;
    }
    case FORMAT_ILLUSTRATOR.has(fileTypeByUrl(fileUrl)): {
      format = 'illustrator';
      break;
    }
    default: {
      format = fileTypeByUrl(fileUrl);
    }
  }

  return format;
}

// ----------------------------------------------------------------------

export function fileThumb(fileUrl: string) {
  let thumb;

  switch (fileFormat(fileUrl)) {
    case 'folder': {
      thumb = iconUrl('ic_folder');
      break;
    }
    case 'txt': {
      thumb = iconUrl('ic_txt');
      break;
    }
    case 'zip': {
      thumb = iconUrl('ic_zip');
      break;
    }
    case 'audio': {
      thumb = iconUrl('ic_audio');
      break;
    }
    case 'video': {
      thumb = iconUrl('ic_video');
      break;
    }
    case 'word': {
      thumb = iconUrl('ic_word');
      break;
    }
    case 'excel': {
      thumb = iconUrl('ic_excel');
      break;
    }
    case 'powerpoint': {
      thumb = iconUrl('ic_power_point');
      break;
    }
    case 'pdf': {
      thumb = iconUrl('ic_pdf');
      break;
    }
    case 'photoshop': {
      thumb = iconUrl('ic_pts');
      break;
    }
    case 'illustrator': {
      thumb = iconUrl('ic_ai');
      break;
    }
    case 'image': {
      thumb = iconUrl('ic_img');
      break;
    }
    default: {
      thumb = iconUrl('ic_file');
    }
  }
  return thumb;
}

// ----------------------------------------------------------------------

export function fileTypeByUrl(fileUrl = '') {
  return fileUrl?.split('.').pop() || '';
}

// ----------------------------------------------------------------------

export function fileNameByUrl(fileUrl: string) {
  return fileUrl.split('/').pop();
}

// ----------------------------------------------------------------------

export function fileData(file: ExtendFile | string) {
  // Url
  if (typeof file === 'string') {
    return {
      key: file,
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
    };
  }

  // File
  return {
    key: file.preview,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}
