'use client'

import Image from 'next/image'
import { Playlist, PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import { usePathname, useRouter } from 'next/navigation'
import { MouseEventHandler } from 'react'
import clsx from 'clsx'

import PlaylistTrackRow from '@/components/PlaylistTrackRow'
import { usePlayerContext } from '@/contexts/Player'

function PlaylistView({
    item,
    tracks = [],
    title = true,
    expanded = false,
    selectedTrackId
}: {
    item: Playlist & { vol?: number }
    tracks?: PlaylistedTrack[]
    title?: boolean | string
    expanded?: boolean
    selectedTrackId?: string
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [{ playing, api }, setPlayerState] = usePlayerContext()
    const firstItem = tracks.at(-1) as PlaylistedTrack
    const updatedAt = new Date(firstItem.added_at)
    const formattedUpdatedAt = updatedAt.toISOString().split('T')[0]
    const handleClick: MouseEventHandler<HTMLAnchorElement> = ev => {
        ev.preventDefault()

        const trackId = ev.currentTarget.href.split('/').pop()

        router.push(ev.currentTarget.href, {
            scroll: !pathname.startsWith('/playlist')
        })

        if (trackId === selectedTrackId) {
            if (playing) {
                api.pauseVideo()
            } else {
                api.playVideo()
            }
        } else {
            setPlayerState(prevState => ({
                ...prevState,
                ready: false
            }))
        }
    }

    return (
        <article className={'flex flex-col sm:flex-row w-full space-around gap-[15px] common-box-flat'}>
            <div
                className={'flex flex-col items-center sm:sticky sm:items-start top-[1rem] h-fit sm:w-[300px] shrink-0'}
            >
                {title && (
                    <h1 className={'w-fit uppercase font-[800] text-[32px] rainbow-text whitespace-nowrap uppercase'}>
                        {typeof title === 'string' ? title : `Vol ${item.vol}`}
                    </h1>
                )}
                <time className={'text-gray-600 mb-[15px]'}>Updated at {formattedUpdatedAt}</time>
                <Image
                    src={item.images[0].url}
                    alt={item.name}
                    width={item.images[0].width}
                    height={item.images[0].height}
                    loading={'lazy'}
                    className={'w-full max-w-[300px] max-h-[300px] common-box !p-0'}
                />
            </div>
            <div
                className={clsx('flex flex-col grow', {
                    'max-h-[300px]': !expanded
                })}
            >
                <div
                    className={clsx('max-h-full', {
                        'overflow-auto': !expanded
                    })}
                >
                    <div className={'flex flex-col-reverse gap-[8px]'}>
                        {tracks.map((trackItem, index) => {
                            const isPlaying =
                                playing &&
                                (selectedTrackId === trackItem.track.id ||
                                    selectedTrackId === (index as unknown as string))
                            return (
                                <PlaylistTrackRow
                                    key={trackItem.track.id || trackItem.track.name}
                                    item={trackItem}
                                    playing={isPlaying}
                                    href={`/playlist/${item.id}/${trackItem.track.id || index}`}
                                    onClick={handleClick}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PlaylistView
