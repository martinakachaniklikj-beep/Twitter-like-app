import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { storage } from '../lib/firebase';

const MAX_SIZE = 2 * 1024 * 1024;

const validateImage = (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('Image must be under 2MB');
  }
};

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  validateImage(file);

  const storageRef = ref(storage, `avatars/${userId}/${Date.now()}-${file.name}`);

  const snapshot = await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

export const uploadCover = async (file: File, userId: string): Promise<string> => {
  validateImage(file);

  const storageRef = ref(storage, `covers/${userId}/${Date.now()}-${file.name}`);

  const snapshot = await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

export const uploadPostImage = async (file: File, userId: string) => {
  validateImage(file);

  const imageRef = ref(storage, `posts/${userId}/${Date.now()}`);

  await uploadBytes(imageRef, file);

  return getDownloadURL(imageRef);
};

export const deleteImageByUrl = async (url: string) => {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
};
