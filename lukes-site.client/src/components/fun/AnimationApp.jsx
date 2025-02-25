import React, { useState, useRef, useEffect } from 'react';

const AnimationApp = () => {
  // State for animation data - store transparent drawings
  const [frames, setFrames] = useState([{ id: 1, data: '' }]);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(12);
  const [tool, setTool] = useState('marker');
  const [toolSize, setToolSize] = useState(5);
  const [toolColor, setToolColor] = useState('#000000');
  
  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  // Onion skinning
  const [onionSkinning, setOnionSkinning] = useState(false);
  const [onionSkinOpacity, setOnionSkinOpacity] = useState(0.3);
  
  // Context menu for frame operations
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    frameId: null
  });
  
  // Clipboard for frame copying
  const [copiedFrame, setCopiedFrame] = useState(null);
  
  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  // Canvas refs
  const canvasRef = useRef(null);
  const onionSkinCanvasRef = useRef(null);
  const ctxRef = useRef(null);
  const onionSkinCtxRef = useRef(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize canvas
  useEffect(() => {
    // Main drawing canvas - with transparency
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = toolSize;
    ctx.strokeStyle = toolColor;
    ctxRef.current = ctx;
    
    // Onion skin canvas
    const onionCanvas = onionSkinCanvasRef.current;
    onionCanvas.width = 640;
    onionCanvas.height = 480;
    onionSkinCtxRef.current = onionCanvas.getContext('2d');
    
    // Clear both canvases (without adding white backgrounds)
    clearCanvas();
    clearOnionSkinCanvas();
  }, []);
  
  // Update tool settings when they change
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = toolSize;
      
      // For eraser tool, we need to clear rather than draw white
      if (tool === 'eraser') {
        ctxRef.current.globalCompositeOperation = 'destination-out';
      } else {
        ctxRef.current.globalCompositeOperation = 'source-over';
        ctxRef.current.strokeStyle = toolColor;
      }
    }
  }, [toolSize, toolColor, tool]);
  
  // Handle animation playback
  useEffect(() => {
    let animationTimer;
    
    if (isPlaying) {
      // Hide onion skin during playback
      const wasOnionSkinningEnabled = onionSkinning;
      if (wasOnionSkinningEnabled) {
        setOnionSkinning(false);
      }
      
      animationTimer = setInterval(() => {
        setCurrentFrame(prev => {
          const next = prev >= frames.length ? 1 : prev + 1;
          drawFrame(next);
          return next;
        });
      }, 1000 / fps);
      
      return () => {
        clearInterval(animationTimer);
        if (wasOnionSkinningEnabled) {
          setOnionSkinning(true);
        }
      };
    }
    
    return () => clearInterval(animationTimer);
  }, [isPlaying, fps, frames.length]);
  
  // Update onion skin when needed
  useEffect(() => {
    updateOnionSkinDisplay();
  }, [currentFrame, onionSkinning, onionSkinOpacity]);
  
  // Drawing functions
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  
  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
    
    // Save the current drawing (transparent PNG)
    saveCurrentFrame();
  };
  
  // Save the current frame with transparency
  const saveCurrentFrame = () => {
    const framesCopy = [...frames];
    const frameIndex = framesCopy.findIndex(f => f.id === currentFrame);
    
    if (frameIndex >= 0) {
      // CRITICAL: Temporarily reset composition mode to normal before saving
      const originalCompositeOperation = ctxRef.current.globalCompositeOperation;
      ctxRef.current.globalCompositeOperation = 'source-over';
      
      // Save as PNG with transparency
      framesCopy[frameIndex].data = canvasRef.current.toDataURL('image/png');
      setFrames(framesCopy);
      
      // Restore the original composite operation
      ctxRef.current.globalCompositeOperation = originalCompositeOperation;
    }
  };
  
  // Update onion skin display
  const updateOnionSkinDisplay = () => {
    clearOnionSkinCanvas();
    
    if (!onionSkinning) return;
    
    // Find previous frame for onion skin
    const currentIndex = frames.findIndex(f => f.id === currentFrame);
    if (currentIndex <= 0) return; // No previous frame
    
    const prevFrame = frames[currentIndex - 1];
    if (!prevFrame || !prevFrame.data) return;
    
    // Draw previous frame on onion skin canvas with reduced opacity
    const onionCtx = onionSkinCtxRef.current;
    onionCtx.globalAlpha = onionSkinOpacity;
    
    const img = new Image();
    img.onload = () => {
      onionCtx.drawImage(img, 0, 0);
    };
    img.src = prevFrame.data;
  };
  
  // Draw a specific frame to the main canvas
  const drawFrame = (frameId) => {
    // Always reset canvas state first
    clearCanvas();
    
    // Reset composition mode to default
    if (ctxRef.current) {
      ctxRef.current.globalCompositeOperation = 'source-over';
    }
    
    // Hide onion skin during playback
    if (isPlaying && onionSkinCanvasRef.current) {
      onionSkinCanvasRef.current.style.display = 'none';
    } else if (onionSkinCanvasRef.current) {
      onionSkinCanvasRef.current.style.display = 'block';
    }
    
    const frame = frames.find(f => f.id === frameId);
    if (frame && frame.data) {
      const img = new Image();
      img.onload = () => {
        if (ctxRef.current) {
          // Ensure we're in normal draw mode
          ctxRef.current.globalCompositeOperation = 'source-over';
          ctxRef.current.drawImage(img, 0, 0);
          
          // Reset to tool settings after drawing
          if (tool === 'eraser') {
            ctxRef.current.globalCompositeOperation = 'destination-out';
          }
        }
      };
      img.src = frame.data;
    }
    
    setCurrentFrame(frameId);
  };
  
  // Clear canvas (without adding white background)
  const clearCanvas = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  
  const clearOnionSkinCanvas = () => {
    const ctx = onionSkinCtxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, onionSkinCanvasRef.current.width, onionSkinCanvasRef.current.height);
  };
  
  // Frame management
  const addNewFrame = () => {
    // Create new EMPTY frame (no white background)
    const newFrameId = Math.max(...frames.map(f => f.id)) + 1;
    const newFrame = { id: newFrameId, data: '' };
    
    setFrames([...frames, newFrame]);
    setCurrentFrame(newFrameId);
    clearCanvas();
  };
  
  const deleteFrame = (frameId) => {
    if (frames.length <= 1) return;
    
    const newFrames = frames.filter(f => f.id !== frameId);
    setFrames(newFrames);
    
    if (currentFrame === frameId) {
      const newCurrentFrame = newFrames[0].id;
      setCurrentFrame(newCurrentFrame);
    }
  };
  
  const navigateFrames = (direction) => {
    const currentIndex = frames.findIndex(f => f.id === currentFrame);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % frames.length;
    } else {
      newIndex = (currentIndex - 1 + frames.length) % frames.length;
    }
    
    const newFrameId = frames[newIndex].id;
    drawFrame(newFrameId);
  };
  
  // Preview functions with white background for display
  const openPreview = (frameData) => {
    setPreviewImage(frameData);
    setPreviewOpen(true);
  };
  
  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewImage('');
  };
  
  // Toggle onion skinning
  const toggleOnionSkinning = () => {
    setOnionSkinning(!onionSkinning);
  };
  
  // Frame clipboard operations
  const copyFrame = (frameId) => {
    const frameToCopy = frames.find(f => f.id === frameId);
    if (frameToCopy) {
      setCopiedFrame({ ...frameToCopy });
      hideContextMenu();
    }
  };
  
  const pasteFrame = (position) => {
    if (!copiedFrame || !contextMenu.frameId) return;
    
    // Create a new frame from the copied one with a new ID
    const newFrameId = Math.max(...frames.map(f => f.id)) + 1;
    const newFrame = { 
      id: newFrameId, 
      data: copiedFrame.data 
    };
    
    const framesCopy = [...frames];
    const targetIndex = framesCopy.findIndex(f => f.id === contextMenu.frameId);
    
    // Insert at the correct position
    if (position === 'after') {
      framesCopy.splice(targetIndex + 1, 0, newFrame);
    } else if (position === 'before') {
      framesCopy.splice(targetIndex, 0, newFrame);
    }
    
    setFrames(framesCopy);
    setCurrentFrame(newFrameId);
    drawFrame(newFrameId);
    hideContextMenu();
  };
  
  const duplicateFrame = (frameId) => {
    copyFrame(frameId);
    pasteFrame('after');
  };
  
  // Context menu handlers
  const showContextMenu = (e, frameId) => {
    e.preventDefault(); // Prevent the default context menu
    
    // Position the menu at the click location
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      frameId: frameId
    });
  };
  
  const hideContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      frameId: null
    });
  };
  
  // Click anywhere to hide the context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        hideContextMenu();
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu.visible]);
  
  // Export animation as PNG sequence in ZIP
  const exportAnimation = async () => {
    // Stop any playback
    setIsPlaying(false);
    
    // Check if we have frames
    if (frames.length === 0 || !frames[0].data) {
      alert('No frames to export!');
      return;
    }
    
    try {
      setIsExporting(true);
      setExportProgress(0);
      
      // Sort frames by ID to ensure correct order
      const sortedFrames = [...frames].sort((a, b) => a.id - b.id);
      
      // Create a zip file to hold all frames
      const JSZip = await import('jszip').then(module => module.default || module);
      const zip = new JSZip();
      
      // Add each frame to the zip
      for (let i = 0; i < sortedFrames.length; i++) {
        const frame = sortedFrames[i];
        if (!frame.data) continue;
        
        // Remove the data:image/png;base64, prefix
        const base64Data = frame.data.replace(/^data:image\/png;base64,/, "");
        
        // Add file to zip with sequential naming
        zip.file(`frame_${String(i+1).padStart(3, '0')}.png`, base64Data, {base64: true});
        
        // Update progress
        setExportProgress(Math.round((i + 1) / sortedFrames.length * 100));
      }
      
      // Generate metadata text file with animation info
      zip.file("animation_info.txt", 
        `Animation exported from Canvas Animation Studio\n` +
        `Date: ${new Date().toLocaleString()}\n` +
        `Frames: ${sortedFrames.length}\n` +
        `FPS: ${fps}\n` +
        `Recommended duration: ${(sortedFrames.length / fps).toFixed(2)} seconds\n` +
        `\nTo create a GIF from these frames, use a tool like GIMP, Photoshop, or online converters.`
      );
      
      // Generate the zip file
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = 'animation_frames.zip';
      link.href = url;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      setIsExporting(false);
      
      // Show completion message
      alert('Export complete! Your animation frames have been saved as a ZIP file.');
      
      // Reset progress after a delay
      setTimeout(() => {
        setExportProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Error exporting animation:', error);
      alert('Export failed. Please make sure JSZip is installed.');
      setIsExporting(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 bg-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Animation Studio</h2>
      
      {/* Main content area */}
      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Left side - Canvas and controls */}
        <div className="flex flex-col w-full md:w-3/4">
          {/* Tool controls */}
          <div className="bg-[#1f2a2d] p-4 rounded-lg shadow mb-4">
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <button 
                className={`px-3 py-2 rounded ${tool === 'marker' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTool('marker')}
              >
                Marker
              </button>
              <button 
                className={`px-3 py-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTool('eraser')}
              >
                Eraser
              </button>
              
              <div className="flex items-center ml-2">
                <span className="mr-2 text-white">Size:</span>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={toolSize} 
                  onChange={(e) => setToolSize(parseInt(e.target.value))} 
                  className="w-24"
                />
                <span className="ml-1 text-white">{toolSize}px</span>
              </div>
              
              <div className="flex items-center ml-2">
                <span className="mr-2 text-white">Color:</span>
                <input 
                  type="color" 
                  value={toolColor} 
                  onChange={(e) => setToolColor(e.target.value)} 
                  className="w-8 h-8 cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* Canvas container */}
          <div className="flex justify-center bg-[#1f2a2d] p-4 rounded-lg shadow">
            <div className="relative">
              {/* Stacked canvases with proper z-index */}
              <div className="relative" style={{ width: '640px', height: '480px' }}>
                {/* White background - CSS only */}
                <div className="absolute inset-0 bg-white rounded"></div>
                
                {/* Onion skin layer */}
                <canvas
                  ref={onionSkinCanvasRef}
                  className="absolute inset-0 rounded"
                  style={{ 
                    zIndex: 1, 
                    display: onionSkinning && !isPlaying ? 'block' : 'none' 
                  }}
                />
                
                {/* Main drawing layer - transparent */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="absolute inset-0 rounded cursor-crosshair"
                  style={{ zIndex: 2 }}
                />
              </div>
              
              {/* Frame navigation arrows */}
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => navigateFrames('prev')} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                >
                  ← Previous Frame
                </button>
                <div className="text-white">
                  Frame {frames.findIndex(f => f.id === currentFrame) + 1} of {frames.length}
                </div>
                <button 
                  onClick={() => navigateFrames('next')} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                >
                  Next Frame →
                </button>
              </div>
            </div>
          </div>
          
          {/* Playback controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-[#1f2a2d] p-4 rounded-lg shadow mt-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className={`px-4 py-2 rounded-lg shadow ${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white`}
              disabled={isExporting}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <div className="flex items-center">
              <span className="mr-2 text-white">FPS:</span>
              <input 
                type="number" 
                min="1" 
                max="60" 
                value={fps} 
                onChange={(e) => setFps(parseInt(e.target.value))} 
                className="w-16 rounded px-2 py-1"
                disabled={isExporting}
              />
            </div>
            
            <button 
              onClick={addNewFrame} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              disabled={isExporting}
            >
              Add Frame
            </button>
            
            {/* Export button */}
            <button 
              onClick={exportAnimation}
              className={`px-4 py-2 rounded-lg shadow ${isExporting ? 'bg-yellow-500' : 'bg-purple-500'} text-white`}
              disabled={isExporting || frames.length === 0}
            >
              {isExporting 
                ? `Exporting ${exportProgress}%` 
                : 'Export Frames'}
            </button>
            
            {/* Onion skin controls */}
            <div className="flex items-center gap-2 ml-2 border-l border-gray-600 pl-4">
              <button 
                onClick={toggleOnionSkinning} 
                className={`px-4 py-2 rounded-lg shadow ${onionSkinning ? 'bg-purple-600' : 'bg-gray-400'} text-white`}
                disabled={isExporting}
              >
                {onionSkinning ? 'Onion Skin: ON' : 'Onion Skin: OFF'}
              </button>
              
              <div className="flex items-center ml-2">
                <span className="mr-2 text-white">Opacity:</span>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.7" 
                  step="0.05"
                  value={onionSkinOpacity} 
                  onChange={(e) => setOnionSkinOpacity(parseFloat(e.target.value))} 
                  className="w-24"
                  disabled={!onionSkinning || isExporting}
                />
                <span className="ml-1 text-white">{Math.round(onionSkinOpacity * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Frames list */}
        <div className="w-full md:w-1/4 bg-[#1f2a2d] rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-white">Frames</h3>
          <div className="overflow-y-auto max-h-96">
            {frames.map((frame, index) => (
              <div 
                key={frame.id} 
                className={`relative mb-3 p-2 rounded cursor-pointer ${currentFrame === frame.id ? 'bg-blue-900 border border-blue-500' : 'bg-[#2a3a40]'}`}
                onContextMenu={(e) => showContextMenu(e, frame.id)}
              >
                <div 
                  className="mb-1 flex justify-between items-center"
                  onClick={() => {
                    drawFrame(frame.id);
                  }}
                >
                  <span className="font-medium text-white">Frame {index + 1}</span>
                  {frames.length > 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFrame(frame.id);
                      }}
                      className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                {frame.data && (
                  <div 
                    className="relative" 
                    onClick={() => {
                      drawFrame(frame.id);
                    }}
                    onContextMenu={(e) => showContextMenu(e, frame.id)}
                  >
                    <div className="bg-white rounded">
                      <img 
                        src={frame.data} 
                        alt={`Frame ${index + 1}`} 
                        className="w-full h-auto rounded"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(frame.data);
                      }}
                      className="absolute bottom-1 right-1 bg-gray-800 bg-opacity-70 text-white p-1 rounded"
                    >
                      🔍
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Frame preview modal */}
      {previewOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div className="relative max-w-4xl max-h-screen p-2 flex flex-col items-center">
            <div className="bg-white rounded">
              <img 
                src={previewImage} 
                alt="Frame preview" 
                className="max-w-full max-h-screen rounded"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button 
              className="mt-4 bg-white text-black px-4 py-2 rounded-lg"
              onClick={closePreview}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Custom context menu */}
      {contextMenu.visible && (
        <div 
          className="fixed z-50 bg-[#1f2a2d] shadow-lg rounded border border-gray-700"
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px`,
            minWidth: '150px' 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="block w-full text-left px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => copyFrame(contextMenu.frameId)}
          >
            Copy Frame
          </button>
          
          {copiedFrame && (
            <>
              <button 
                className="block w-full text-left px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => pasteFrame('before')}
              >
                Paste Before
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => pasteFrame('after')}
              >
                Paste After
              </button>
            </>
          )}
          
          <button 
            className="block w-full text-left px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => duplicateFrame(contextMenu.frameId)}
          >
            Duplicate Frame
          </button>
          
          <div className="border-t border-gray-700 my-1"></div>
          
          <button 
            className="block w-full text-left px-4 py-2 text-white hover:bg-red-600"
            onClick={hideContextMenu}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimationApp;