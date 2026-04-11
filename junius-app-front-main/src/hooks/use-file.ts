import { useState, useCallback } from 'react';

export function useFile(multiple = false) {
  const [files, setFiles] = useState<(File | string)[]>([]);

  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      const newData = [
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        }),
      ];

      setFiles(newData);
      return newData[0];
    }
    return [];
  }, []);

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      const newData = [
        ...files,
        ...acceptedFiles.map(newFile =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          }),
        ),
      ];
      setFiles(newData);
      return newData;
    },
    [files],
  );

  const handleDropFile = useCallback(
    (acceptedFiles: File[]) =>
      multiple
        ? handleDropMultiFile(acceptedFiles)
        : handleDropSingleFile(acceptedFiles),
    [multiple, handleDropSingleFile, handleDropMultiFile],
  );

  const handleRemoveMultiFile = (inputFile: File | string) => {
    const filesFiltered = files.filter(
      fileFiltered => fileFiltered !== inputFile,
    );
    setFiles(filesFiltered);
    return filesFiltered;
  };

  const handleClearFiles = () => {
    setFiles([]);
    return [];
  };

  const handleRemoveFile = (inputFile: File | string) =>
    multiple ? handleRemoveMultiFile(inputFile) : handleClearFiles();

  return {
    files,
    setFiles,
    handleDropFile,
    handleRemoveFile,
    handleClearFiles,
  };
}
