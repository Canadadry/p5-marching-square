let WIDTH    = 400;
let HEIGHT   = 400;
let tileSize = 32;
let gridSize = 32;
let tileCol  = 4;
let tileRow  = 4;
let NOISE_W = Math.trunc(WIDTH / gridSize);
let NOISE_H = Math.trunc(HEIGHT / gridSize);
let thresholdSlider,depthSlider,gridSizeSlider,noiseFactorSlider;

function tile(tiles,x,y,id)
{
	let idX = id % tileCol;
	let idY = Math.trunc(id / tileCol);

	image(tiles, 
		x*gridSize  , y*gridSize  , gridSize , gridSize,
		idX*tileSize, idY*tileSize, tileSize , tileSize
	);
}

function setup()
{ 
  createCanvas(WIDTH, HEIGHT);
  tiles = loadImage('assets/tiles.png');
  thresholdSlider = createSlider(0, 100, 50);
  depthSlider     = createSlider(0, 100, 50);
  gridSizeSlider  = createSlider(4, 128, 32);
  noiseFactorSlider  = createSlider(1, 100, 100);

} 

function draw()
{ 
	let threshold = thresholdSlider.value()/100;
	let z = depthSlider.value();
	let noiseFactor = noiseFactorSlider.value()/100;
	gridSize = gridSizeSlider.value();
	NOISE_W = Math.trunc(WIDTH / gridSize);
	NOISE_H = Math.trunc(HEIGHT / gridSize);
	
	background(220);
	
	for(let y = 0; y < NOISE_H - 1 ; y++)
	{
		for(let x = 0; x < NOISE_W -1 ; x++)
		{
			let x0_map  =  x      * noiseFactor ;
			let x1_map  = (x + 1) * noiseFactor ;
			let y0_map  =  y      * noiseFactor ;
			let y1_map  = (y + 1) * noiseFactor ;
			let z_map   =  z      * noiseFactor ;

			let p0 = noise(x0_map  ,y1_map ,z_map) > threshold ? 1 : 0 ;
			let p1 = noise(x1_map  ,y1_map ,z_map) > threshold ? 1 : 0 ;
			let p2 = noise(x1_map  ,y0_map ,z_map) > threshold ? 1 : 0 ;
			let p3 = noise(x0_map  ,y0_map ,z_map) > threshold ? 1 : 0 ;

			let square = p0 + 2 * p1 + 4 * p2 + 8 * p3;

			/*
			 * We are build a numer that represent the whole square
			 *
			 *   p3   p2              1     0
			 *             =>  ex:              => which is the tile 6  
			 *   p0   p1              1     0      third column second row
			 */

			let marchingSquareToTile = [14,2,0,1,8,12,4,11,10,6,13,3,9,7,15,5];
			let tileId = marchingSquareToTile[square];	
			tile(tiles,x,y,tileId);
		}
	}	
}