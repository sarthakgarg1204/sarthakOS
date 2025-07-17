// utils/folderUtils.ts
export const getNewFolders = () => {
  const stored = localStorage.getItem('new_folders');
  return stored ? JSON.parse(stored) : [];
};

export const addNewFolderToStorage = (name: string) => {
  const folders = getNewFolders();
  const id = `new-folder-${name.replace(/\s+/g, '-').toLowerCase()}`;
  folders.push({ id, name });
  localStorage.setItem('new_folders', JSON.stringify(folders));
  return { id, name };
};
