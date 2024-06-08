import './App.css';
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react';

import { ImagePlus, Paintbrush, RotateCwSquare, ScanSearch, ZoomIn, ZoomOut } from 'lucide-react';


function App() {

  const canvasRef = useRef(null);
  const [text, setText] = useState('')

  var canvas = null;
  
  useEffect(() => {
    canvas = new fabric.Canvas(canvasRef.current);

    return () => {
      canvas.dispose();
    };
  }, []);

  const onImageChange = (e) => {
    const reader = new FileReader();
      reader.onload = (event) => {
        const imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = () => {
          const image = new fabric.Image(imgObj);
          image.set({
            left: 100,
            top: 100,
            angle: 0,
            padding: 10,
            cornersize: 10,
          });
          canvas.add(image);
          canvas.renderAll();
        };
      };
      reader.readAsDataURL(e.target.files[0]);
  }

  const rotateImage = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate(activeObject.angle + 15);
      canvas.renderAll();
    }
  };

  const zoomIn = () => {
    canvas.setZoom(canvas.getZoom() * 1.1);
  };

  const zoomOut = () => {
    canvas.setZoom(canvas.getZoom() / 1.1);
  };

  const stretch = () => {
    const activeObject = canvas.getActiveObject();
    activeObject.scaleX *= 1.1;
    activeObject.scaleY *= 1.1;
    canvas.renderAll();
  };

  const changeBackgroundColor = (color) => {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  };

  const addText = (text) => {
    const newText = new fabric.Text(text, {
      left: 100,
      top: 200,
      fill: '#000',
      fontSize: 50,
    });
    canvas.add(newText);
  };

  const handleCanvasSelection = () => {
    console.log('click');
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="fab_container">
            <canvas ref={canvasRef} width="800" height="600" className='fab_canvas' id="canvas" onClick={handleCanvasSelection}></canvas>
            <div className="fab_action">
              <button onClick={rotateImage}> <div className='icon'> <RotateCwSquare /> </div>  <span> Rotate </span> </button>
              <button onClick={zoomIn}><div className='icon'> <ZoomIn /> </div>  <span> Zoom In </span> </button>
              <button onClick={zoomOut}><div className='icon'> <ZoomOut /> </div>  <span> Zoom Out </span> </button>
              <button onClick={stretch}><div className='icon'> <ScanSearch /> </div>  <span> Stretch </span> </button>
            </div>
          </div>
          <div className="controls">
            <label htmlFor="imageLoader" className='input_label' style={{
              cursor : 'pointer',
            }}>
              <div className='icon'>
                <ImagePlus />
              </div>
              <span>Add Image</span>
            </label>
            <input style={{ display:'none' }} type="file" id="imageLoader" onChange={onImageChange} />
            <div className='right_controls'>
              <label htmlFor="backgroundColorPicker" className='input_label' style={{
                cursor : 'pointer',
              }}>
                <div className='icon'>
                  <Paintbrush />
                </div>
                <span>Canvas Color</span>
              </label>
              <input
                style={{ display:'none' }}
                type="color"
                id="backgroundColorPicker"
                onChange={(e) => changeBackgroundColor(e.target.value)}
              />

              <input className='text_input' type="text" id="textInput" placeholder="Enter text" />
              <button className='text_btn' onClick={() => addText(document.getElementById('textInput').value)}>Add Text</button>
            </div>
          </div>
        </div>

      </header>
    </div>
  );
}

export default App;
