import {saveAs} from 'file-saver';

export const TEXT_MIME = 'text/plain;charset=utf-8';

export const FileUtils = {
  downloadAsJson(data, fileName) {
    const asSting = JSON.stringify(data, null, '\t');
    const blob = new Blob([asSting], { type: TEXT_MIME });
    saveAs(blob, fileName);
  }
};

export default FileUtils;