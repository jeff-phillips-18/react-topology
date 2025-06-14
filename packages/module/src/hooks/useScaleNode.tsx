import { useState, useRef, useEffect } from 'react';

const useScaleNode = (scaleNode: boolean, scale: number, scaleUpTime: number = 200): number => {
  const [nodeScale, setNodeScale] = useState<number>(1);
  const animationRef = useRef<number>(null);
  const scaleGoal = useRef<number>(1);
  const nodeScaled = useRef<boolean>(false);

  useEffect(() => {
    if (!scaleNode || scale >= 1) {
      setNodeScale(1);
      nodeScaled.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    } else {
      scaleGoal.current = 1 / scale;
      const scaleDelta = scaleGoal.current - scale;
      const initTime = performance.now();

      const bumpScale = (bumpTime: number) => {
        const scalePercent = (bumpTime - initTime) / scaleUpTime;
        const nextScale = Math.min(scale + scaleDelta * scalePercent, scaleGoal.current);
        setNodeScale(nextScale);
        if (nextScale < scaleGoal.current) {
          animationRef.current = requestAnimationFrame(bumpScale);
        } else {
          nodeScaled.current = true;
          animationRef.current = 0;
        }
      };

      if (nodeScaled.current) {
        setNodeScale(scaleGoal.current);
      } else if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(bumpScale);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    };
  }, [scale, scaleNode, scaleUpTime]);

  return nodeScale;
};
export default useScaleNode;
