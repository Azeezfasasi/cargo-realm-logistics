// Resize a photo in the browser and return a JPEG data URL, so uploads stay small
// (phone photos are often 5-10 MB; Vercel rejects request bodies over 4.5 MB).
export async function compressImage(file, { maxDimension = 1600, quality = 0.8 } = {}) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read this image.'));
      el.src = url;
    });

    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // flatten transparent PNGs onto white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
