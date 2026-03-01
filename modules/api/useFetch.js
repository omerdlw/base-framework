'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { BaseService } from '@/services/base.service'

/**
 * Merkezi Data Fetching Hook'u
 * Özel servis katmanından { data, error, loading, status } yanıtını alır.
 * 
 * @param {string} endpoint - İstek atılacak API endpoint'i
 * @param {object} options - Özel ayarlar (method, body, headers, manual vb.)
 * @returns {{ data: any, error: string|null, loading: boolean, status: number|null, refresh: Function }}
 */
export function useFetch(endpoint, options = {}) {
    const { manual = false, ...requestOptions } = options

    const [state, setState] = useState({
        data: null,
        error: null,
        loading: !manual, // Eğer manual değilse hook çağrıldığı an fetch işlemi başlayacağı için loading true olur.
        status: null,
    })

    // Ayarların değişimini gereksiz refetch'leri önlemek adına referans olarak tutabiliriz
    const optionsRef = useRef(requestOptions)
    useEffect(() => {
        optionsRef.current = requestOptions
    }, [requestOptions])

    const execute = useCallback(
        async (overrideOptions = {}) => {
            setState((prev) => ({ ...prev, loading: true, error: null }))

            const combinedOptions = {
                ...optionsRef.current,
                ...overrideOptions,
            }

            // Bind the retry action to THIS execute method so local loading and error states update
            combinedOptions.retryCallback = () => execute(overrideOptions)

            const finalEndpoint = combinedOptions.endpoint || endpoint

            const result = await BaseService.request(finalEndpoint, combinedOptions)

            setState({
                data: result.data,
                error: result.error,
                loading: result.loading, // false
                status: result.status,
            })

            return result
        },
        [endpoint]
    )

    useEffect(() => {
        if (!manual) {
            execute()
        }
    }, [execute, manual])

    return {
        ...state,
        refresh: execute,
    }
}
