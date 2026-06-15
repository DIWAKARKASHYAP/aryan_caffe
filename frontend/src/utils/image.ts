const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file'))
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('Image must be under 3MB'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}
