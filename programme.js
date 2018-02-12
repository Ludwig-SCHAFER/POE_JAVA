//letiable globale correspondant à la date actuelle ±quelques millisecondes
let maintenant = new Date();





//trouve la date de find d'un module en prenant en compte les jours feriés.
function findLastDate(startDate, duration)
{
	let start = new Date(startDate);
	let targetDate = new Date();
	let lastDate = new Date();
	let day_in_milliseconds = 1000*60*60*24;
	let shift = 0;

	for (let i = 1; i < duration; i++)
	{
		shift++;
		//ajoute + un jour converti en millisecondes
		//et vérifie que ce n'est ni un weekend ni un jour de la semain de congés
		targetDate.setTime(start.getTime() + day_in_milliseconds * i);

		let flag = false;
		if (targetDate.getDay() == 6)
		{
			flag = true;
		}
		if (targetDate.getDay() == 0)
		{
			flag = true;
		}
		if (targetDate.getDate() > 22 && targetDate.getMonth() == 11)
		{
			flag = true;
		}
		if (targetDate.getDate() == 01 && targetDate.getMonth() == 0)
		{
			flag = true;
		}
		if (flag)
		{
			//si c'est un samedi, il faut le prendre en compte
			//si c'est un dimanche, il faut le prendre en compte
			//si c'est APRèS le vendredi 22 décembre, il faut le prendre en compte
			//si c'est le 1er de l'an, il faut le prendre en compte
			duration++;
			flag = false;
		}
	}
	lastDate.setTime(startDate.getTime() + day_in_milliseconds * (shift));
	//ajout d'un offset pour que la date de fin soit calée sur 17:00
	return lastDate.getTime() + day_in_milliseconds*17/24;
}


//renvoie une chaine de caractère en français, correspondant au jour de la semaine passé en paramètre
function jour_en_fr(j)
{
	let jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
	return jours[j];
}




/*
 * Les données de l'email d'acceptation fourni par A.F.
 * Chaque module est présenté sous forme d'un objet.
 */

let modules = [
	{name:"Algorithmique et bases de la programmation",			duration:4,	coach:"Jérémy R", start:"2017-12-11"},
	{name:"UML",												duration:3,	coach:"Jérémy R", start:"2017-12-15"},
	{name:"HTML 5 + CSS3",										duration:2,	coach:"Sébastien P", start:"2017-12-20"},
	{name:"Javascript/ Angular",								duration:5,	coach:"Jean-Frédéric V (1 jour) + Cyril M (4 jours)", start:"2017-12-22"},
	{name:"Les API de HMTL5 et CSS3",							duration:2,	coach:"Samuel B", start:"2018-01-08"},
	{name:"Démarche Agile et SCRUM",							duration:2,	coach:"Jérémy R", start:"2018-01-10"},
	{name:"Ecrits professionnels et atelier de candidature",	duration:2,	coach:"Frank A", start:"2018-01-12"},
	{name:"Java - Les fondamentaux et le développement JavaSE",	duration:5,	coach:"Aymeric L", start:"2018-01-16"},
	{name:"JPA - Persistence des données (Hibernate)",			duration:3,	coach:"Alexandre T", start:"2018-01-23"},
	{name:"Java - Programmation client",						duration:3,	coach:"Yves D", start:"2018-01-26"},
	{name:"JavaEE - Mise en œuvre des services",				duration:5,	coach:"Yves D", start:"2018-01-31"},
	{name:"JavaEE - Développement web",							duration:5,	coach:"Yves D", start:"2018-02-07"},
	{name:"JSF 2 - Java Server Faces",							duration:3,	coach:"Georges A", start:"2018-02-14"},
	{name:"Spring 4 Framework",									duration:5,	coach:"Jeremy R ??", start:"2018-02-19"},
	{name:"Usine logicielle Java",								duration:3,	coach:"Jeremy R ??", start:"2018-02-26"},
	{name:"Sécurité applicative Java",							duration:3,	coach:"Yves D ??", start:"2018-03-01"},
	{name:"Travaux pratiques et passage de la certification \"M2i langage de développement orientée Java\"",	duration:2, coach:"Judge Dredd ??", start:"2018-03-06"}
];

//letiables utilisées pour compter la somme des heures et des jours
let duree_j = 0;
let duree_h = 0;

//élement de référence du tableau en HTML qui va servir de point d'entrée
let tbody = document.getElementById('programme_tbody');
tbody.innerHTML = null;
//je purge le contenu du tableau

//pour chaque Objet présent dans le tableau de données
for (let i = 0; i < modules.length; i++)
{
	//création des futurs élement HTML qui composeront chaque ligne du tableau.
	// une ligne c'est : une rangée + N cellules (ici N = 3)
	let rangee;
	let celulle_nom;
	let celulle_duree_h;
	let celulle_duree_j;
	let celulle_date_debut;
	let celulle_date_fin;
	let celulle_coach;

	rangee = document.createElement("tr");

	celulle_nom	       = document.createElement("td");
	celulle_duree_h    = document.createElement("td");
	celulle_duree_j    = document.createElement("td");
	celulle_date_debut = document.createElement("td");
	celulle_date_fin   = document.createElement("td");
	celulle_coach      = document.createElement("td");


	//ajout du contenu de chaque cellule
	celulle_nom.appendChild(    document.createTextNode(modules[i].name));
	celulle_duree_j.appendChild(document.createTextNode(modules[i].duration));
	celulle_duree_h.appendChild(document.createTextNode(modules[i].duration * 7 ));
	celulle_coach.appendChild(  document.createTextNode(modules[i].coach));

	let date_debut = new Date(modules[i].start);
	let date_fin = new Date();
	date_fin.setTime(findLastDate(date_debut, modules[i].duration));

	celulle_date_debut.appendChild(document.createTextNode(jour_en_fr(date_debut.getDay()) + " " + date_debut.toLocaleDateString()));
	celulle_date_fin.appendChild(  document.createTextNode(jour_en_fr(date_fin.getDay()) + " " + date_fin.toLocaleDateString()));


	//ajout de classes CSS à la rangée en fonction de la position temporelle du module
	if (maintenant.getTime() > date_fin.getTime())
	{
		//module passé
		rangee.setAttribute("class", "module_passe");
	}
	else if (maintenant.getTime() < date_debut.getTime())
	{
		//module futur
		rangee.setAttribute("class", "module_futur");
	}
	else
	{
		//module en cours
		rangee.setAttribute("class", "module_actuel");
	}

	//ajout de chaque cellule dans la rangée
	rangee.appendChild(celulle_duree_h);
	rangee.appendChild(celulle_duree_j);
	rangee.appendChild(celulle_nom);
	rangee.appendChild(celulle_date_debut);
	rangee.appendChild(celulle_date_fin);
	rangee.appendChild(celulle_coach);

	//ajout de la rangée au tableau
	tbody.appendChild(rangee);

	//calcul de la somme des heures et des jours
	duree_j += modules[i].duration;
	duree_h += modules[i].duration * 7;
}
//ajout de la somme des heures et des jours dans les cellules correspondantes
document.getElementById('programme_footer_duree_j').appendChild(document.createTextNode(duree_j));
document.getElementById('programme_footer_duree_h').appendChild(document.createTextNode(duree_h));


