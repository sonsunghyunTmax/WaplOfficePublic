import sha256 from 'crypto-js/sha256';

export function imageToThumbnailFile(srcUrl: string): Promise<{ file: File; uniqueID: string }> {
  return new Promise(resolve => {
    const image = document.createElement('img');
    image.crossOrigin = 'Anonymous';
    image.onload = e => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const canvasDataURL = canvas.toDataURL('image/png');
      const uniqueID = sha256(canvasDataURL).toString();
      const blob = dataURItoBlob(canvasDataURL);
      const file = new File([blob], `thumbnailImage.png`, { type: `image/png` });
      resolve({ uniqueID, file });
    };
    image.src = srcUrl;
  });
}

export function videoToThumbnailFile(
  video: HTMLVideoElement
): Promise<{ file: File; uniqueID: string }> {
  return new Promise(resolve => {
    const copyVideo = video;
    copyVideo.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = copyVideo.videoWidth;
      canvas.height = copyVideo.videoHeight;
      canvas.getContext('2d')?.drawImage(copyVideo, 0, 0, canvas.width, canvas.height);
      const canvasDataURL = canvas.toDataURL('image/png');
      const uniqueID = sha256(canvasDataURL).toString();
      const blob = dataURItoBlob(canvasDataURL);
      const file = new File([blob], `thumbnailImage.png`, { type: `image/png` });
      resolve({ uniqueID, file });
    });
    copyVideo.currentTime = 0;
  });
}

export const dataURItoBlob = (dataURI: string): Blob => {
  const byteString = window.atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ia], { type: mimeString });
  return blob;
};
