//fonction pour creer un p dans le body et ecrire dedans
function start(){
	d3.select("body")
		.append("p")
		.text("Hello World !")
}

//fonction pour creer une carte interactive en mode globe terrestre
function IntMap(boxName){
	var width = 960,
		height = 960;
	
    var sp = [-46.593018, -23.58916]
        ny = [-73.935242, 40.730610];
    
    var scale,
        translate,
        visibleArea, // minimum area threshold for points inside viewport
        invisibleArea; // minimum area threshold for points outside viewport
    
    var zoom = d3.zoom()
        .on("zoom", zoomed);
    
	var canvas = d3.select(boxName)
		.append("svg")
		.attr("width",width)
		.attr("height",height);
		
	/* Defini la projection comme la projection orthographic d3
	https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md */	
	var projection = d3.geoMercator()
		//defini l'echelle de la projection (distance entre les points affiches)
		.scale(150)
		//defini le offset x,y de la projection (où placer le centre a 0,0 degrees dans le canvas ?)
		.translate([width / 4, height / 4])
		//sets the projection’s clipping circle radius
		//.clipAngle(90);
    
	//variable necessaire pour afficher des donnees geographiques
	var path = d3.geoPath()
		//defini la projection
		.projection(projection);
	
	//variable pour definir l'intensite de rotation en longitude	
	var x = d3.scaleLinear()
		.domain([0, width])
		.range([-180, 180]);
	
	//variable pour definir l'intensite de rotation en latitude
	var y = d3.scaleLinear()
		.domain([0, height])
		.range([90, -90]);
    
	/*pour le svg, quand la souris se deplace, recalcule la projection 
	chaques points dans la page */
	/*canvas.on("mousemove", function() 
		{	//recupere la position de la souris dans la page
			var p = d3.mouse(this);
			//calcule la projection en 3D
			projection.rotate([x(p[0]), y(p[1])]);
			/*dans le svg, selectionne tous les chemins et selectionne l'attribut 
			"d" (qui n'existe pas... ou correspond a d de data) et retourne son path
			canvas.selectAll("path").attr("d", path);
		});*/
	
	/*recupere la donnees dans le fichier indique et s'il s'ouvre, dans le svg, 
	ajoute des points, selon les features dans le topojson*/
	d3.json("./json/world-110m.json", function(error, world){
	  		if (error) throw error;
			
            //projection.scale(800).translate([width / 2, height / 2]).center(ny)
            
			//dans la zone du svg, ajoute l'attribut path et des infos dedans
			canvas.append("path")
				//selectionne chaque features du fichier world
				.datum(topojson.feature(world, world.objects.countries))
				//cree une class land
				.attr("class", "countries")
				//change la couleur des continents
				.attr("fill", "red")
				//place les valeurs de land du json dans la class land avec les datas (d) de path
				.attr("d", path)
                .call(zoom.transform, zoomTo(ny, 800));
            //loop();
            //d3.interval(loop, 1820);
            console.log('pro', loop)
    });

function zoomTo(location, scale) {
  var point = projection(location);
  return d3.zoomIdentity
    .translate(width / 2 - point[0] * scale, height / 2 - point[1] * scale)
    .scale(scale);
}

function zoomed(d) {
  var z = d3.event.transform;
  translate = [z.x, z.y];
  scale = z.k;
  visibleArea = 1 / scale / scale;
  invisibleArea = 200 * visibleArea;
  //context.clearRect(0, 0, width, height);
  //context.beginPath();
  path(d);
  //context.stroke();
  }
    
function loop() {
    canvas.transition()
      .duration(900)
        .call(zoom.transform, zoomTo(sp, 6))
      .transition() 
      .duration(900)
        .call(zoom.transform, zoomTo(ny, 4))
  }
}