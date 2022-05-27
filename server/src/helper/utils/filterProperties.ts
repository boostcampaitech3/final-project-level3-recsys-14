export const filterProperites = function <T>(data: T, filter: string[]) {
    return Object.fromEntries(
        Object.entries(data).filter(
            ([key, _]) => filter.includes(key)
        )
    )
};