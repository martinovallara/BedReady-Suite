


let jsonResponseCache: string | undefined = undefined;

export function getJsonResponseCache(): string | undefined {
    return jsonResponseCache;
}

export function setJsonResponseCache(jsonResponse: string) {
    jsonResponseCache = jsonResponse;
}

export function clearJsonResponseCache() {
    jsonResponseCache = undefined;
}