"use client"

import Image from "next/image"
import { Button } from "./button"
import { Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {Howl, Howler} from 'howler';

interface WheelComponentProps {
  segments: {
    option: string
    color: string
  }[]
  winningSegment?: number | null
}
const Wheel = ({segments,winningSegment}: WheelComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isStarted,setIsStarted] = useState(false)
  const [size,setSize] =useState(500)
  const [savedCurrent,setSavedCurrent] = useState(0)

  const fontFamily = 'proxima-nova'
  const radius = size / 2 - 50
  const position = size / 2

  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleDefault = ( Math.PI * 2 * (1 / segments.length) +0)
  let angleCurrent = 0;
  let angleDelta = 0;
  let ctx: CanvasRenderingContext2D | null = null;
  let maxSpeed = Math.PI / segments.length;
  let spinStart = 0;
  let frames = 0;
  let currentSegment = '';
  let newTarget = 0;
  let angleWinning = 0;
  // let winningIndex = segments.findIndex(item => item.option === winningSegment) + 1
  let pointerRotate = 0;
  const spinSound = new Howl({
    loop: true,
    src: ['./sound/spin.mp3'],
    rate: 1.0 // Replace with the path to your sound file
  });

  const drawWheel = () => {
    ctx = canvasRef.current? canvasRef.current.getContext("2d") : null 
    if(ctx){
      ctx.clearRect(0, 0, size, size)
      
      const PI2 = Math.PI * 2
      let lastAngle = angleCurrent;
      const len = segments.length;

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

      ctx.beginPath()
      ctx.arc(position, position+12, radius-10, 1* Math.PI, PI2, false)
      ctx.lineWidth = 15
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.stroke()

      ctx.beginPath();
      ctx.arc(position, position, radius, 0, PI2, false);
      ctx.lineWidth = 15;
      ctx.strokeStyle = "#eee";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(position, position, radius-10, 0, PI2, false);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      
      const change = angleCurrent + Math.PI / 2;
      let i =
        (segments.length -
        Math.floor((change / (Math.PI * 2)) * segments.length) -
        1) % segments.length;
      if (i < 0) i = i + segments.length;
      currentSegment = segments[i].option;
      // if(segments[i].option === winningSegment)
      //   angleWinning = change
    }
  }

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
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
      ctx.stroke();
      ctx.save();
      ctx.translate(position, position);
      ctx.rotate((lastAngle + angle) / 2);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.min(size, size) / 25}px ${fontFamily}`
      ctx.fillText(value.substr(0, 21), radius / 2 + 20, 0);

      ctx.restore();
    }
  }
  const clear = () => {
    const context = canvasRef.current?.getContext("2d")
    context?.clearRect(0,0,size,size)
  }

  const spin = () => {
    if(!winningSegment)
      angleCurrent = savedCurrent
    if(!isStarted){
      setIsStarted(true);
      clear()
      if(timerHandle === 0){
        spinSound.play();
        spinStart = new Date().getTime();
        maxSpeed = Math.PI / segments.length;
        frames = 0;
        drawWheel()
        timerHandle = window.setInterval(onTimerTick, timerDelay);
      }
    }
  }
  const degreesToRadians = (degrees:number) => {
    return degrees * (Math.PI / 180);
  }
  function radiansToDegrees(radians:number) {
    return radians * (180 / Math.PI);
  }
  const onTimerTick = () => {
    const initialPitch = 1.0;
    const finalPitch = 0.5;
    let rotateT = degreesToRadians(360*50)
    let finished = false;
    if(canvasRef.current){
      clear()
      drawWheel()
      if(winningSegment){
        const anglewinningmin = -1*((winningSegment+(segments.length/4 -1))*angleDefault)
        const anglewinningmax = -1*((winningSegment+(segments.length/4 -1))*angleDefault) - angleDefault
        const minCurrentAngle = angleCurrent % ((segments.length)*angleDefault)
        if(minCurrentAngle <= anglewinningmin && minCurrentAngle >= anglewinningmax && pointerRotate > rotateT){
          finished = true
        }
        maxSpeed = ((rotateT) + (-1*anglewinningmin) - ((pointerRotate > rotateT?-1* minCurrentAngle: 0) + (pointerRotate > rotateT?rotateT: pointerRotate)))
        const soundRate = ((pointerRotate > rotateT?-1* minCurrentAngle: 0) + (pointerRotate > rotateT?rotateT: pointerRotate))/((rotateT) + (-1*anglewinningmin))
        const currentPitch = (initialPitch + (finalPitch - initialPitch) * (soundRate))
        spinSound.rate(currentPitch)
        pointerRotate += degreesToRadians(maxSpeed<0.5?0.5:maxSpeed)
        angleCurrent -= degreesToRadians(maxSpeed<0.5?0.5:maxSpeed)
      }else{
        let spinDuration = segments.length * 500;
        const initialPitch = 1.0;
        const finalPitch = 0.5;
        const duration = new Date().getTime() - spinStart;
        let progress = 0;
        const currentPitch = initialPitch + (finalPitch - initialPitch) * (duration / spinDuration);
        spinSound.rate(currentPitch)
        if (duration < spinDuration) {
          progress = duration / spinDuration;
          maxSpeed = (spinDuration-duration)/10000 -0.02
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
        }else{
            progress = 1
        }
        if (progress == 1) finished = true;
        angleCurrent += angleDelta;
        while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
      }
      if (finished) {
        setSavedCurrent(angleCurrent)
        spinSound.rate(1)
        spinSound.stop()
        setIsStarted(false);
        clearInterval(timerHandle);
        timerHandle = 0;
        angleDelta = 0;
        newTarget = 0
      }
    }
  }
  useEffect(()=> {
      const canvas = canvasRef.current
      if (!canvas) return;
      const heightRatio = 1.5
      canvas.height = canvas.width * heightRatio
      setSize(canvas.width)
      drawWheel()
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div className='relative flex w-full'>
      <div className="absolute top-[25px] left-[53%] -translate-x-1/2 rotate-90">
        <Image src={"./arrow.svg"} height={78} width={82} alt=""/>
      </div>
      <Button onClick={spin} className='bg-blue-600 border-white border-8 z-20 hover:bg-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-20 h-20' >
        <Star size={32} fill='#fff'/>
      </Button>
      {!isStarted &&(<div className='bg-blue-800 animate-ping w-14 h-14 origin-bottom-right absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'></div>)}
      <canvas
        ref={canvasRef}
        id='canvas' className="w-full"
      />
    </div>
  )
}

export default Wheel