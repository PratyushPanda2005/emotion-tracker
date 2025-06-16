"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Angry_Face from "../../../public/assets/faces/Face (6).svg";
import Sad_Face from "../../../public/assets/faces/Face (1).svg";
import Neutral_Face from "../../../public/assets/faces/Face (2).svg";
import Content_Face from "../../../public/assets/faces/Face (3).svg";
import Happy_Face from "../../../public/assets/faces/Face (4).svg";
import Awe_Face from "../../../public/assets/faces/Face (5).svg";
import Link from "next/link";

type Mood = {
  id: number;
  name: string;
  icon: string; // This will be the mood name in lowercase
};

// Map mood names to their corresponding icons
const moodIcons: Record<string, StaticImageData> = {
  angry: Angry_Face,
  sad: Sad_Face,
  neutral: Neutral_Face,
  content: Content_Face,
  happy: Happy_Face,
  awe: Awe_Face,
};

export default function EmotionDescription() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [moods, setMoods] = useState<Mood[]>([]);
  // const [description, setDescription] = useState("");

  useEffect(() => {
    const moodsParam = searchParams.get("moods");
    if (moodsParam) {
      try {
        const parsedMoods: Mood[] = JSON.parse(decodeURIComponent(moodsParam));
        setMoods(parsedMoods);
      } catch (error) {
        console.error("Error parsing moods:", error);
      }
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    try {
      // Save the description with all moods
      await fetch("/api/save-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moods,
          // description,
          timestamp: new Date().toISOString(),
        }),
      });
  
      // Redirect to activity page
      router.push(`/activity-page?moods=${encodeURIComponent(JSON.stringify(moods))}`);
    } catch (error) {
      console.error("Error submitting description:", error);
      // Fallback navigation
      router.push(`/activity-page?moods=${encodeURIComponent(JSON.stringify(moods))}`);
    }
  };

  return (
    <section className="min-h-screen relative flex flex-col justify-center items-center font-montserrat gap-10 p-6">
      <div className="max-w-5xl p-20 max-sm:p-6 max-lg:p-10 backdrop-blur-xl bg-white/30 rounded-3xl border-2">
        <div className="flex flex-col gap-10 text-center text-black">
          <h1 className="text-3xl max-sm:text-xl font-bold text-[#3E4352]">
            What is making you feel this way?
          </h1>

          <textarea
            name=""
            id=""
            className="border-2 rounded-3xl max-w-2xl p-4 font-semibold text-xl"
            placeholder="I feel this way because"
          />
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-6">
              <div className="font-semibold text-xl text-[#3E4352] text-left flex gap-2">
              {moods.map((mood) => {
               return (
                 <li key={mood.id} className="flex items-center p-2">
                   {mood.name}
                 </li>
               );
             })}
              </div>
           
              <div className="text-left flex gap-3">
                <p>Annoyed</p>
                <p>Fed Up</p>
              </div>
            </div>
            <div className="flex">
              {moods.map((mood) => {
                const moodName = mood.name.toLowerCase();
                const MoodIcon = moodIcons[moodName] || Neutral_Face;

                return (
                  <li key={mood.id} className="flex items-center p-2">
                    <div className="flex-shrink-0">
                      <Image
                        src={MoodIcon}
                        alt={`${mood.name} icon`}
                        className="w-10 h-10"
                      />
                    </div>
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <Link onClick={handleSubmit}
          href="/activity-page"
          className="text-white bg-[#A44167] text-2xl max-sm:text-xl font-semibold md:w-sm py-4 px-8 rounded-[5rem] text-center"
        >
          Complete
        </Link>
      </div>
    </section>
  );
}

{
  /* <div className="flex">
{moods.map((mood) => {
  const moodName = mood.name.toLowerCase();
  const MoodIcon = moodIcons[moodName] || Neutral_Face;

  return (
    <li key={mood.id} className="flex items-center p-2">
      <div className="flex-shrink-0">
        <Image
          src={MoodIcon}
          alt={`${mood.name} icon`}
          className="w-10 h-10"
        />
      </div>
    </li>
  );
})}
</div> */
}
