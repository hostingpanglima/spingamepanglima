"use client";
import Image from "next/image";
import { Button } from "./button";
import { Star } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Howl, Howler } from "howler";
import { cn } from "@/lib/utils";
type Segment = {
  id: string;
  option: string;
  color: string;
  probability: number;
};

interface WheelComponentProps {
  segments: Segment[];
  defaultSize?: number;
  winningSegment?: number | null;
  onFinish?: (result:string)=> void
}
const Wheels = forwardRef(
  (
    { segments, winningSegment, defaultSize = 500,onFinish = (result:string)=>{} }: WheelComponentProps,
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [size, setSize] = useState(defaultSize);
    // let isStarted = false
    let timerHandle = 0;
    let winnerSegment = winningSegment;
    let initRotate = 0;
    let angleCurrent = 0;
    let currentSegment = "";
    let segmentInfo: { [key: string]: number } = {};
    let speed = 0;
    let progress = 100;
    let jarak = 0;
    let rotationAngle = 0;
    let spinSound:Howl;
    let winSound:Howl;
    const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
    useImperativeHandle(ref, () => ({
      spin,
    }));
    const angleDefault = Math.PI * 2 * (1 / segments.length) + 0;
    segments.map((item, index) => {
      segmentInfo[item.option] =
        index === 0
          ? 90
          : segmentInfo[segments[index - 1].option] +
            angleDefault * (180 / Math.PI);
    });

    const position = size / 2;
    const radius = size / 2 - 50;
    const PI2 = Math.PI * 2;
    const len = segments.length;
    useEffect(() => {
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.width = defaultSize;
        canvas.height = defaultSize;
        drawWheel();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);
    const drawWheel = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        clear();
        const ctx = canvas.getContext("2d");
        let lastAngle = angleCurrent;
        if (!ctx) return;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "1em proxima-nova";

        for (let i = 1; i <= len; i++) {
          const angle = PI2 * (i / len) + angleCurrent;
          drawSegment(ctx, i - 1, lastAngle, angle);
          lastAngle = angle;
        }


        ctx.beginPath();
        ctx.arc(position, position + 20, radius + 10, 1 * Math.PI, PI2, false);
        ctx.lineWidth = 30;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(position, position, radius+35, 0, PI2, false);
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#eee";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(position, position, radius +12, 0, PI2, false);
        ctx.lineWidth = 30;
        ctx.strokeStyle = "#001e38";
        ctx.stroke();
        
        // ctx.beginPath();
        // ctx.arc(60, 350, 6, 0, PI2, false);
        // ctx.fill();


        const centerX = canvas.width / 2; // X-coordinate of the center of the rounded circle
        const centerY = canvas.height / 2; // Y-coordinate of the center of the rounded circle
        const circleRadius = radius+13; // Radius of the rounded circle
        const numCircles = 20; // Number of smaller circles to create the rounded circle
        const angleIncrement = (Math.PI * 2) / numCircles; // Angle between each smaller circle

        for (let i = 0; i < numCircles; i++) {
          const angle = i * angleIncrement +rotationAngle; // Calculate the angle for the current smaller circle
          const x = centerX + circleRadius * Math.cos(angle); // Calculate the x-coordinate
          const y = centerY + circleRadius * Math.sin(angle); // Calculate the y-coordinate

          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2, false);
          ctx.fillStyle = "rgb(250 204 21)"
          ctx.fill();
          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 2
          ctx.stroke();
        }

        const change = angleCurrent + Math.PI / 2;
        let i =
          (segments.length -
            Math.floor((change / (Math.PI * 2)) * segments.length) -
            1) %
          segments.length;
        if (i < 0) i = i + segments.length;
        currentSegment = segments[i].option;
      }
    };
    const drawSegment = (
      ctx: CanvasRenderingContext2D,
      key: number,
      lastAngle: number,
      angle: number,
    ) => {
      const value = segments[key].option;
      if (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(position, position);
        ctx.arc(position, position, radius, lastAngle, angle, false);
        ctx.lineTo(position, position);
        ctx.closePath();

        ctx.fillStyle = segments[key].color;
        ctx.fill();
        ctx.lineWidth = 5
        ctx.stroke();
        ctx.save();
        ctx.translate(position, position);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.min(size, size) / 25}px proxima-nova`;
        ctx.fillText(value.substr(0, 21), radius / 2 + 20, 0);

        ctx.restore();
      }
    };
    const spin = async (test?:number) => {
      if (!isStarted) {
        spinSound = new Howl({
          loop: true,
          preload: true,
          src: ["./sound/spin.mp3"],
          rate: 1.0, // Initial rate
          autoplay: false,
        });
        spinSound.rate(1);
        spinSound.volume(100)
        await delay(300)
        spinSound.play();
        // isStarted = true
        setIsStarted(true);
        if (test !== undefined) {
          winnerSegment = test || 0;
        }
        else winnerSegment = (getRandomValueWithProbability(segments) || 0);

        const randomdeg = getRandomNumber(2 + 10 / segments.length, 5) * 360;
        const sisadeg = randomdeg % 360;
        const winnerSegmentJarak = segmentInfo[segments[winnerSegment].option];

        jarak =
          randomdeg +
          (sisadeg > winnerSegmentJarak
            ? 360 + winnerSegmentJarak - sisadeg
            : winnerSegmentJarak - sisadeg) +
          getRandomNumber(1, 360 / segments.length - 2);

        jarak = jarak * (Math.PI / 180);
        initRotate = jarak;

        Object.keys(segmentInfo).map((item) => {
          const tmp = Math.floor(
            (segmentInfo[item] - initRotate * (180 / Math.PI)) % 360,
          );
          segmentInfo[item] = tmp < 0 ? (tmp + 360) % 360 : tmp;
        });
        if (timerHandle === 0) {
          timerHandle = window.setInterval(onTimerTick, len);
        }
      }
    };
    const onTimerTick = () => {
      const maxSpeed = 0.5;
      const minSpeed = 0.01;
      progress = 100 - ((jarak - initRotate) / jarak) * 100;
      speed = Math.min(Math.max(progress / 100, minSpeed), maxSpeed);
      const pitch = 0.6 + (speed / maxSpeed) * 0.6;
      const volume = 10 + speed * (200 - 10);
      if(spinSound)
      spinSound.volume(volume / 100);
      spinSound.rate(pitch);
      initRotate -= speed;
      if (initRotate < 0) angleCurrent -= initRotate + speed;
      else angleCurrent -= speed;

      rotationAngle -= 0.01
      clear();
      drawWheel();
      if (initRotate <= 0) {
        spinSound.rate(1);
        spinSound.stop();
        winSound = new Howl({
          loop: false,
          preload: true,
          src: ["./sound/celeb.mp3"],
          rate: 1.0, // Initial rate
          autoplay: false,
        });
        winSound.play();
        clearInterval(timerHandle);
        timerHandle = 0;
        if(winnerSegment !== null && winnerSegment != undefined){
          onFinish(segments[winnerSegment].id)
        }
        // isStarted = false
        setIsStarted(false);
      }
    };
    const clear = () => {
      const context = canvasRef.current?.getContext("2d");
      context?.clearRect(0, 0, size, size);
    };
    const getRandomValueWithProbability = (probabilities: Segment[]) => {
      const totalProbability = probabilities.reduce(
        (sum, prob) => sum + prob.probability,
        0,
      );
      const random = Math.random();
      let cumulativeProbability = 0;

      for (const prob of probabilities) {
        cumulativeProbability += prob.probability / totalProbability;
        if (random < cumulativeProbability) {
          return probabilities.indexOf(prob);
        }
      }

      return null;
    };
    const getRandomNumber = (min: number, max: number) => {
      // Calculate a random number between 0 and 1
      const randomFraction = Math.random();

      // Scale the random number to the range [min, max]
      const randomNumberInRange = min + randomFraction * (max - min + 1);

      // Use Math.floor() to ensure the result is an integer
      return Math.floor(randomNumberInRange);
    };
    
    if(segments.length === 0){
      return <>-</>
    }
    return (
      <div className="relative flex w-[350px] md:w-[400px]">
        <div className="absolute left-[52.3%] top-[5px] h-[39px] w-[41px] -translate-x-1/2 rotate-90 md:left-[53%] md:top-[5px] md:h-[60px] md:w-[64px] ">
          <Image
            src={"./arrow.svg"}
            alt=""
            fill
            className={cn(isStarted && "animate-wiggle")}
          />
        </div>
        <Button className="absolute left-1/2 top-1/2 z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-white bg-[#001e38] hover:bg-[#001e38] md:h-16 md:w-16">
          <Star size={32} fill="#fff" className={cn(isStarted && "animate-spin")} />
        </Button>
        {!isStarted && (
          <div className="absolute left-1/2 top-1/2 z-10 h-12 w-12 origin-bottom-right -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-blue-800 md:h-14 md:w-14 "></div>
        )}
        <canvas ref={canvasRef} id="canvas" className="w-full" />
      </div>
    );
  },
);
Wheels.displayName = "wheel";
export default Wheels;
