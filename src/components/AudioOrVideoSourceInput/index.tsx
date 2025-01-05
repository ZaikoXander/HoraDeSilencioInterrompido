import FileInputButton from './FileInputButton'
import YoutubeVideoUrlInput from './YoutubeVideoUrlInput'

import { useTranslation } from 'react-i18next'

interface AudioOrVideoInputProps {
  onChange?: (input: string | File) => void
}

export default function AudioOrVideoSourceInput({
  onChange,
}: AudioOrVideoInputProps) {
  const { t } = useTranslation('', { keyPrefix: 'audioOrVideoSourceInput' })

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center justify-between gap-4 sm:pr-4'>
        <FileInputButton onChange={onChange} />
        <span className='font-[Inter] text-2xl font-semibold'>
          {t('audioOrVideoSourceInputSpan')}
        </span>
      </div>
      <YoutubeVideoUrlInput onChange={onChange} />
    </div>
  )
}
