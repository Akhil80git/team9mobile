import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const redmiBoxRef = useRef(null);
  const previewFrameRef = useRef(null);

  const injectViewport = (frame) => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      if (doc.querySelector('meta[name="viewport"]')) return;
      const viewportMeta = doc.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0';
      doc.head.appendChild(viewportMeta);
    } catch (e) {
      console.log('Cannot modify iframe content');
    }
  };

  const adjustScales = () => {
    const mobileWidth = 375;
    const mobileHeight = 812;

    if (redmiBoxRef.current && previewFrameRef.current) {
      const box = redmiBoxRef.current;
      const scale = Math.min(
        box.clientWidth / mobileWidth,
        box.clientHeight / mobileHeight
      );
      previewFrameRef.current.style.width = `${mobileWidth}px`;
      previewFrameRef.current.style.height = `${mobileHeight}px`;
      previewFrameRef.current.style.transform = `scale(${scale})`;
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(adjustScales);
    if (redmiBoxRef.current) observer.observe(redmiBoxRef.current);
    adjustScales();
    return () => observer.disconnect();
  }, []);

  const loadURL = () => {
    if (url.trim()) {
      let formattedUrl = url;
      if (
        !formattedUrl.startsWith('http://') &&
        !formattedUrl.startsWith('https://')
      ) {
        formattedUrl = `https://${url}`;
      }
      previewFrameRef.current.src = formattedUrl;
    } else {
      alert('Please enter a valid URL');
    }
  };

  const openNewWindow = () => {
    if (url.trim()) {
      let formattedUrl = url;
      if (
        !formattedUrl.startsWith('http://') &&
        !formattedUrl.startsWith('https://')
      ) {
        formattedUrl = `https://${url}`;
      }
      window.open(formattedUrl, '_blank');
    } else {
      alert('Please enter a valid URL');
    }
  };

  const clearFrames = () => {
    previewFrameRef.current.src = 'about:blank';
    setUrl('');
  };

  return (
    <div className="container">

      {/* ✅ सिर्फ Redmi */}
      <div className="device-container">
        <div className="redmi-box" ref={redmiBoxRef}>
          <iframe
            id="previewFrame"
            ref={previewFrameRef}
            src="about:blank"
            onLoad={() => {
              injectViewport(previewFrameRef.current);
              adjustScales();
            }}
          ></iframe>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          id="urlInput"
          placeholder="Enter URL (e.g., example.com)"
          className="compact-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="compact-buttons">
          <button className="compact-btn" onClick={loadURL}>
            Load
          </button>
          <button className="compact-btn" onClick={openNewWindow}>
            Open
          </button>
          <button className="compact-btn" onClick={clearFrames}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
