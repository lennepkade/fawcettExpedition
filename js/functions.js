//fonction pour creer un p dans le body et ecrire dedans
function start()
{
	d3.select("body")
		.append("p")
		.text("Hello World !")
}

//fonction pour creer une carte interactive en mode globe terrestre
function IntMap(boxName)
{
	var width = 960,
		height = 960;
		
	var canvas = d3.select(boxName)
		.append("svg")
		.attr("width",width)
		.attr("height",height);
		
	/* Defini la projection comme la projection orthographic d3
	https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md */	
	var projection = d3.geoOrthographic()
		//defini l'echelle de la projection (distance entre les points affiches)
		.scale(150)
		//defini le offset x,y de la projection (où placer le centre a 0,0 degrees dans le canvas ?)
		.translate([width / 4, height / 4])
		//sets the projection’s clipping circle radius
		.clipAngle(90);
	
	//variable necessaire pour afficher des donnees geographiques
	var path = d3.geoPath()
		//defini la projection
		.projection(projection);
	
	//variable pour definir l'intensite de rotation en longitude	
	var λ = d3.scaleLinear()
		.domain([0, width])
		.range([-180, 180]);
	
	//variable pour definir l'intensite de rotation en latitude
	var φ = d3.scaleLinear()
		.domain([0, height])
		.range([90, -90]);
	
	//cree un svg avec les dimensions definies avant
	/*var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);*/
	
	/*pour le svg, quand la souris se deplace, recalcule la projection 
	chaques points dans la page */
	canvas.on("mousemove", function() 
		{	//recupere la position de la souris dans la page
			var p = d3.mouse(this);
			//calcule la projection en 3D
			projection.rotate([λ(p[0]), φ(p[1])]);
			/*dans le svg, selectionne tous les chemins et selectionne l'attribut 
			"d" (qui n'existe pas... ou correspond a d de data) et retourne son path*/
			canvas.selectAll("path").attr("d", path);
		});
	
	/*recupere la donnees dans le fichier indique et s'il s'ouvre, dans le svg, 
	ajoute des points, selon les features dans le topojson*/
	d3.json("/ProjectZ/fawcettExpedition/world-110m.json", function(error, world)
		{
	  		if (error) throw error;
			
			//dans la zone du svg, ajoute l'attribut path et des infos dedans
			canvas.append("path")
				//selectionne chaque features du fichier world
				.datum(topojson.feature(world, world.objects.countries))
				//cree une class land
				.attr("class", "countries")
				//change la couleur des continents
				.attr("fill", "red")
				//place les valeurs de land du json dans la class land avec les datas (d) de path
				.attr("d", path);
		});
}