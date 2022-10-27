const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;
road.draw(carCtx);

const maxCars = 1000;
const mutateAmount = 0.2
let mutateAmountAdder = 0;

let cars = [];


// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), 150, road.width - 5, 10, "DUMMY", 2.9, "black", "shape"),
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(1), -950, 30, 50, "DUMMY", 2, "darkred"),
    new Car(road.getLaneCenter(0), -1100, 30, 50, "DUMMY", 2, "darkred")
];



// animate();

function saveBrain() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discardBrain() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
};

function animateAll() {
    let animateXCars = document.getElementById("numberOfCars").value;
    let animateXSensors = document.getElementById("numberOfSensors").value;

    if (animateXCars != "") {
        cars.splice(parseInt(animateXCars));
    }
    if (animateXSensors != "") {
        animateXSensors = parseInt(document.getElementById("numberOfSensors").value)
        for (let i = 0; i < cars.length; i++) {
            cars[i].sensor.rayCount = animateXSensors;
        }
    }

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));


    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75);



    road.draw(carCtx);
    traffic[0].draw(carCtx, "black");
    for (let i = 1; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "darkred");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);


    carCtx.restore();

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animateAll);

}

function startMoving() {

    cars = generateCars(maxCars);
    mutateAmountAdder = document.getElementById("mutationRange").value / 66.66;

    let bestCar = cars[0];
    if (localStorage.getItem("bestBrain")) {
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain = JSON.parse(
                localStorage.getItem("bestBrain"));
            if (i != 0) {
                console.log(mutateAmount + mutateAmountAdder)
                NeuralNetwork.mutate(cars[i].brain, mutateAmount + mutateAmountAdder);
            }
        }
    }

    animateAll();

}

function stopMoving() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].startMoving = false;

    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].startMoving = false;
    }
    location.reload();

}