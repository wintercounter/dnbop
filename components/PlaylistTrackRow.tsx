import { MouseEventHandler, useState } from 'react'
import { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'
import clsx from 'clsx'
import { useParams } from 'next/navigation'

import useArtists from '@/hooks/useArtists'
import { IconLoading3Quarters, IconPauseFill, IconPlayFill, IconSpotify } from '@/components/icons'

const PlayButton = ({ playing, loading }: { playing?: boolean; loading?: boolean }) => {
    return (
        <figure className={'text-[26px] inline-flex items-center justify-center w-[30px] h-[30px] mr-[15px]'}>
            {playing ? <IconPauseFill /> : <IconPlayFill />}
            {loading && <IconLoading3Quarters className={'absolute animate-spin text-[36px] text-secondary'} />}
        </figure>
    )
}

export default function PlaylistTrackRow({
    item: { track },
    onClick,
    playing,
    href
}: {
    item: PlaylistedTrack
    playing?: boolean
    onClick?: MouseEventHandler<HTMLAnchorElement>
    href?: string
}) {
    const artist = useArtists((track as Track).artists)
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const isCurrentTrack = params.playlist?.[1] === track.id || playing

    const handleClick: MouseEventHandler<HTMLAnchorElement> = ev => {
        if (!isCurrentTrack) {
            setLoading(true)
        }

        onClick?.(ev)
    }

    return (
        <article
            className={clsx('common-box common-box-hover relative !p-0', {
                '!border-primary': playing
            })}
        >
            <a className={'p-2 flex flex-row items-center'} href={href} onClick={handleClick}>
                <PlayButton playing={playing} loading={loading} />
                <h2 className={'max-w-[calc(100%_-_120px)]'}>
                    {track.name}
                    <br /> <span className={'text-gray-500'}>{artist}</span>
                </h2>
            </a>
            {track.id && (
                <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    title={'Open in Spotify'}
                    target={'_blank'}
                    className={
                        'absolute top-[50%] right-[1rem] text-[26px] translate-y-[-50%] hover:text-spotify z-[1] transition'
                    }
                >
                    <IconSpotify />
                </a>
            )}
        </article>
    )
}
