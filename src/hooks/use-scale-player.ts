
'use client';

import { useRef, useCallback } from 'react';
import { useMute } from './use-mute';

// Frequencies for "Jana Gana Mana"
const scaleFrequencies = [
  // Jana Gana Mana Adhinayaka Jaya He
  261.63, // C4 - Ja na
  293.66, // D4 - Ga na
  329.63, // E4 - Ma na
  329.63, // E4 - A dhi
  329.63, // E4 - na ya
  329.63, // E4 - ka
  349.23, // F4 - Ja ya
  329.63, // E4 - He
  // Bharata Bhagya Vidhata
  293.66, // D4 - Bha ra
  293.66, // D4 - ta
  329.63, // E4 - Bha gya
  261.63, // C4 - Vi dha
  246.94, // B3 - ta
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
    // Use the provided index, wrapping around if it's out of bounds
    const frequency = scaleFrequencies[noteIndex % scaleFrequencies.length];

    // Main oscillator for the fundamental tone
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Changed to sine for a softer tone
    oscillator.frequency.setValueAtTime(frequency, now);

    // Second oscillator for harmonic complexity (sitar-like shimmer)
    const subOscillator = audioContext.createOscillator();
    subOscillator.type = 'triangle';
    subOscillator.frequency.setValueAtTime(frequency, now);
    subOscillator.detune.setValueAtTime(5, now); // Reduced detune for subtlety

    // Gain node for the main oscillator
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02); // Reduced gain
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    // Gain node for the sub-oscillator (less volume)
    const subGainNode = audioContext.createGain();
    subGainNode.gain.setValueAtTime(0, now);
    subGainNode.gain.linearRampToValueAtTime(0.1, now + 0.02); // Reduced gain
    subGainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.7); 

    // Connect nodes
    oscillator.connect(gainNode);
    subOscillator.connect(subGainNode);
    gainNode.connect(audioContext.destination);
    subGainNode.connect(audioContext.destination);

    // Start and stop the sound
    oscillator.start(now);
    subOscillator.start(now);
    oscillator.stop(now + 1.8);
    subOscillator.stop(now + 1.8);
  }, [initializeAudioContext, isMuted]);

  return playNote;
}
