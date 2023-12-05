"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/JO1Z5J3ewhA
 */

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaBowlFood,
  FaBasketball,
  FaBath,
  FaFaceSadCry,
  FaChartArea,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import { death, idle } from "./tamagotchiFrames";
import { MdLocalHospital } from "react-icons/md";
import { INTERACTION } from "@/app/utils/interaction";

const DEFAULT_STATUS = ":)";
export function TamagotchiNewUI() {
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [tamagotchiState, setTamagotchiState] = useState<any>({});
  const [animation, setAnimation] = useState<string[]>(idle);
  const [tamaStatus, setTamaStatus] = useState(DEFAULT_STATUS);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  //TODO - call init endpoint to determine if tamagotchi is initialized. if not generate one.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getState", { method: "POST" });
        if (response.ok) {
          const jsonData = await response.json();
          if (!!!jsonData.comment) {
            jsonData.comment = "No comments";
          }
          setTamagotchiState(jsonData);
          console.log(jsonData);
          handleDeath(jsonData, pollInterval);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Cycle through frames every 1 second
    const frameInterval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % idle.length);
    }, 1000);

    // Fetch data on component mount
    fetchData();

    // Start polling data every N seconds (adjust the interval as needed)
    const pollInterval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval);
      clearInterval(frameInterval);
    };
  }, []);

  const handleResponse = (responseText: string) => {
    const responseJSON = JSON.parse(responseText);
    const animation = JSON.parse(responseJSON.animation);
    const status = responseJSON.status;
    setFrameIndex(0);
    setAnimation(animation);
    setTamaStatus(status);
  };

  const handleDeath = (jsonData: any, pollInterval: NodeJS.Timer) => {
    if (jsonData.death) {
      setAnimation(death);
      setTamaStatus("Dead :(");
      clearInterval(pollInterval);
    }
  };

  const handleBath = async () => {
    setIsInteracting(true);
    setTamaStatus("Bathing...");
    try {
      const response = await fetch("/api/interact", {
        method: "POST",
        body: JSON.stringify({
          interactionType: INTERACTION.BATH,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseText = await response.text();
      handleResponse(responseText);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      setAnimation(idle);
      setTamaStatus(DEFAULT_STATUS);
      setIsInteracting(false);
    }, 9000);
  };

  const feedTamagotchi = async (e: any) => {
    setIsInteracting(true);
    // Add logic to feed the Tamagotchi here
    setTamaStatus("Feeding...");
    try {
      const response = await fetch("/api/interact", {
        method: "POST",
        body: JSON.stringify({
          interactionType: INTERACTION.FEED,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseText = await response.text();
      handleResponse(responseText);
    } catch (e) {
      console.log(e);
    }

    console.log("Tamagotchi fed!");

    // TODO - there may be a race condition here if user clicks the button too fast?
    setTimeout(() => {
      setAnimation(idle);
      setTamaStatus(DEFAULT_STATUS);
      setIsInteracting(false);
    }, 9000);
  };

  const playWithTamagotchi = async (e: any) => {
    // Add logic to feed the Tamagotchi here
    setTamaStatus("Playing...");
    setIsInteracting(true);
    try {
      const response = await fetch("/api/interact", {
        method: "POST",
        body: JSON.stringify({
          interactionType: INTERACTION.PLAY,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseText = await response.text();
      handleResponse(responseText);
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => {
      setAnimation(idle);
      setTamaStatus(DEFAULT_STATUS);
      setIsInteracting(false);
    }, 9000);
  };

  const treatSickTamagotchi = async (e: any) => {
    setIsInteracting(true);
    try {
      const response = await fetch("/api/interact", {
        method: "POST",
        body: JSON.stringify({
          interactionType: INTERACTION.GO_TO_HOSPITAL,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseText = await response.text();
      handleResponse(responseText);
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => {
      setAnimation(idle);
      setTamaStatus(DEFAULT_STATUS);
      setIsInteracting(false);
    }, 9000);
  };

  const handleDiscipline = async () => {
    setTamaStatus("Discipling...");
    setIsInteracting(true);
    try {
      const response = await fetch("/api/interact", {
        method: "POST",
        body: JSON.stringify({
          interactionType: INTERACTION.DISCIPLINE,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseText = await response.text();
      handleResponse(responseText);
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => {
      setAnimation(idle);
      setTamaStatus(DEFAULT_STATUS);
      setIsInteracting(false);
    }, 9000);
  };

  const checkStatus = () => {
    if (!isInteracting) {
      setTamaStatus("Checking Status...");
      setCheckingStatus(true);
      setTimeout(() => {
        setCheckingStatus(false);
      }, 9000);
    }
  };

  let needForBath = "";
  for (let i = 0; i < tamagotchiState.poop; i++) {
    needForBath += "💩";
  }
  return (
    <Card key="1" className="w-full max-w-xl p-6 space-y-6 bg-white">
      <CardHeader className="items-center space-y-2">
        <CardTitle className="text-xl">AI Tamagotchi</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Care for your virtual pet!
        </CardDescription>
        <div className="flex justify-center">
          <div className="flex items-center justify-center h-48 overflow-hidden">
            {!checkingStatus && (
              <div>
                <pre className="text-center">{animation[frameIndex]}</pre>
                <div>{needForBath}</div>
              </div>
            )}

            {checkingStatus && (
              <pre
                className="text-left overflow-x-hidden overflow-y-auto whitespace-normal"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              >
                Age: {tamagotchiState.age || "No age"} <br />
                Happiness: {tamagotchiState.happiness || "No happiness"} <br />
                Hunger: {tamagotchiState.hunger || "No hunger"} <br />
                Health: {tamagotchiState.health || "No health"} <br />
                🚽: {tamagotchiState.poop || "👍"} <br />
                {'"' + tamagotchiState.comment || "No comments" + '"'}
              </pre>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button
          onClick={feedTamagotchi}
          className="flex items-center justify-center"
          variant="outline"
        >
          <FaBowlFood /> &nbsp; Feed
        </Button>
        <Button
          onClick={playWithTamagotchi}
          className="flex items-center justify-center"
          variant="outline"
        >
          <FaBasketball /> &nbsp; Play
        </Button>
        <Button
          onClick={handleBath}
          className="flex items-center justify-center"
          variant="outline"
        >
          <FaBath />
          &nbsp; Clean
        </Button>
        <Button
          onClick={handleDiscipline}
          className="flex items-center justify-center"
          variant="outline"
        >
          <FaFaceSadCry /> &nbsp; Discipline
        </Button>
        <Button
          onClick={checkStatus}
          className="flex items-center justify-center"
          variant="outline"
        >
          <FaChartArea /> &nbsp; Status
        </Button>
        <Button
          onClick={treatSickTamagotchi}
          className="flex items-center justify-center"
          variant="outline"
        >
          <MdLocalHospital /> &nbsp; Medical Care
        </Button>
      </CardContent>
      <CardFooter className="py-4 dark:bg-gray-800 rounded-b-lg border-t-2 border-gray-200 dark:border-gray-700">
        <div className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400">
          {tamaStatus}
        </div>
      </CardFooter>
    </Card>
  );
}
