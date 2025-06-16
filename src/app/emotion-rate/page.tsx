'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from "next/image";
import Angry_Face from "../../../public/assets/faces/Face (6).svg";
import Sad_Face from "../../../public/assets/faces/Face (1).svg";
import Neutral_Face from "../../../public/assets/faces/Face (2).svg";
import Content_Face from "../../../public/assets/faces/Face (3).svg";
import Happy_Face from "../../../public/assets/faces/Face (4).svg";
import Awe_Face from "../../../public/assets/faces/Face (5).svg";
import Link from "next/link";
import { gsap } from "gsap";  
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

type Mood = {
  id: number;
  name: string;
  icon: string;
};

// Emotion data for each mood
const emotionStages: Record<string, string[]> = {
  angry: ["Irritated", "Frustrated", "Annoyed", "Aggravated", "Hostile", "Enraged", "Furious", "Livid", "Outraged"],
  sad: ["Disappointed", "Lonely", "Gloomy", "Miserable", "Heartbroken", "Despairing", "Grief-stricken", "Devastated"],
  neutral: ["Calm", "Balanced", "Composed", "Unemotional", "Detached", "Indifferent", "Apathetic"],
  content: ["Pleased", "Satisfied", "Comfortable", "At ease", "Serene", "Tranquil", "Peaceful"],
  happy: ["Cheerful", "Joyful", "Delighted", "Excited", "Elated", "Ecstatic", "Euphoric"],
  awe: ["Amazed", "Wonderstruck", "Inspired", "Overwhelmed", "Reverent", "Transfixed", "Humbled"]
};

const moodIcons: Record<string, StaticImageData> = {
  angry: Angry_Face,
  sad: Sad_Face,
  neutral: Neutral_Face,
  content: Content_Face,
  happy: Happy_Face,
  awe: Awe_Face
};

const moodDescriptions: Record<string, string> = {
  angry: "Anger is a complex emotion that can range from mild irritation to intense fury",
  sad: "Sadness is a natural emotion that helps us process loss and disappointment",
  neutral: "Neutral feelings represent a balanced emotional state",
  content: "Contentment is a peaceful state of satisfaction and ease",
  happy: "Happiness brings positive energy and feelings of joy",
  awe: "Awe is the feeling of being in the presence of something vast that transcends our understanding"
};

