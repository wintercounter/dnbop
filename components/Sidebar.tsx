import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { ExtendedPlaylist } from '@/clients/spotify'
import { IconClose, IconHamburgerMenu } from '@/components/icons'

type SidebarItemProps = {
    title: string
    id: string
    selected: boolean
    className?: string
}

const SidebarItem = ({ title, id, selected, className }: SidebarItemProps) => {
    const normalizedTitle = String(title)
    const isAllstars = normalizedTitle.toLowerCase() === 'allstars'

    return (
        <article
            className={clsx(
                'relative flex common-box common-box-hover items-center',
                {
                    '!border-primary': selected,
                    'rainbow-text': selected && !isAllstars,
                    uppercase: selected,
                    'font-bold': selected,
                    'allstars-item': isAllstars
                },
                className
            )}
        >
            <Link
                href={`/playlist/${id}`}
                className={clsx('block w-full text-center', {
                    'allstars-item-link': isAllstars
                })}
                title={`Open ${title}`}
                aria-label={`Open ${title}`}
            >
                {isAllstars ? (
                    <span className={'allstars-title-wrap'}>
                        <span className={'allstars-star allstars-star-left'} aria-hidden>
                            ✦
                        </span>
                        <span className={'allstars-title-text'}>{normalizedTitle}</span>
                        <span className={'allstars-star allstars-star-right'} aria-hidden>
                            ✦
                        </span>
                    </span>
                ) : (
                    normalizedTitle
                )}
            </Link>
        </article>
    )
}

type SidebarProps = {
    vols: ExtendedPlaylist[]
    allstars: ExtendedPlaylist
    selectedPlaylistId: string
}

export default function Sidebar({ vols, allstars, selectedPlaylistId }: SidebarProps) {
    const [latestVol, ...restVols] = vols

    return (
        <aside className={'common-box-flat w-full xl:w-[360px] shrink-0'}>
            <input type={'checkbox'} id={'sidebar-toggle'} className={'hidden'} />
            <header className={'relative flex xl:my-[50px] text-center'}>
                <Link href={'/'} title={'DNBOP.com'} className={'xl:flex xl:basis-full place-content-center'}>
                    <Image
                        src={'/logo_new.png'}
                        alt={'DNBOP.com'}
                        width={256}
                        height={173}
                        className={'w-[60px] xl:w-[256px]'}
                    />
                </Link>
                <label htmlFor={'sidebar-toggle'} className={'sidebar-toggle-button text-[40px] xl:hidden ml-auto'}>
                    <IconHamburgerMenu className={'sidebar-open'} />
                    <IconClose className={'sidebar-close'} />
                </label>
            </header>
            <section
                className={
                    'hidden sidebar-menu mt-[15px] xl:mt-0 xl:sticky top-[15px] xl:!flex flex-cols flex-wrap gap-[8px] space-around'
                }
            >
                <SidebarItem
                    title={`Volume ${latestVol.vol} - Latest`}
                    id={latestVol.id}
                    selected={selectedPlaylistId === latestVol.id}
                    className={'basis-[100%] place-content-center'}
                />

                <SidebarItem
                    title={`Allstars`}
                    id={allstars.id}
                    selected={selectedPlaylistId === allstars.id}
                    className={'basis-[100%] place-content-center'}
                />

                {restVols.map(vol => {
                    return (
                        <SidebarItem
                            key={vol.id}
                            title={vol.vol as unknown as string}
                            id={vol.id}
                            selected={selectedPlaylistId === vol.id}
                            className={'basis-[10%] place-content-center flex-grow'}
                        />
                    )
                })}
            </section>
        </aside>
    )
}
