import { useEffect } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'

import usePlayer from './hooks/usePlayer'

import {
  playerSourceAtom,
  playerVolumeAtom,
  playerMutedAtom,
} from './atoms/player'
import {
  audioMomentsAtom,
  generateRandomAudioMomentsAtom,
  removeActualAudioMomentAtom,
  audioMomentShouldUnpauseAtom,
  audioMomentShouldPlayAtom,
} from './atoms/audioMoments'
import {
  timerIsRunningAtom,
  startTimerAtom,
  pauseTimerAtom,
  resetTimerAtom,
  timerCanResetAtom,
  timeTickingEffect,
} from './atoms/timer'

import cn from './lib/cn'

import { MediaPlayer, MediaProvider } from '@vidstack/react'
import '@vidstack/react/player/styles/base.css'

import {
  AudioOrVideoSourceInput,
  Button,
  StartOrPauseTimerButton,
  Timer,
  VolumeControl,
} from './components'

import { useTranslation } from 'react-i18next'

import { FaGithub } from 'react-icons/fa'

export default function App() {
  const {
    player,
    playerPaused,
    playerCurrentTime,
    playerDuration,
    playerCanPlay,
    resumePlayer,
    pausePlayer,
    resetPlayerCurrentTime,
    resetPlayer,
  } = usePlayer()

  const [playerSource, setPlayerSource] = useAtom(playerSourceAtom)
  const playerVolume = useAtomValue(playerVolumeAtom)
  const playerMuted = useAtomValue(playerMutedAtom)

  const audioMoments = useAtomValue(audioMomentsAtom)
  const generateRandomAudioMoments = useSetAtom(generateRandomAudioMomentsAtom)
  const removeActualAudioMoment = useSetAtom(removeActualAudioMomentAtom)
  const resetAudioMoments = useResetAtom(audioMomentsAtom)
  const [audioMomentShouldUnpause, setAudioMomentShouldUnpause] = useAtom(
    audioMomentShouldUnpauseAtom,
  )
  const audioMomentShouldPlay = useAtomValue(audioMomentShouldPlayAtom)

  const timerIsRunning = useAtomValue(timerIsRunningAtom)
  const startTimer = useSetAtom(startTimerAtom)
  const pauseTimer = useSetAtom(pauseTimerAtom)
  const resetTimer = useSetAtom(resetTimerAtom)
  const timerCanReset = useAtomValue(timerCanResetAtom)
  useAtom(timeTickingEffect)

  const { t, i18n } = useTranslation('', { keyPrefix: 'app' })

  function handleAudioOrVideoSourceInputChange(input: string | File): void {
    resetTimer()
    if (playerSource !== '') {
      resetAudioMoments()
      pausePlayer()
      resetPlayerCurrentTime()
    }

    setPlayerSource(input)
  }

  function handleStartTimer(): void {
    startTimer()
    if (playerPaused && audioMomentShouldUnpause) {
      resumePlayer()
      setAudioMomentShouldUnpause(false)
    }
  }

  function handlePauseTimer(): void {
    pauseTimer()
    if (!playerPaused) {
      pausePlayer()
      setAudioMomentShouldUnpause(true)
    }
  }

  function handleStartOrPauseTimerButtonClick(): void {
    if (!audioMoments) generateRandomAudioMoments(playerDuration)

    if (timerIsRunning) {
      handlePauseTimer()
      return
    }

    handleStartTimer()
  }

  function handleResetTimerButtonClick(): void {
    resetTimer()

    if (playerCurrentTime > 0) {
      resetPlayer()
      resetAudioMoments()
    }
  }

  useEffect(() => {
    function handleAudioMoments() {
      if (audioMomentShouldPlay) {
        resumePlayer()
        removeActualAudioMoment()
      }
    }

    handleAudioMoments()
  }, [audioMomentShouldPlay, resumePlayer, removeActualAudioMoment])

  useEffect(() => {
    document.title = t('pageTitle')
    document.documentElement.lang = i18n.language
  }, [t, i18n.language])

  return (
    <main
      className={cn(
        'flex h-screen flex-col items-center justify-center sm:gap-40',
        'bg-[#FFD700] pb-[env(safe-area-inset-bottom)] sm:pb-[calc(env(safe-area-inset-bottom)+8rem)]',
      )}
    >
      <h1
        className={cn(
          'font-[Baloo] text-xl font-bold text-[#333333] shadow-black sm:text-3xl md:text-4xl lg:text-6xl',
          'pb-8 drop-shadow sm:pb-0',
        )}
      >
        {t('title')}
      </h1>
      <section className='flex flex-col items-center gap-12'>
        <Timer className='sm:mb-10' />
        <VolumeControl />
        <AudioOrVideoSourceInput
          onChange={handleAudioOrVideoSourceInputChange}
        />
        <div className='flex gap-4'>
          <StartOrPauseTimerButton
            disabled={!playerCanPlay}
            onClick={handleStartOrPauseTimerButtonClick}
          />
          <Button
            className={cn(
              'bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500',
            )}
            disabled={!timerCanReset}
            onClick={handleResetTimerButtonClick}
          >
            {t('resetButton')}
          </Button>
        </div>
      </section>
      <div className='absolute bottom-0 -z-50 opacity-0'>
        <MediaPlayer
          src={playerSource}
          ref={player}
          volume={playerVolume}
          muted={playerMuted}
          onEnd={resetPlayer}
        >
          <MediaProvider />
        </MediaPlayer>
      </div>
      <a
        className='absolute right-5 top-4 hidden sm:block'
        target='_blank'
        rel='noopener noreferrer'
        href='https://github.com/ZaikoXander/HoraDeSilencioInterrompido'
      >
        <FaGithub size={40} />
      </a>
    </main>
  )
}
