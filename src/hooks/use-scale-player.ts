
'use client';

import { useRef, useCallback } from 'react';
import { useMute } from './use-mute';

// Frequencies for "Jana Gana Mana" based on Sargam notes
const C4 = 261.63; // Sa
const D4 = 293.66; // Re
const E4 = 329.63; // Ga
const F4 = 349.23; // Ma
const G4 = 392.00; // Pa
const A4 = 440.00; // Dha
const Bb4 = 466.16; // Komal Ni
const B4 = 493.88; // Shuddha Ni
const C5 = 523.25; // Sa (Higher Octave)

const Ni_low = 246.94; // Komal Ni (Lower Octave) - B3

const scaleFrequencies = [
    // Jana Gana Mana Adhinayaka Jaya He: Sa Re Ga Ga Ga Ga Ga Re Ga Ma
    C4, D4, E4, E4, E4, E4, E4, D4, E4, F4,
    // Bharatha Bhagya Vidhatha: Ga Ga Ga Re Re Re Ni(low) Re Sa
    E4, E4, E4, D4, D4, D4, Ni_low, D4, C4,
    // Punjaba Sindhu Gujaratha Maratha: Sa Pa Pa Pa Pa Pa Ma Dha Pa
    C4, G4, G4, G4, G4, G4, F4, A4, G4,
    // Dravida Utkala Vanga: Ma Ma Ma Ga Ga Ga Re Ma Ga
    F4, F4, F4, E4, E4, E4, D4, F4, E4,
    // Vindhya Himaachala Yamuna Ganga: Ga Ga Ga Ga Ga Pa Pa Pa Ma Ma
    E4, E4, E4, E4, E4, G4, G4, G4, F4, F4,
    // Uchchala Jaladhi Taranga: Ga Ga Ga Re Re Re Ni(low) Re Sa
    E4, E4, E4, D4, D4, D4, Ni_low, D4, C4,
    // Tava Shubha Name Jage: Sa Re Ga Ga Ga Ga Re Ga Ma
    C4, D4, E4, E4, E4, E4, D4, E4, F4,
    // Tava Shubha Ashisha Mage: Ga Ma Pa Pa Pa Ma Ga Re Ma Ga
    E4, F4, G4, G4, G4, F4, E4, D4, F4, E4,

    // Gahe Tava Jaya Gatha: Ga Ga Re Re Re Re Ni(low) Re Sa -- (This seems to repeat a previous line, let's use the line from the prompt)
    // Actually the prompt says Gahe Tava Jaya Gatha: Ga Ga Re Re Re Re Ni Re Sa
    E4, E4, D4, D4, D4, D4, Ni_low, D4, C4,

    // Jana Gana Mangala Daayaka Jaya He: Pa Pa Pa Pa Pa Pa Ma Dha Pa
    G4, G4, G4, G4, G4, G4, F4, A4, G4,
    // Bharatha Bhagya Vidhatha: Ma Ma Ma Ga Ga Ga Re Ma Ga
    F4, F4, F4, E4, E4, E4, D4, F4, E4,
    // Jaya He, Jaya He, Jaya He: NiNi Sa', NiDha Ni, DhaPa Dha
    B4, B4, C5, B4, A4, B4, A4, G4, A4,
    // Jaya Jaya Jaya Jaya He: SaSa ReRe GaGa ReGa Ma
    C4, C4, D4, D4, E4, E4, D4, E4, F4
];

export function useScalePlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { isMuted } = useMute();

  const initializeAudioContext = useCallback(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }
  }, []);

  const playNote = useCallback((noteIndex: number) => {
    if (isMuted) return;

    initializeAudioContext();
    const audioContext = audioContextRef.current;
    
    if (!audioContext) {
      console.error('Web Audio API is not supported in this browser.');
      return;
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    const frequency = scaleFrequencies[noteIndex % scaleFrequencies.length];

    // --- Main Sitar Oscillator (Fundamental Tone) ---
    const mainOscillator = audioContext.createOscillator();
    mainOscillator.type = 'triangle'; // Triangle wave for a strong but rounded fundamental
    mainOscillator.frequency.setValueAtTime(frequency, now);

    const mainGain = audioContext.createGain();
    mainGain.gain.setValueAtTime(0, now);
    // Quick attack, then decay to a sustain level
    mainGain.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick pluck
    mainGain.gain.exponentialRampToValueAtTime(0.1, now + 0.5); // Decay
    mainGain.gain.linearRampToValueAtTime(0.0001, now + 2.5); // Long release/sustain

    mainOscillator.connect(mainGain);
    mainGain.connect(audioContext.destination);

    // --- Harmonic Oscillator (Sitar's Brightness & Jivari) ---
    const harmonicOscillator = audioContext.createOscillator();
    harmonicOscillator.type = 'sawtooth'; // Sawtooth for rich, bright harmonics
    harmonicOscillator.frequency.setValueAtTime(frequency, now);
    harmonicOscillator.detune.setValueAtTime(3, now); // Slight detune for the "jivari" shimmer effect

    const harmonicGain = audioContext.createGain();
    harmonicGain.gain.setValueAtTime(0, now);
    // Envelope mimics the main oscillator but at a lower volume
    harmonicGain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.05, now + 0.7);
    harmonicGain.gain.linearRampToValueAtTime(0.0001, now + 2.5);

    harmonicOscillator.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    
    // Start and stop the sound
    mainOscillator.start(now);
    harmonicOscillator.start(now);
    mainOscillator.stop(now + 2.6);
    harmonicOscillator.stop(now + 2.6);

  }, [initializeAudioContext, isMuted]);

  return playNote;
}
