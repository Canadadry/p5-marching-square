let WIDTH    = 400;
let HEIGHT   = 400;
let tileSize = 32;
let gridSize = 32;
let tileCol  = 4;
let tileRow  = 4;
let NOISE_W = Math.trunc(WIDTH / gridSize);
let NOISE_H = Math.trunc(HEIGHT / gridSize);
let thresholdSlider,depthSlider,gridSizeSlider;

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

} 

function draw()
{ 
	let threshold = thresholdSlider.value()/100;
	let z = depthSlider.value();
	gridSize = gridSizeSlider.value();
	NOISE_W = Math.trunc(WIDTH / gridSize);
	NOISE_H = Math.trunc(HEIGHT / gridSize);
	
	background(220);
	
	for(let y = 0; y < NOISE_H - 1 ; y++)
	{
		for(let x = 0; x < NOISE_W -1 ; x++)
		{
			let x0 = noise(x  ,y+1,z) > threshold ? 1 : 0 ;
			let x1 = noise(x+1,y+1,z) > threshold ? 1 : 0 ;
			let x2 = noise(x+1,y  ,z) > threshold ? 1 : 0 ;
			let x3 = noise(x  ,y  ,z) > threshold ? 1 : 0 ;

			let square = x0 + 2 * x1 + 4 * x2 + 8 * x3;

			/*
			 * We are build a numer that represent the whole square
			 *
			 *   x3   x2              1     0
			 *             =>  ex:              => which is the tile 6  
			 *   x0   x1              1     0      third column second row
			 */

			let marchingSquareToTile = [14,2,0,1,8,12,4,11,10,6,13,3,9,7,15,5];
			let tileId = marchingSquareToTile[square];	
			tile(tiles,x,y,tileId);
		}
	}	
}