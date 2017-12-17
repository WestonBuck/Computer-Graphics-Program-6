////////////////////////////////////////////////////////////
//
// Weston Buck
// Program 6
// Bug: None?
//
//////////////////////////////////////////////////////////////
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_matrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_matrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

  //float 32 arrays used for pupil position.
var newTranslate1 = new Float32Array([0.0,0.0,0.0]);
var newTranslate2 = new Float32Array([0.0,0.0,0.0]);

//bools used in determining the position of the pupil
var isAbovex1 = false;
var isAbovey1 = false;
var isAbovex2 = false;
var isAbovey2 = false;




function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);


  var currentAngle = 0.0;

  var tick = function() {
    currentAngle = animate();  // Update the rotation angle
    DrawFace(gl);
    requestAnimationFrame(tick, canvas);   // Request that the browser calls tick
  };

  tick();
}

//base function that calls all the others to get drawn.
function DrawFace(gl)
{
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  DrawHead(gl);
  DrawMouth(gl);
  DrawEye(gl);
  DrawEye2(gl);
  Drawtooth1(gl);
  Drawtooth2(gl);
  DrawPupil(gl);
  DrawPupil2(gl);
}

//draws the head
function DrawHead(gl)
{
    var matrix = new Matrix4();
    var vertices = 30;
    var newPoints = []; 
    var radius = 1.0;   //radius for the Ellipse
  
    for (var i = 0; i < vertices; i++)
    {
        newPoints.push((radius * Math.cos((i / vertices) * 2.0 * Math.PI)));
  
        newPoints.push(radius/1.2 * Math.sin((i / vertices) * 2.0 * Math.PI));
        newPoints.push(.97);
        newPoints.push(.79);
        newPoints.push(.63);
  
    }
  
    newPoints.push(newPoints[0]);
    newPoints.push(newPoints[1]);
    
    var head = new Float32Array(newPoints);
    matrix.translate(0.5, 0.0, 0.0);
    matrix.setRotate(90, 0.0, 0.0,1);
    u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);

    
    var drawnHead = initVertexBuffersBody(gl,head, vertices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnHead);
}

//draws the mouth
function DrawMouth(gl)
{
  var mouth = new Float32Array([
    -1.0, 0.0, 0.0,0.0,0.0,     
    1.0, 0.0, 0.0,0.0,0.0,
    0.0, -.75, 0.0,0.0,0.0,
  ]);

  var vertices = 3;
  var matrix = new Matrix4();
  matrix.setScale(.5, .5, 1.0);
  matrix.translate(0.0, -.9, 1.0);  
  u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
  gl.uniformMatrix4fv(u_matrix, false, matrix.elements);


  var drawnMouth = initVertexBuffersBody(gl, mouth, vertices);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnMouth);
}

//draws the right tooth
function Drawtooth1(gl)
{
  var tooth = new Float32Array([
    .5,  1.0,  1.0,  1.0,  1.0, 
    .5,  0.0,  1.0,  1.0,  1.0,
    .4,  -.25,  1.0,  1.0,  1.0, 
    .25, -.39, 1.0, 1.0, 1.0,
    0.0,  -.5,  1.0,  1.0,  1.0, 
    -.25,  -.39,  1.0,  1.0,  1.0, 
    -.4, -.25, 1.0, 1.0, 1.0,
    -.5,  0.0,  1.0,  1.0,  1.0, 
    -.5,  1.0,  1.0,  1.0,  1.0,     
    
  ]);

  var vertices = 9;
  var matrix = new Matrix4();
  matrix.setScale(.3, .3, 1.0);
  matrix.translate(-.75, -2.5, 1.0);  
  u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
  gl.uniformMatrix4fv(u_matrix, false, matrix.elements);


  var drawnTooth = initVertexBuffersBody(gl, tooth, vertices);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnTooth);
}

//draws the left tooth
function Drawtooth2(gl)
{
  var tooth = new Float32Array([
     .5,  1.0,  1.0,  1.0,  1.0, 
    .5,  0.0,  1.0,  1.0,  1.0,
    .4,  -.25,  1.0,  1.0,  1.0, 
    .25, -.39, 1.0, 1.0, 1.0,
    0.0,  -.5,  1.0,  1.0,  1.0, 
    -.25,  -.39,  1.0,  1.0,  1.0, 
    -.4, -.25, 1.0, 1.0, 1.0,
    -.5,  0.0,  1.0,  1.0,  1.0, 
    -.5,  1.0,  1.0,  1.0,  1.0,    
    
  ]);

  var vertices = 9;
  var matrix = new Matrix4();
  matrix.setScale(.3, .3, 1.0);
  matrix.translate(0.75, -2.5, 1.0);  
  u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
  gl.uniformMatrix4fv(u_matrix, false, matrix.elements);


  var drawnTooth = initVertexBuffersBody(gl, tooth, vertices);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnTooth);
}

