'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import Angry_Face from "../../../public/assets/faces/Face (6).svg";
import Sad_Face from "../../../public/assets/faces/Face (1).svg";
import Neutral_Face from "../../../public/assets/faces/Face (2).svg";
import Content_Face from "../../../public/assets/faces/Face (3).svg";
import Happy_Face from "../../../public/assets/faces/Face (4).svg";
import Awe_Face from "../../../public/assets/faces/Face (5).svg";
import Link from 'next/link';

type Mood = {
  id: number;
  name: string;
  icon: StaticImageData;
};

const moodIcons: Record<string, StaticImageData> = {
  angry: Angry_Face,
  sad: Sad_Face,
  neutral: Neutral_Face,
  content: Content_Face,
  happy: Happy_Face,
  awe: Awe_Face,
};

// Array of diverse activities
const ACTIVITIES = [
  "Yoga", "Meditation", "Reading", "Journaling", "Running",
  "Cycling", "Swimming", "Painting", "Drawing", "Photography",
  "Cooking", "Baking", "Gardening", "Hiking", "Dancing",
  "Singing", "Playing music", "Writing", "Knitting", "Pottery",
  "Chess", "Board games", "Puzzles", "Volunteering", "Socializing",
  "Movie night", "Stargazing", "Museum visit", "Learning language",
  "Coding", "Woodworking", "Fishing", "Birdwatching", "Shopping",
  "Spa day", "Massage", "Nap", "Deep breathing", "Mindfulness"
];

export default function ActivityPage() {
  const searchParams = useSearchParams();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [randomActivities, setRandomActivities] = useState<string[]>([]);

  useEffect(() => {
    const moodsParam = searchParams.get('moods');
    if (moodsParam) {
      try {
        const parsedMoods: Mood[] = JSON.parse(decodeURIComponent(moodsParam));
        setMoods(parsedMoods);
        
        // Generate mood-specific activities if needed
        const moodSpecificActivities = getMoodSpecificActivities(parsedMoods);
        setRandomActivities(moodSpecificActivities);
      } catch (error) {
        console.error('Error parsing moods:', error);
      }
    }
  }, [searchParams]);

  // Get activities based on moods
  const getMoodSpecificActivities = (currentMoods: Mood[]) => {
    const moodActivityMap: Record<string, string[]> = {
      angry: ["Boxing", "Running", "Screaming into pillow", "Intense workout"],
      sad: ["Calling a friend", "Watching comedy", "Pet therapy", "Baking cookies"],
      happy: ["Dancing", "Celebrating", "Sharing with friends", "Helping others"],
      content: ["Reading", "Gardening", "Painting", "Journaling"],
      neutral: ["Meditation", "Walking", "People watching", "Listening to music"],
      awe: ["Stargazing", "Museum visit", "Nature walk", "Photography"]
    };

    // Get all unique activities from all selected moods
    const allActivities = currentMoods.flatMap(mood => 
      moodActivityMap[mood.name.toLowerCase()] || []
    );

    // Combine with general activities and shuffle
    const combined = [...new Set([...allActivities, ...ACTIVITIES])];
    return shuffleArray(combined).slice(0, 15); // Get 15 random activities
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivities(prev => {
      if (prev.includes(activity)) {
        return prev.filter(a => a !== activity);
      } else if (prev.length < 5) {
        return [...prev, activity];
      }
      return prev;
    });
  };

  return (
    <section className="min-h-screen relative flex flex-col justify-center items-center font-montserrat gap-10 px-6 py-10">
      <div className="max-w-5xl p-20 max-sm:p-6 max-lg:p-10 backdrop-blur-xl bg-white/30 rounded-3xl border-2">
        <div className="flex flex-col gap-10 text-center text-black">
          <h1 className="text-3xl font-bold text-[#3E4352]">
            What did you do today?
          </h1>

          <div className='flex flex-col gap-6'>
            <h1>Choose up to 5 activities</h1>
            <div className='flex flex-wrap gap-3 w-full justify-center'>
              {randomActivities.map((activity, index) => (
                <button
                  key={index}
                  onClick={() => handleActivitySelect(activity)}
                  className={`text-lg font-semibold p-3 rounded-2xl border-2 transition-all ${
                    selectedActivities.includes(activity)
                      ? 'bg-[#A44167]/20 border-[#A44167]'
                      : 'hover:bg-white/20'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
            {selectedActivities.length > 0 && (
              <p className="font-semibold">
                Selected: {selectedActivities.join(', ')}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-6">
              <div className="font-semibold text-xl text-[#3E4352] text-left flex gap-2">
                {moods.map((mood) => (
                  <span key={mood.id} className="flex items-center p-2">
                    {mood.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex">
              {moods.map((mood) => {
                const moodName = mood.name.toLowerCase();
                const MoodIcon = moodIcons[moodName] || Neutral_Face;

                return (
                  <div key={mood.id} className="flex items-center p-2">
                    <Image
                      src={MoodIcon}
                      alt={`${mood.name} icon`}
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <Link
          href={{
            pathname: "/final-page",
            query: {
              moods: encodeURIComponent(JSON.stringify(moods)),
              activities: encodeURIComponent(JSON.stringify(selectedActivities))
            }
          }}
          className={`text-white bg-[#A44167] text-2xl max-sm:text-xl font-semibold md:w-sm py-4 rounded-[5rem] text-center px-8 ${
            selectedActivities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Complete
        </Link>
      </div>
    </section>
  );
}