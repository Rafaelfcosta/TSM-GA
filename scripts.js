let PLACES_AMOUNT = 12;
let places = [];

let bestDistance = Infinity;
let bestSoFar = [];

let population = [];
let popSize = 300;
let fitness = [];

let gen = 0;
let bestGen = 0;

var minDist = Infinity;
var bestNow;

let flag = false;

function setup() {
    marker = loadImage('assets/ping.png');
    map = loadImage('assets/map.png');

    createCanvas(1009, 646);

    let order = [];
    for (let i = 0; i < PLACES_AMOUNT; i++) {
        let point = createVector(random(100, width - 250), random(50, height - 50));
        places[i] = point;
        order[i] = i;
    }

    for (let i = 0; i < popSize; i++) {
        population[i] = order.slice();
        shuffle(population[i], true);
    }
}

function draw() {

    background(0);
    image(map, 0, 0)

    minDist = Infinity;

    fill(0);
    stroke(255);
    strokeWeight(5);
    textSize(32);
    text('Current gen: ' + gen, 10, 30);
    text('Best path gen: ' + bestGen, 10, 635);

    calcFitness();
    normalizeFitness();
    nextGen();

    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < bestNow.length; i++) {
        let pos = bestNow[i]
        vertex(places[pos].x, places[pos].y);
    }
    endShape();

    stroke(245, 245, 0);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let i = 0; i < bestSoFar.length; i++) {
        let pos = bestSoFar[i]
        image(marker, places[i].x - 40 / 2, places[i].y - 40 / 2, 40, 40)
        vertex(places[pos].x, places[pos].y);
    }
    endShape();

    if (flag) {
        for (let i = 0; i < bestSoFar.length; i++) {
            let pos = bestSoFar[i]
            fill(0)
            stroke(255);
            strokeWeight(2);
            textSize(32);
            text(pos, places[pos].x + 15, places[pos].y + 10);
        }
    }

}

function swap(a, i, j) {
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

function mouseClicked() {
    flag = !flag;
}

function calcDistance(points, order) {
    let sum = 0;
    for (let i = 0; i < order.length - 1; i++) {
        let placeAIndex = order[i];
        let placeA = points[placeAIndex];
        let placeBIndex = order[i + 1];
        let placeB = points[placeBIndex];
        let distance = dist(placeA.x, placeA.y, placeB.x, placeB.y);
        sum += distance;
    }
    return sum;
}

function calcFitness() {
    for (let i = 0; i < population.length; i++) {
        let d = calcDistance(places, population[i])
        if (d < bestDistance) {
            bestDistance = d;
            bestSoFar = population[i];
            bestGen = gen;

            console.log(bestSoFar);
        }

        if (d < minDist) {
            minDist = d;
            bestNow = population[i];
        }

        fitness[i] = 1 / (d);
    }

}

function normalizeFitness() {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

function nextGen() {
    let newPop = [];
    for (let i = 0; i < population.length; i++) {
        let order = pickOne(population, fitness);
        mutate(order);
        newPop[i] = order;
    }
    population = newPop;
    gen++
}

function pickOne(list, prob) {
    var i = 0;
    var rand = random(1);

    while (rand > 0) {
        rand = rand - prob[i];
        i++
    }
    i--;
    return list[i].slice();
}

function mutate(order) {
    let iA = floor(random(order.length));
    let iB = floor(random(order.length));
    swap(order, iA, iB);
}