//draws the right eye
function DrawEye(gl)
{
    var matrix = new Matrix4();
    var vertices = 20;
    var newPoints = []; 
    var radius = 1.0;   //radius for the Ellipse
  
    for (var i = 0; i < vertices; i++)
    {
        newPoints.push((radius/2 * Math.cos((i / vertices) * 2.0 * Math.PI)));
  
        newPoints.push(radius * Math.sin((i / vertices) * 2.0 * Math.PI));
        newPoints.push(1.0);
        newPoints.push(1.0);
        newPoints.push(1.0);
  
    }
  
    newPoints.push(newPoints[0]);
    newPoints.push(newPoints[1]);
    
    var pack = new Float32Array(newPoints);
    matrix.setScale(0.45, 0.45, 0.45);
    matrix.translate(0.65, 0.6, 0.0);
    u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);

    
    var drawnPack1 = initVertexBuffersBody(gl,pack, vertices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnPack1);
}

//draws the left eye
function DrawEye2(gl)
{
  var matrix = new Matrix4();
  var vertices = 20;
  var newPoints = []; 
  var radius = 1.0;   //radius for the Ellipse

  for (var i = 0; i < vertices; i++)
  {
      newPoints.push((radius/2 * Math.cos((i / vertices) * 2.0 * Math.PI)));

      newPoints.push(radius * Math.sin((i / vertices) * 2.0 * Math.PI));

      newPoints.push(1.0);
      newPoints.push(1.0);
      newPoints.push(1.0);
  }

  newPoints.push(newPoints[0]);
  newPoints.push(newPoints[1]);
  
  var pack = new Float32Array(newPoints);
  matrix.setScale(0.45, 0.45, 0.45);
  matrix.translate(-0.65,0.6,0.0);
  
  
  u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
  gl.uniformMatrix4fv(u_matrix, false, matrix.elements);

  
  var drawnPack1 = initVertexBuffersBody(gl,pack, vertices);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnPack1);
}

//draws the right pupils
function DrawPupil(gl)
{
    var matrix = new Matrix4();
    var vertices = 20;
    var newPoints = []; 
    var radius = 1.0;   //radius for the Ellipse
  
    for (var i = 0; i < vertices; i++)
    {
        newPoints.push((radius * Math.cos((i / vertices) * 2.0 * Math.PI)));
  
        newPoints.push(radius * Math.sin((i / vertices) * 2.0 * Math.PI));
        newPoints.push(.36);
        newPoints.push(.36);
        newPoints.push(.36);
  
    }
  
    newPoints.push(newPoints[0]);
    newPoints.push(newPoints[1]);
    
    var Pupil = new Float32Array(newPoints);
    matrix.setScale(0.1, 0.1, 0.45);
    matrix.translate(4 + newTranslate1[0], 1 + newTranslate1[1], 0.0);
    u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);

    
    var drawnPupil = initVertexBuffersBody(gl,Pupil, vertices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnPupil);
}

//draws the left pupil
function DrawPupil2(gl)
{
    var matrix = new Matrix4();
    var vertices = 20;
    var newPoints = []; 
    var radius = 1.0;   //radius for the Ellipse
  
    for (var i = 0; i < vertices; i++)
    {
        newPoints.push((radius * Math.cos((i / vertices) * 2.0 * Math.PI)));
  
        newPoints.push(radius * Math.sin((i / vertices) * 2.0 * Math.PI));
        newPoints.push(.36);
        newPoints.push(.36);
        newPoints.push(.36);
  
    }
  
    newPoints.push(newPoints[0]);
    newPoints.push(newPoints[1]);
    
    var Pupil = new Float32Array(newPoints);
    matrix.setScale(0.1, 0.1, 0.45);
    matrix.translate(-4 + newTranslate2[0], 4 + newTranslate2[1], 0.0);
    u_matrix = gl.getUniformLocation(gl.program, 'u_matrix');
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);

    
    var drawnPupil = initVertexBuffersBody(gl,Pupil, vertices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, drawnPupil);
}




function initVertexBuffersBody(gl,VertexArray,Vertices) {
  var verticesColors = VertexArray;
  var n = Vertices;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();  
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

//This updates the position of the pupils
function animate() {
  //x position of right pupil
  if (isAbovex1== false)
  {
    newTranslate1[0] += .1;
  }
  if (isAbovex1 == true)
  {
    newTranslate1[0] -=.1;
  }
  if (newTranslate1[0] >.2)
  {
    isAbovex1 = true;
  }
  if (newTranslate1[0] < -2.4)
  {
    isAbovex1 = false;
  }

// y position of right pupil
  if  (isAbovey1 == false)
  {
    newTranslate1[1] += .15;
  }
  if (isAbovey1 == true)
  {
    newTranslate1[1] -=.15;
  }
  if (newTranslate1[1] >4.0)
  {
    isAbovey1 = true;
  }
  if (newTranslate1[1] < -2.0)
  {
    isAbovey1 = false;
  }

  //y position of left pupil
  if  (isAbovey2 == false)
  {
    newTranslate2[1] += .22;
  }
  if (isAbovey2 == true)
  {
    newTranslate2[1] -=.22;
  }
  if (newTranslate2[1] > 1.8)
  {
    isAbovey2 = true;
  }
  if (newTranslate2[1] < -4.5)
  {
    isAbovey2 = false;
  }

//x position of left pupil
  if  (isAbovex2 == false)
  {
    newTranslate2[0] += .05;
  }
  if (isAbovex2 == true)
  {
    newTranslate2[0] -=.05;
  }
  if (newTranslate2[0] > 2.5)
  {
    isAbovex2 = true;
  }
  if (newTranslate2[0] < -.25)
  {
    isAbovex2 = false;
  }
}