import axios from 'axios'

const CLOUD_URL = 'https://api.cloudinary.com/v1_1/'

export const uploadImageToCloudinary = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string)
    formData.append('folder', 'petvet')

    const { data } = await axios.post(`${CLOUD_URL}${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData)

    return data.secure_url as string
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Error uploading image')
  }
}