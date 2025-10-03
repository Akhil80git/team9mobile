import React, { useEffect, useRef } from 'react';

export default function DeviceFrame({ src }) {
  const iframeRef = useRef();

  useEffect(() => {
    const iframe = iframeRef.current;
    const wrapper = iframe.parentElement;

    const adjustScale = () => {
      // ✅ Redmi के लिए fixed dimensions (CSS से define होंगे)
      const computedStyle = window.getComputedStyle(iframe);
      const deviceWidth = parseFloat(computedStyle.width);
      const deviceHeight = parseFloat(computedStyle.height);
      const boxWidth = wrapper.clientWidth;
      const boxHeight = wrapper.clientHeight;

      const scale = Math.min(boxWidth / deviceWidth, boxHeight / deviceHeight);
      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.transformOrigin = 'top left';
      wrapper.style.width = `${deviceWidth}px`;
      wrapper.style.height = `${deviceHeight}px`;
      wrapper.style.overflow = 'visible';

      // iframe को CSS-defined size fill कराओ
      iframe.style.width = '100%';
      iframe.style.height = '100%';
    };

    adjustScale();
    window.addEventListener('resize', adjustScale);

    return () => {
      window.removeEventListener('resize', adjustScale);
    };
  }, [src]);

  return (
    <div className="device-wrapper">
      <iframe
        ref={iframeRef}
        src={src || 'about:blank'}
        className="redmi-box"
      />
    </div>
  );
}
