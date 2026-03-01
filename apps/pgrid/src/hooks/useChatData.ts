import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useElysiaClient } from '@/providers/elysiaProvider';

export interface ApiKey {
    id: string;
    name: string;
    apiKey: string;
    lastUsed: Date | null;
    creditsConsumed: number;
    disabled: boolean;
}

export interface Model {
    id: string;
    name: string;
    slug: string;
    company: {
        id: string;
        name: string;
        website: string;
    };
}

export interface Provider {
    id: string;
    providerId: string;
    provider: {
        id: string;
        name: string;
        website: string;
    };
    inputTokenCost: number;
    outputTokenCost: number;
}

export function useChatData() {
    const client = useElysiaClient();

    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedApiKeyId, setSelectedApiKeyId] = useState<string>('');
    const [selectedModelId, setSelectedModelId] = useState<string>('');
    const [provider, setProvider] = useState<Provider | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingProvider, setIsLoadingProvider] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cache provider results by model ID to avoid redundant fetches
    const providerCache = useRef<Map<string, Provider>>(new Map());

    // Fetch API keys and models on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoadingInitial(true);
                setError(null);

                const [apiKeysRes, modelsRes] = await Promise.all([
                    client['api-keys'].get(),
                    client['models'].get(),
                ]);

                if (apiKeysRes.data && 'apiKeys' in apiKeysRes.data) {
                    const activeKeys = (apiKeysRes.data.apiKeys as ApiKey[]).filter(
                        (k) => !k.disabled
                    );
                    setApiKeys(activeKeys);
                    if (activeKeys.length > 0) {
                        setSelectedApiKeyId(activeKeys[0].id);
                    }
                }

                if (modelsRes.data && 'models' in modelsRes.data) {
                    const fetchedModels = modelsRes.data.models as Model[];
                    setModels(fetchedModels);
                    if (fetchedModels.length > 0) {
                        setSelectedModelId(fetchedModels[0].id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch initial data:', err);
                setError('Failed to load API keys and models. Please refresh.');
            } finally {
                setIsLoadingInitial(false);
            }
        };

        fetchInitialData();
    }, [client]);

    // Fetch provider when selected model changes
    const getProviderForModel = useCallback(
        async (modelId: string) => {
            if (!modelId) {
                setProvider(null);
                return;
            }

            // Check cache first
            const cached = providerCache.current.get(modelId);
            if (cached) {
                setProvider(cached);
                return;
            }

            try {
                setIsLoadingProvider(true);
                const res = await (client['models'] as any)[modelId]['provider'].get();

                if (res.data && 'modelprovider' in res.data) {
                    const providerData = res.data.modelprovider as Provider;
                    providerCache.current.set(modelId, providerData);
                    setProvider(providerData);
                } else {
                    setProvider(null);
                }
            } catch (err) {
                console.error('Failed to fetch provider for model:', err);
                setProvider(null);
            } finally {
                setIsLoadingProvider(false);
            }
        },
        [client]
    );

    // Auto-fetch provider when model selection changes
    useEffect(() => {
        if (selectedModelId) {
            getProviderForModel(selectedModelId);
        }
    }, [selectedModelId, getProviderForModel]);

    // The selected API key object (full record)
    const selectedApiKey = useMemo(
        () => apiKeys.find((k) => k.id === selectedApiKeyId) ?? null,
        [apiKeys, selectedApiKeyId]
    );

    // The selected model object (full record)
    const selectedModel = useMemo(
        () => models.find((m) => m.id === selectedModelId) ?? null,
        [models, selectedModelId]
    );

    return {
        // Data
        apiKeys,
        models,
        provider,
        selectedApiKey,
        selectedModel,

        // Selection handlers
        selectedApiKeyId,
        setSelectedApiKeyId,
        selectedModelId,
        setSelectedModelId,

        // Loading & error
        isLoadingInitial,
        isLoadingProvider,
        error,
    };
}
