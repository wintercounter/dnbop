'use client'

import { PlayerContextProvider } from '@/contexts/Player'
import PlaylistView from '@/components/PlaylistView'
import { Playlist, PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import Player from './player'
import { useParams, useRouter } from 'next/navigation'

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
    const params = useParams()

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
                        const currentTrackIndex =
                            tracks.findIndex(item => item.track.id === params.playlist[1]) ||
                            (params?.playlist?.[1] as unknown as number)

                        if (currentTrackIndex) {
                            const nextTrack = tracks[currentTrackIndex - 1]

                            if (nextTrack) {
                                router.push(`/playlist/${playlistData.id}/${nextTrack.track.id}`, { scroll: false })
                            }
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
