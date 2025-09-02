import { useState, useEffect, useCallback, useRef } from 'react';

// A prioritized list of high-quality voices. The hook will try to use the first one it finds.
const PREFERRED_VOICES = [
  'Google US English', // High-quality voice on Chrome
  'Alex', // Default high-quality on macOS
  'Samantha', // Common high-quality voice
  'Daniel', // Common high-quality UK voice
  'Microsoft David - English (United States)', // Windows default
];

export const useSpeechSynthesis = (text: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Use a ref to hold the utterance to avoid stale closures in event handlers
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Effect to select the best available voice
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return; // Voices not ready

      let bestVoice: SpeechSynthesisVoice | null = null;

      for (const voiceName of PREFERRED_VOICES) {
        const foundVoice = voices.find(v => v.name === voiceName);
        if (foundVoice) {
          bestVoice = foundVoice;
          break;
        }
      }

      // Fallback to the first available US or UK English voice if no preferred voice is found
      if (!bestVoice) {
        bestVoice = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') || voices[0];
      }
      
      setSelectedVoice(bestVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Effect to split text into sentences and reset state
  useEffect(() => {
    if (text) {
      // Split by sentences, keeping the punctuation. Filter out empty strings.
      const sentencesArray = text.match(/[^.!?]+[.!?]+/g) || [text];
      setSentences(sentencesArray.map(s => s.trim()).filter(Boolean));
      setCurrentSentenceIndex(0);
      
      // Stop any ongoing speech when text changes
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    } else {
      setSentences([]);
    }
  }, [text]);

  // The main function to speak a sentence
  const speakSentence = useCallback((index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !selectedVoice || index >= sentences.length) {
      setIsSpeaking(false);
      return;
    }
    
    const synth = window.speechSynthesis;
    const sentence = sentences[index];
    const u = new SpeechSynthesisUtterance(sentence);
    utteranceRef.current = u;
    
    u.voice = selectedVoice;
    // Add subtle, more natural variations
    u.pitch = 1.0 + (Math.random() * 0.2 - 0.1); // range 0.9 to 1.1
    u.rate = 1.0; 

    u.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    u.onpause = () => {
      setIsPaused(true);
    };
    
    u.onresume = () => {
      setIsPaused(false);
    };

    u.onend = () => {
      if (index < sentences.length - 1) {
        setCurrentSentenceIndex(index + 1);
        speakSentence(index + 1);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentSentenceIndex(0); // Reset for next play
      }
    };

    // Safety check to prevent speaking over something else
    if (synth.speaking) {
      synth.cancel();
    }
    
    synth.speak(u);

  }, [sentences, selectedVoice]);

  const play = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || sentences.length === 0) return;
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else {
      // Cancel anything currently speaking to start fresh
      if(synth.speaking) synth.cancel();
      speakSentence(currentSentenceIndex);
    }
  }, [speakSentence, isPaused, currentSentenceIndex, sentences]);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
  }, []);

  // Ensure state is correctly reset if speech is cancelled externally
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const onSpeakingChange = () => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          if (isSpeaking) {
            setIsSpeaking(false);
            setIsPaused(false);
          }
      }
    };
    const timer = setInterval(onSpeakingChange, 250);
    return () => clearInterval(timer);
  }, [isSpeaking]);

  return { play, pause, stop, isSpeaking, isPaused };
};
