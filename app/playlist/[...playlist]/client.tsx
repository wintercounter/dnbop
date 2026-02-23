'use client'

import { PlayerContextProvider } from '@/contexts/Player'
import PlaylistView from '@/components/PlaylistView'
import { Playlist, PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import Player from './player'
import { useRouter } from 'next/navigation'

export default function Client({
    playlistData,
    youtubeId,
    tracks,
    selectedTrackId
}: {
    playlistData: Playlist
    youtubeId: string | null
    tracks: PlaylistedTrack[]
    selectedTrackId?: string
}) {
    const router = useRouter()

    const resolveTrackIndex = () => {
        const currentTrack = selectedTrackId || ''
        const byId = tracks.findIndex(item => item.track.id === currentTrack)

        if (byId >= 0) {
            return byId
        }

        const byIndex = Number.parseInt(currentTrack, 10)
        if (!Number.isNaN(byIndex) && byIndex >= 0 && byIndex < tracks.length) {
            return byIndex
        }

        return -1
    }

    return (
        <PlayerContextProvider>
            {youtubeId && (
                <Player
                    videoId={youtubeId}
                    opts={{
                        playerVars: {
                            autoplay: 1
                        }
                    }}
                    onEnd={() => {
                        const currentTrackIndex = resolveTrackIndex()
                        if (currentTrackIndex <= 0) {
                            return
                        }

                        const nextTrackIndex = currentTrackIndex - 1
                        const nextTrack = tracks[nextTrackIndex]

                        if (nextTrack) {
                            const nextTrackSlug = nextTrack.track.id || String(nextTrackIndex)
                            router.push(`/playlist/${playlistData.id}/${nextTrackSlug}`, { scroll: false })
                        }
                    }}
                />
            )}
            <PlaylistView
                item={playlistData as Playlist}
                tracks={tracks}
                expanded
                title={playlistData.name.includes('Allstars') ? 'Allstars' : undefined}
                selectedTrackId={selectedTrackId}
            />
        </PlayerContextProvider>
    )
}
