import { atom, useAtom } from 'jotai'

import { useTranslation } from 'react-i18next'

import cn from '../../lib/cn'

import extractYoutubeVideoId from '../../utils/extractYoutubeVideoId'

const sourceAtom = atom<string>('')

interface YoutubeVideoUrlInputProps {
  onChange?: (youtubeVideoUrl: string) => void
}

export default function YoutubeVideoUrlInput({
  onChange,
}: YoutubeVideoUrlInputProps) {
  const [source, setSource] = useAtom(sourceAtom)

  const { t } = useTranslation('', { keyPrefix: 'youtubeVideoUrlInput' })

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const url = event.target.value
    const id = extractYoutubeVideoId(url)
    if (!id) return

    const newSource = `youtube/${id}`
    if (newSource === source) return

    setSource(newSource)
    onChange?.(newSource)
  }

  return (
    <input
      type='url'
      className={cn(
        'rounded border border-gray-300 px-4 py-2 font-[Inter] text-2xl',
        'font-semibold outline-none focus:border focus:border-blue-500',
        'w-64 focus:ring-2 focus:ring-blue-500 sm:w-full',
      )}
      placeholder={t('placeholder')}
      onChange={handleInputChange}
    />
  )
}
