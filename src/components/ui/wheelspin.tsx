import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './button';
import { Star } from 'lucide-react';
import {Howl, Howler} from 'howler';

interface WheelComponentProps {
  segments: {
    option: string;
    color: string;
  }[]
  winningSegment: string | null;
  onFinished: (segment: string) => void;
  primaryColor?: string;
  contrastColor?: string;
  buttonText?: string;
  isOnlyOnce?: boolean;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  fontFamily?: string;
}

const WheelComponent: React.FC<WheelComponentProps> = ({
  segments,
  winningSegment,
  onFinished,
  primaryColor = 'black',
  contrastColor = 'white',
  buttonText = 'Spin',
  isOnlyOnce = true,
  size = 200,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova',
}) => {
  let currentSegment = '';
  const [isStarted,setIsStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let maxSpeed = Math.PI / segments.length;
  const upTime = 4000;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = 250;
  const centerY = 250;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spinSound = new Howl({
    loop: true,
    src: ['./sound/spinsound.mp3'], // Replace with the path to your sound file
  });

  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = canvasRef.current;

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', '500');
      canvas.setAttribute('height', '500');
      canvas.setAttribute('id', 'canvas');
      document.getElementById('wheel')?.appendChild(canvas);
    }

    if (canvas) {
      // canvas.addEventListener('click', spin, false);
      canvasContext = canvas.getContext('2d');
    }
  };

  const spin = () => {
    initCanvas()
    setIsStarted(true);
    if (timerHandle === 0) {
      
      spinSound.play()
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = window.setInterval(onTimerTick, timerDelay);
    }
  };

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if(duration > 3800 ){
      spinSound.rate(0.5)
    }else if(duration > 3500){
      spinSound.rate(0.6)
    }else if(duration > 3000){
      spinSound.rate(0.7)
    }else if(duration > 2500){
      spinSound.rate(0.8)
    }else if(duration > 2000){
      spinSound.rate(0.9)
    }

    maxSpeed = Math.PI / segments.length - (duration/ 30000);
    
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }

      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setTimeout(()=>spinSound.stop(),200)
      setFinished(true);
      setIsStarted(false);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    const ctx = canvasContext;
    const value = segments[key].option;
    if (ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, size, lastAngle, angle, false);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fillStyle = segments[key].color;
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((lastAngle + angle) / 2);
      ctx.fillStyle = contrastColor;
      ctx.font = 'bold 1em ' + fontFamily;
      ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
      ctx.restore();
    }
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    if (ctx) {
      let lastAngle = angleCurrent;
      const len = segments.length;
      const PI2 = Math.PI * 2;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#fff";
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = '1em ' + fontFamily;

      for (let i = 1; i <= len; i++) {
        const angle = PI2 * (i / len) + angleCurrent;
        drawSegment(i - 1, lastAngle, angle);
        lastAngle = angle;
      }

      // ctx.beginPath();
      // ctx.arc(centerX, centerY, 30, 0, PI2, false);
      // ctx.closePath();
      // ctx.fillStyle = "#348ef6";
      // ctx.lineWidth = 5;
      // ctx.strokeStyle = contrastColor;
      // ctx.fill();
      // ctx.font = 'bold 1em ' + fontFamily;
      // ctx.fillStyle = contrastColor;
      // ctx.textAlign = 'center';
      // ctx.fillText(buttonText, centerX, centerY + 3);
      // ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY+12, size-10, 1* Math.PI, PI2, false);
      ctx.lineWidth = 15;
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, PI2, false);
      ctx.closePath();
      ctx.lineWidth = 15;
      ctx.strokeStyle = "#f3f4f7";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, size-10, 0, PI2, false);
      ctx.closePath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#fff";
      ctx.stroke();

    }
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    if (ctx) {
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = contrastColor;
      // ctx.fillStyle = contrastColor;
      // ctx.beginPath();
      // ctx.moveTo(centerX + 20, centerY - 25);
      // ctx.lineTo(centerX - 20, centerY - 25);
      // ctx.lineTo(centerX, centerY - 45);
      // ctx.closePath();
      // ctx.fill();
      const change = angleCurrent + Math.PI / 2;
      let i =
        segments.length -
        Math.floor((change / (Math.PI * 2)) * segments.length) -
        1;
      if (i < 0) i = i + segments.length;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 1.5em ' + fontFamily;
      currentSegment = segments[i].option;
    }
  };

  const clear = () => {
    const ctx = canvasContext;
    if (ctx) {
      ctx.clearRect(0, 0, 500, 500);
    }
  };

  return (
    <div className='relative'>
      <div className="absolute -top-[20px] left-[53%] -translate-x-1/2 rotate-90">
        <Image src={"./arrow.svg"} height={78} width={82} alt=""/>
      </div>
      <Button onClick={spin} className='bg-blue-600 border-white border-8 z-20 hover:bg-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-20 h-20' >
        <Star size={32} fill='#fff'/>
      </Button>
      {!isStarted &&(<div className='bg-blue-800 animate-ping w-14 h-14 origin-bottom-right absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'></div>)}
      <canvas
        ref={canvasRef}
        id='canvas'
        width='500'
        height='500'
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto',
        }}
      />
    </div>
  );
};

export default WheelComponent;
