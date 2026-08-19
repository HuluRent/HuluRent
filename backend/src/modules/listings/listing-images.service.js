async function uploadImage(file) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return `/uploads/${file.filename}`;
}

async function uploadImages(files) {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
}

module.exports = {
  uploadImage,
  uploadImages
};
