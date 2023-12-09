

export type ParsedTable = {
    gameName: string;
    tableRegion: Number;
    tableId: Number;
}

export const tableUrlParse = (url: string): ParsedTable => {
    const parser = new URL(url);
    const paths = parser.pathname.split('/')
    const params = parser.searchParams
    return {
        gameName: paths[2],
        tableRegion: Number(paths[1]),
        tableId: Number(params.get('table')),
    }
}