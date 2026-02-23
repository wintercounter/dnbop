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
    return (
        <Link
            className={clsx(
                'flex common-box common-box-hover',
                {
                    '!border-primary': selected,
                    'rainbow-text': selected,
                    uppercase: selected,
                    'font-bold': selected
                },
                className
            )}
            href={`/playlist/${id}`}
        >
            {title}
        </Link>
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
