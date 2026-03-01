'use client'

import React from 'react'
import { useFetch } from '@/modules/api'

export default function TestApiPage() {
    const { data, error, loading, status, refresh } = useFetch('https://jsonplaceholder.typicode.com/todos/1', {
        manual: true
    })

    // Using raw refresh for custom configurations
    // Adding sleep and CORS so that we can clearly see the "Loading: True" state when retrying
    const doSilentError = () => refresh({ endpoint: 'https://httpstat.us/404?sleep=1000', silent: true })
    const doNonCriticalError = () => refresh({ endpoint: 'https://httpstat.us/404?sleep=1000', critical: false })
    const doCriticalError = () => refresh({ endpoint: 'https://httpstat.us/404?sleep=1000', critical: true })

    const doBatchError = () => {
        refresh({ endpoint: 'https://httpstat.us/404?sleep=500&mock=1', critical: true })
        refresh({ endpoint: 'https://httpstat.us/404?sleep=600&mock=2', critical: true })
        refresh({ endpoint: 'https://httpstat.us/404?sleep=700&mock=3', critical: true })
    }

    const [shouldCrash, setShouldCrash] = React.useState(false)

    if (shouldCrash) {
        throw new Error('Test component render error! (Simulated Page Crash)')
    }

    return (
        <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
            <h1>API Error Handling Test</h1>

            <div style={{ marginBottom: 20, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => refresh()}>Fetch Success</button>
                <button onClick={doSilentError}>Silent Error (No UI)</button>
                <button onClick={doNonCriticalError}>Non-Critical Error (Toast Only)</button>
                <button onClick={doCriticalError}>Critical Error (Nav Card)</button>
                <button onClick={doBatchError}>Batch Error (3 Requests)</button>

                <hr style={{ width: '100%', margin: '10px 0' }} />

                <button onClick={() => setShouldCrash(true)} style={{ background: '#ffeeee', color: 'red', border: '1px solid red' }}>
                    Trigger Page Crash (Test ErrorBoundary)
                </button>
            </div>

            <div style={{ padding: 20, borderRadius: 8, background: '#f5f5f5', color: '#000' }}>
                <p><strong>Loading:</strong> {loading ? 'True' : 'False'}</p>
                <p><strong>Status:</strong> {status || 'N/A'}</p>
                <p><strong>Error:</strong> {error ? error : 'None'}</p>
                <p><strong>Data:</strong></p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    )
}
