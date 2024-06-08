import './App.css';
import { fabric } from 'fabric'
import { useEffect, useRef, useState } from 'react';

import { Brush, CircleOff, CircleX, Eraser, Expand, ImagePlus, Minimize, Paintbrush, Pencil, Pipette, RotateCwSquare, ScanSearch, Trash, Type, ZoomIn, ZoomOut } from 'lucide-react';


function App() {

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null)
  

  // var canvas = null;

  const Fonts = ['Roboto','Rubik','Quicksand']
  
  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current);
    initCanvas.setBackgroundColor('white', initCanvas.renderAll.bind(initCanvas));

    initCanvas.on('mouse:up', function() {
      initCanvas.isDrawingMode = false;
    });

    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
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
          canvas.isDrawingMode = false;
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
    if(activeObject){
      activeObject.scaleX *= 1.1;
      activeObject.scaleY *= 1.1;
    }
    canvas.renderAll();
  };

  const unStretch = () => {
    const activeObject = canvas.getActiveObject();
    if(activeObject){
      activeObject.scaleX /= 1.1;
      activeObject.scaleY /= 1.1;
    }
    canvas.renderAll();
  };

  const changeBackgroundColor = (color) => {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  };

  const changeTextColor = (color) => {
    const activeObject = canvas.getActiveObject();
    if(activeObject?.fill){
      activeObject.set({ fill : color });
      canvas.renderAll();
    }
  };

  const changeTextFont = (font) => {
    const activeObject = canvas.getActiveObject();
    console.log(activeObject);
    if(activeObject?.fill){
      activeObject.set({ fontFamily : font });
    }
    // canvas.renderAll()
  };

  const addText = (text) => {
    const newText = new fabric.Text(text, {
      left: 100,
      top: 200,
      fill: '#000',
      fontSize: 50,
      fontFamily : ''
    });
    canvas.add(newText);
    canvas.isDrawingMode = false;
    canvas.renderAll();
  };

  const Draw = () => {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      if(canvas.isDrawingMode){
        // Set pencil brush properties
        canvas.freeDrawingBrush.color = 'black';
        canvas.freeDrawingBrush.width = 5;
      }
  }

  const Erase = () => {
      canvas.isDrawingMode = true;
      if(canvas.isDrawingMode){
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        // Set pencil brush properties
        canvas.freeDrawingBrush.color = canvas.backgroundColor;
        canvas.freeDrawingBrush.width = 10;
      }
  }


  const Remove = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
      }
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas)); // Optional: reset background color
    }
  };


  



  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="fab_container">
            <canvas ref={canvasRef} width="800" height="600" className='fab_canvas' id="canvas" ></canvas>
            <div className="fab_action">
              <button onClick={rotateImage}> <div className='icon'> <RotateCwSquare /> </div>  <span> Rotate </span> </button>
              <button onClick={zoomIn}><div className='icon'> <ZoomIn /> </div>  <span> Zoom In </span> </button>
              <button onClick={zoomOut}><div className='icon'> <ZoomOut /> </div>  <span> Zoom Out </span> </button>
              <button onClick={stretch}><div className='icon'> <Expand /> </div>  <span> Stretch </span> </button>
              <button onClick={unStretch}><div className='icon'> <Minimize /> </div>  <span> Un Stretch </span> </button>
              <button onClick={Draw}><div className='icon'> <Brush /> </div>  <span> Draw </span> </button>
              <button onClick={Erase}><div className='icon'> <Eraser /> </div>  <span> Erase </span> </button>
              <button onClick={Remove}><div className='icon'> <Trash /> </div>  <span> Remove </span> </button>
              <button>
                <label htmlFor="textColor" className='input_label' style={{
                  cursor : 'pointer',
                }}>
                  <div className='icon'>
                    <Pipette />
                  </div>
                  <span style={{ fontSize : '14px' }} >Text Color</span>
                </label>
                <input
                  style={{ display:'none' }}
                  type="color"
                  id="textColor"
                  onChange={(e) => changeTextColor(e.target.value)}
                />
              </button>
              <button>
                <label htmlFor="fontSelect" className='input_label' style={{
                  cursor : 'pointer',
                  marginRight:'0'
                }}>
                  <div className='icon'>
                    <Type />
                  </div>
                </label>
                <select id="fontSelect" onChange={(e) => changeTextFont(e.target.value)}  >
                  <option value="" disabled >Font Type</option>
                  {
                    Fonts.map(val => {
                      return <option key={val} value={val} >
                                {val}
                              </option>
                    })
                  }
                </select>
              </button>
              <button className='clear_btn' onClick={clearCanvas}><div className='icon'> <CircleX /> </div>  <span> Clear Canvas </span> </button>
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
