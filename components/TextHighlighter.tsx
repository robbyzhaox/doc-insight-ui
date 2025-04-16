import React, { useRef, useEffect, useState, MutableRefObject } from 'react';

interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  score: number;
}

interface TextItem {
  text: string;
  confidence: number;
  bounding_box: BoundingBox;
}

interface TextHighlighterProps {
  textItems: TextItem[];
  imageContainerRef: MutableRefObject<HTMLDivElement | null>;
}

export default function TextHighlighter({ 
  textItems,
  imageContainerRef 
}: TextHighlighterProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [displayScale, setDisplayScale] = useState({ scaleX: 1, scaleY: 1 });
  const [imageOffset, setImageOffset] = useState({ offsetX: 0, offsetY: 0});
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const updateScaleAndPosition = () => {
    const overlay = overlayRef.current;
    const imageContainer = imageContainerRef.current;
    
    if (!overlay || !imageContainer) {
      return;
    }
    
    try {
      let imgElement = imageContainer.querySelector('img');
      if (imgElement == null) {
        return
      }
      const imageRect = imgElement.getBoundingClientRect();

      let actualWidth, actualHeight, offsetX = 0, offsetY = 0;
      const containerRatio = imageRect.width / imageRect.height;
      const imageRatio = imgElement.naturalWidth / imgElement.naturalHeight;
      if (containerRatio > imageRatio) {
        // 容器更宽，上下留白
        actualHeight = imageRect.height;
        actualWidth = actualHeight * imageRatio;
        offsetX = (imageRect.width - actualWidth) / 2;
      } else {
        // 容器更高，左右留白
        actualWidth = imageRect.width;
        actualHeight = actualWidth / imageRatio;
        offsetY = (imageRect.height - actualHeight) / 2;
      }

      setDisplayScale({ scaleX: actualWidth / imgElement.naturalWidth  || 1, scaleY: actualHeight / imgElement.naturalHeight || 1 });
      setImageOffset({
        offsetX,
        offsetY
      });

    } catch (err) {
      // Keep empty catch to prevent unhandled errors
    }
  };
  
  useEffect(() => {
    if (!overlayRef.current || !imageContainerRef.current) {
      return;
    }
    
    const initialDelayTimer = setTimeout(() => {
      updateScaleAndPosition();
    }, 50);
    
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateScaleAndPosition, 50);
    });
    
    if (imageContainerRef.current) {
      resizeObserver.observe(imageContainerRef.current);
    }
    
    window.addEventListener('resize', updateScaleAndPosition);
    
    const imageCheckInterval = setInterval(() => {
      const imageElement = imageContainerRef.current?.querySelector('img');
      if (imageElement && imageElement.complete) {
        updateScaleAndPosition();
      }
    }, 200);
    
    return () => {
      clearTimeout(initialDelayTimer);
      clearInterval(imageCheckInterval);
      window.removeEventListener('resize', updateScaleAndPosition);
      if (imageContainerRef.current) {
        resizeObserver.unobserve(imageContainerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [mounted, imageContainerRef]);

  useEffect(() => {
    if (!textItems || textItems.length === 0 || !overlayRef.current || !imageContainerRef.current) return;
    
    updateScaleAndPosition();
    
    const delayedUpdate1 = setTimeout(updateScaleAndPosition, 200);
    const delayedUpdate2 = setTimeout(updateScaleAndPosition, 500);
    
    return () => {
      clearTimeout(delayedUpdate1);
      clearTimeout(delayedUpdate2);
    };
  }, [textItems, imageContainerRef]);

  if (!textItems || textItems.length === 0) {
    return null;
  }

  return (
    <div ref={overlayRef} className="absolute inset-0 pointer-events-none overflow-visible">
      {textItems.map((item, index) => {
        const { bounding_box: box } = item;
        
        if (!box || typeof box.left !== 'number' || typeof box.top !== 'number' || 
            typeof box.right !== 'number' || typeof box.bottom !== 'number') {
          return null;
        }
        
        const scaledLeft = Math.round(box.left* displayScale.scaleX + imageOffset.offsetX);
        const scaledTop = Math.round(box.top* displayScale.scaleY + imageOffset.offsetY);
        const scaledWidth = Math.round((box.right - box.left) * displayScale.scaleX);
        const scaledHeight = Math.round((box.bottom - box.top) * displayScale.scaleY);
        
        return (
          <div
            key={index}
            className="absolute border-2 border-red-500 flex items-center justify-center"
            style={{
              left: `${scaledLeft}px`,
              top: `${scaledTop}px`,
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              transform: 'translate(0, 0)',
            }}
          >
            <div className="absolute -top-5 left-0 bg-sky-500/75 text-white text-[10px] px-[2px] py-[1px] rounded whitespace-nowrap overflow-hidden">
              {item.text}
            </div>
          </div>
        );
      })}
    </div>
  );
} 