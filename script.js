const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// context pour ctx du coup un GetContex qui va appeler pleins de fonctionalité javascript retourne un contexte de Canva
const img = new Image(); 
// on appelle toute les images du projet du dossier media
img.src = './media/flappy-bird-set.png';

// general settings (reglage générale)

let gamePlaying = false; // écran d'acceuil ou non 
const gravity = .5; // variables pour la graviter
const speed = 6.2; // variables pour la vitesse des poteaux
const size = [51,36]; // la taille de l'oiseau
const jump = -11.5; // le jump de l'oiseau pour le rendre plus dure ou non 
const cTenth = (canvas.width / 10);

// les reglages poteaux

const pipeWidth = 78; // largeur des poteaux 
const pipeGap = 270; // l'écart entre les poteaux
const pipeLoc = () => (Math.random () * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; //fonction pour générer les poteaux
// un emplacement de poteaux avec un math.random la hauteur du canvas.


let index = 0, // variables pour évoluer le jeu pour créer le fond et l'allure des potaux
    bestScore = 0,// le score
    currentScore = 0, // Le score qui commence 
    pipes = [], // les poteaux
    flight,// le vol 
    flyHeight;// la hauteur du vol


 const setup = () => {
     currentScore = 0,
     flight = jump;
     flyHeight = (canvas.height /2) - (size[1] / 2);

     pipes = Array(3).fill().map((a,i) => [canvas.width + (i * (pipeGap + pipeWidth)),
    pipeLoc()]);
    // faire un tableau pour allez vers l'oiseau on pourras le supprimer avec l'array pour recreer un nouveau élement avec toujours 3 elements 
 }


const render = () => { //fonction qui donne le rendu de l'animation 
    index++; //lui qui gere l'animation constamment


    // Backgroung de l'image qui va avancer le décor ( l'élement de droite à gauche)
    ctx.drawImage(img,0, 0, canvas.width, canvas.height, -((index * (speed /2)) % canvas.width)
    + canvas.width, 0,canvas.width, canvas.height);

    ctx.drawImage(img,0, 0, canvas.width, canvas.height, -((index * (speed /2)) % canvas.width)
   ,0,canvas.width, canvas.height); // on enleve une taille de l'image puis donne un background animé

    if (gamePlaying) {
        
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
       flight += gravity;
       flyHeight = Math.min(flyHeight + flight, canvas.height -size[1]); // pour pas que l'oiseau ne tombe pas en dessous de l'image donc on met un blocan


    } else{

    
    ctx.drawImage(img, 432, Math.floor((index % 9) /3)* size[1], ...size, ((canvas.width /2 - size [0] / 2)),flyHeight, ...size);//on peux poiter juste une partie d'une image et le canva le place
    //puis on rajoute les parametres de l'image donc la hautaur et largeur.
    // on calcul avec un math floor pour bouger les ails de facon rapide

    flyHeight = (canvas.height /2) - (size[1]/ 2); 
    // on donne une hauteur au canvas pour l'hauteur de image


    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText('Cliquez pour jouer', 48, 535);
    ctx.font = "bold 30px courier";
    }



    //  afficher les poteaux 
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -=speed; // le premier poteaux va arriver avec -6px
            
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            // poteaux du bas
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] +
                pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1]
                + pipeGap); // ou on le prends (de l'image) ou on le pause dans l'app donc les 3 poteaux sont en bas.

                if(pipe[0] <= -pipeWidth) {
                    currentScore++;
                    bestScore = Math.max(bestScore, currentScore);

                    //remove les poteaux pour ensuite les rajouter

                    pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth,
                    pipeLoc()]]; // formulede tableaux qui sert à mettre plusieurs poteaux en boucle vu qu'il y a toujours 3 poteaux.

                    console.log(pipes);
                
                }

                //si on touche un poteaux donc on va mettre une méthod javascrip every qui met pleins de condiction entre elle
                if ([
                    pipe[0] <= cTenth + size[0],
                    pipe[0] + pipeWidth >= cTenth,
                    pipe[1] > flyHeight|| pipe[1] + pipeGap < flyHeight + size[1]
                ].every(elem => elem)){
                    gamePlaying = false;
                    setup();
                }
        })

    }

document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`; // faire attention au majuscule 
document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

    window.requestAnimationFrame(render); //qui sert à relancer l'animation de facon fluide
}

setup();
img.onload = render;//au chargement de l'image on lance le render
document.addEventListener('click', () => gamePlaying = true); //on met en place le button "cliquez pour jouer"
window.onclick = () => flight = jump; // pour activer les saut et la graviter jump donne la valeur à flight 
