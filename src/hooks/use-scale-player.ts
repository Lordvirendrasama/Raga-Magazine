
'use client';

import { useRef, useCallback } from 'react';
import { useMute } from './use-mute';

// Frequencies for "Jana Gana Mana"
const scaleFrequencies = [
    // Jana Gana Mana Adhinayaka Jaya He
    261.63, 293.66, 329.63, 329.63, 329.63, 329.63, 349.23, 329.63, 293.66, 293.66, 329.63, 261.63, 246.94,
    // Bharata Bhagya Vidhata
    246.94, 261.63, 293.66, 293.66, 293.66, 293.66, 329.63, 293.66, 261.63,
    // Punjab Sindhu Gujarata Maratha
    392.00, 392.00, 392.00, 392.00, 392.00, 440.00, 392.00, 349.23, 329.63,
    // Dravida Utkala Banga
    329.63, 329.63, 349.23, 392.00, 329.63, 293.66, 261.63,
    // Vindhya Himachala Yamuna Ganga
    261.63, 293.66, 329.63, 329.63, 329.63, 329.63, 329.63, 349.23, 329.63,
    // Uchchala Jaladhi Taranga
    293.66, 293.66, 329.63, 261.63, 246.94,
    // Tava Shubha Name Jage
    246.94, 261.63, 293.66, 293.66, 293.66,
    // Tava Shubha Ashisa Mage
    293.66, 329.63, 293.66, 261.63,
    // Gahe Tava Jaya Gatha
    392.00, 392.00, 349.23, 329.63,
    // Jana Gana Mangala Dayaka Jaya He
    329.63, 329.63, 329.63, 349.23, 392.00, 329.63, 293.66, 261.63,
    // Bharata Bhagya Vidhata
    246.94, 261.63, 293.66, 293.66, 293.66,
    // Jaya He, Jaya He, Jaya He
    493.88, 493.88, 493.88, 440.00, 440.00, 440.00, 392.00, 392.00, 392.00,
    // Jaya Jaya Jaya, Jaya He
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25
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
