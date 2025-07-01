import { useEffect, useState, useRef } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

interface FetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export const useFetch = <T> (url: string, options: AxiosRequestConfig = {}): FetchResult<T> => {
  const cache = useRef<Record<string, T>>({})
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!url) return

    let ignore = false
    setLoading(true)
    setError(null)

    const fetchData = async () => {
      if (cache.current[url]) {
        setData(cache.current[url])
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get<T>(url, options)
        cache.current[url] = data // Guarda en caché

        if (!ignore) setData(data)
      } catch (err) {
        if (!ignore) setError(err as Error)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [url, options])

  return { data, loading, error }
}