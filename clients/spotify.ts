import { SpotifyApi, Playlist } from '@spotify/web-api-ts-sdk'
import { revalidateTag, revalidatePath } from 'next/cache'

let sdk: SpotifyApi | null = null

let creationTime = new Date().getTime()
const getSdkInstance = async (force?: boolean): Promise<SpotifyApi> => {
    let hasError = false
    if (new Date().getTime() - creationTime > 3600 * 1000 || !sdk) {
        sdk = SpotifyApi.withClientCredentials(
            process.env.SPOTIFY_CLIENT_ID as string,
            process.env.SPOTIFY_CLIENT_SECRET as string,
            [],
            {
                fetch: (req, init) => {
                    return fetch(req, {
                        ...init,
                        next: { revalidate: 3600, tags: ['spotify'] }
                    }).catch(err => {
                        revalidateTag('spotify')
                        hasError = true
                        throw err
                    })
                }
            }
        )
        creationTime = new Date().getTime()
    }
    if (hasError) {
        return await getSdkInstance(force)
    }
    return sdk
}

const LIMIT = 40

export type ExtendedPlaylist = Playlist & { vol?: number }

type ALL_RESULTS = {
    vols: ExtendedPlaylist[]
    allstars: Playlist
}

export const getAllPlaylists = async (): Promise<ALL_RESULTS> => {
    const playlists: Playlist[] = []
    let offset = 0
    const sdk = await getSdkInstance()
    while (true) {
        const { items, next } = await sdk.playlists.getUsersPlaylists(process.env.SPOTIFY_USERNAME, LIMIT, offset)
        playlists.push(...items)
        if (next) {
            offset += LIMIT
        } else {
            break
        }
    }

    const results: ALL_RESULTS = playlists
        .filter(item => /^Drum and/.test(item.name))
        .reduce(
            (acc, item) => {
                if (item.name.includes('Allstars')) {
                    return {
                        ...acc,
                        allstars: item
                    }
                } else {
                    item.name = item.name.replace('Dubtep', 'Dubstep')
                    return {
                        ...acc,
                        vols: [...acc.vols, item]
                    }
                }
            },
            {
                vols: []
            } as unknown as ALL_RESULTS
        )

    results.vols = results.vols
        .filter(({ name }) => /^Drum and Bass Dubstep Electro Vol/.test(name))
        .sort((a, b) => {
            // @ts-ignore
            const aNum = parseInt(a.name.match(/\d/g).join(''))
            // @ts-ignore
            const bNum = parseInt(b.name.match(/\d/g).join(''))
            a.vol = aNum
            b.vol = bNum
            return bNum - aNum
        })

    return results
}

export default getSdkInstance