export default function EmotionRatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    SplitText.create(".split", {
      type: "lines",
      autoSplit: true,
      onSplit: (self) => {
        return gsap.from(self.lines, {
          y: 100,
          opacity: 0,
          stagger: 0.05
        });
      }
    });
  },[])

  useEffect(() => {
    const moodsParam = searchParams.get('moods');
    const indexParam = searchParams.get('currentIndex');
    
    if (moodsParam) {
      try {
        const parsedMoods: Mood[] = JSON.parse(decodeURIComponent(moodsParam));
        setMoods(parsedMoods);
        setCurrentIndex(indexParam ? parseInt(indexParam) : 0);
      } catch (error) {
        console.error('Error parsing moods:', error);
      }
    }
  }, [searchParams]);

  const currentMood = moods[currentIndex];
  const currentMoodName = currentMood?.name.toLowerCase() || 'neutral';
  const currentMoodStages = emotionStages[currentMoodName] || [];
  const MoodIcon = moodIcons[currentMoodName] || Neutral_Face;

  const handleNext = async () => {
    setIsSubmitting(true);
    
    try {
      await fetch('/api/save-rating', {
        method: 'POST',
        body: JSON.stringify({
          moodId: currentMood.id,
          rating,
          stage: selectedStage
        }),
      });

      if (currentIndex < moods.length - 1) {
        router.push(`/emotion-rate?currentIndex=${currentIndex + 1}&moods=${encodeURIComponent(JSON.stringify(moods))}`);
      } else {
        router.push(`/emotion-description?moods=${encodeURIComponent(JSON.stringify(moods))}`);
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      if (currentIndex < moods.length - 1) {
        router.push(`/emotion-rate?currentIndex=${currentIndex + 1}&moods=${encodeURIComponent(JSON.stringify(moods))}`);
      } else {
        router.push(`/emotion-description?moods=${encodeURIComponent(JSON.stringify(moods))}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      router.push(`/emotion-rate?currentIndex=${currentIndex - 1}&moods=${encodeURIComponent(JSON.stringify(moods))}`);
    }
  };

  if (!currentMood) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="min-h-screen relative flex flex-col justify-center items-center font-montserrat gap-10 py-4 px-6 md:py-12">
      <div className="max-w-5xl p-10 max-sm:p-6 max-lg:p-10 backdrop-blur-xl bg-white/30 rounded-3xl border-2">
        <div className="flex flex-col gap-6 text-center text-black">
          {/* Progress indicator */}
          {moods.length > 1 && (
            <div className="mb-4">
              <p className="text-sm font-semibold">
                Mood {currentIndex + 1} of {moods.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-[#A44167] h-2.5 rounded-full" 
                  style={{ width: `${((currentIndex + 1) / moods.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <h1 className="text-3xl max-sm:text-xl max-md:text-2xl font-bold text-[#3E4352]">
            {moodDescriptions[currentMoodName] || "Rate your current feeling"}
          </h1>
          <h2 className="text-2xl max-sm:text-xl font-semibold text-[#3E4352]">
            No matter how you&apos;re feeling, it&apos;s okay. We&apos;re here to support you.
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-center items-center">
              <Image src={MoodIcon} alt={`${currentMood.name} Face`} width={120} height={120} />
            </div>
            
            <div id="slider" className="flex justify-center flex-col items-center gap-4">
            <input 
  type="range" 
  min="1" 
  max="10" 
  value={rating}
  onChange={(e) => setRating(parseInt(e.target.value))}
  className={`w-full max-w-md h-[40px] rounded-[5rem] appearance-none bg-transparent 
    /* Track styling */
    [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-full
    ${
      currentMoodName === 'angry' ? '[&::-webkit-slider-runnable-track]:bg-[#FF483E] [&::-webkit-slider-runnable-track]:border-[#FFD700]' :
      currentMoodName === 'sad' ? '[&::-webkit-slider-runnable-track]:bg-[#5D8BF4] [&::-webkit-slider-runnable-track]:border-[#FFD700]' :
      currentMoodName === 'neutral' ? '[&::-webkit-slider-runnable-track]:bg-[#86FFD1] [&::-webkit-slider-runnable-track]:border-[#FFD700]' :
      currentMoodName === 'content' ? '[&::-webkit-slider-runnable-track]:bg-[#FFB766] [&::-webkit-slider-runnable-track]:border-[#FFD700]' :
      currentMoodName === 'happy' ? '[&::-webkit-slider-runnable-track]:bg-[#2BD515] [&::-webkit-slider-runnable-track]:border-[#FFD700]' :
      '[&::-webkit-slider-runnable-track]:bg-[#9C27B0]'
    }
    
    /* Thumb (dragging element) styling */
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-[80px] 
    [&::-webkit-slider-thumb]:w-[20px]
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:border-3px
    [&::-webkit-slider-thumb]:shadow-md
    [&::-webkit-slider-thumb]:cursor-grab
    [&::-webkit-slider-thumb]:active:cursor-grabbing
    [&::-webkit-slider-thumb]:transition-all
    [&::-webkit-slider-thumb]:duration-100
    [&::-webkit-slider-thumb]:transform
    [&::-webkit-slider-thumb]:-translate-y-1/4
    [&::-webkit-slider-thumb]:active:scale-110
    [&::-webkit-slider-thumb]:active:shadow-lg
    
    /* Mood-specific thumb border colors */
    ${
      currentMoodName === 'angry' ? '[&::-webkit-slider-thumb]:bg-[#FF483E]' :
      currentMoodName === 'sad' ? '[&::-webkit-slider-thumb]:bg-[#5D8BF4]' :
      currentMoodName === 'neutral' ? '[&::-webkit-slider-thumb]:bg-[#64F9FF]' :
      currentMoodName === 'content' ? '[&::-webkit-slider-thumb]:bg-[#FFB766]' :
      currentMoodName === 'happy' ? '[&::-webkit-slider-thumb]:bg-[#A8FF97]' :
      '[&::-webkit-slider-thumb]:bg-[#F766FF]'
    }
  `}
/>
              <div className="text-center font-semibold text-xl">
                Intensity: {rating}/10
              </div>
            </div>
            
            {currentMoodStages.length > 0 && (
              <>
                <p className="font-semibold text-2xl max-sm:text-lg max-md:text-xl text-[#3E4352] mt-4 text-left max-md:text-center">
                  What stage is your {currentMoodName} in?
                </p>
                <div className="flex flex-wrap gap-4 max-sm:gap-2 justify-center">
                  {currentMoodStages.map((stage, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedStage(stage)}
                      className={`p-2 px-4 border rounded-[5rem] font-bold text-neutral-600 transition-colors
                        ${selectedStage === stage ? 
                          'bg-[#A44167] text-white border-[#A44167]' : 
                          'hover:bg-[#A44167]/20 hover:border-[#A44167]'}`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 max-sm:flex-col">
        {currentIndex === 0 ? (
          <Link
            href="/mood-selection"
            className="text-[#A44167] bg-white text-2xl font-semibold md:w-sm py-4 rounded-[5rem] text-center px-8"
          >
            Change Moods
          </Link>
        ) : (
          <button
            onClick={handlePrevious}
            className="text-[#A44167] bg-white text-2xl font-semibold md:w-sm py-4 rounded-[5rem] text-center px-8"
          >
            Previous Mood
          </button>
        )}
        
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="text-white bg-[#A44167] text-2xl font-semibold md:w-sm py-4 rounded-[5rem] text-center px-8"
        >
          {isSubmitting ? 'Processing...' : 
           currentIndex < moods.length - 1 ? 'Next Mood' : 'Complete'}
        </button>
      </div>
    </section>
  );
}