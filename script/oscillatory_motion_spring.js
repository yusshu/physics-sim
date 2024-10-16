// Copyright (c) Andre Roldan
// Licensed under the MIT license

function oscillatoryMotionSpring(canvas, ctx) {
    const floorHeight = 30;
    const wallWidth = 40;
    const blockWidth = 60;
    const blockHeight = 60;
    const springInitialWidth = 250;
    const springHeight = 30;
    const springSpiralCount = 40;

    // Parameters (in SI units)
    let mass = 5; // kg
    let springConstant = 20; // N/m
    let amplitude = 160; // m
    let dampingCoefficient = 0; // Ns/m

    // Computable parameters (in SI units)
    let w; // Angular frequency (rad/s)

    onParameterUpdate();

    function setup() {
        const width = canvas.width;
        const height = canvas.height;

        // Draw wall and floor
        let gradient = ctx.createLinearGradient(width/2, height/2, 0, height);
        gradient.addColorStop(0, '#cbcbcb');
        gradient.addColorStop(1, '#1f1b21');
        ctx.fillStyle = gradient;

        // Floor
        ctx.fillRect(0, height - floorHeight, width, floorHeight);

        // Wall
        ctx.fillRect(0, 0, wallWidth, height - floorHeight);

        return [
            {
                type: 'mass',
                varName: 'm',
                initialValue: mass,
                unit: 'kg',
                min: 1,
                max: 100,
                step: 0.5,
                onChange: value => {
                    mass = value;
                    onParameterUpdate();
                }
            },
            {
                type: 'springConstant',
                varName: 'k',
                initialValue: springConstant,
                unit: 'N/m',
                min: 1,
                max: 200,
                step: 1,
                onChange: value => {
                    springConstant = value;
                    onParameterUpdate();
                }
            },
            {
                type: 'amplitude',
                varName: 'A',
                initialValue: amplitude,
                unit: 'm',
                min: 1,
                max: 200,
                step: 0.5,
                onChange: value => {
                    amplitude = value;
                    onParameterUpdate();
                }
            },
            {
                type: 'dampingCoefficient',
                varName: 'b',
                initialValue: dampingCoefficient,
                unit: 'Ns/m',
                min: 0,
                max: 0.05,
                step: 0.001,
                onChange: value => {
                    dampingCoefficient = value;
                    onParameterUpdate();
                }
            }
        ];
    }

    function onParameterUpdate() {
        w = Math.sqrt(springConstant / mass - Math.pow(dampingCoefficient / (2 * mass), 2));
    }

    function loop(time) {
        // Clear rect that doesn't include the wall and floor
        ctx.clearRect(wallWidth, 0, canvas.width - wallWidth, canvas.height - floorHeight);

        // Compute position of the object (oscillatory movement)
        let x = amplitude * Math.exp(-(dampingCoefficient / (2 * mass)) * time) * Math.cos(w * time / 100);

        // Draw spring
        {
            ctx.fillStyle = '#4d4d4d';
            const springWidth = springInitialWidth + x;
            const y = canvas.height - floorHeight - blockHeight / 2;
            ctx.strokeStyle = '#494949';
            ctx.beginPath();
            ctx.moveTo(wallWidth, y);
            ctx.lineTo(wallWidth + 10, y);

            const spiralWidth = springWidth - 20;
            const divisor = springSpiralCount * 2 - 1;
            let springX = wallWidth + 10;
            for (let i = 0; i < divisor - 1; i++) {
                springX += spiralWidth / divisor;
                let sign = i % 2 === 0 ? 1 : -1;
                ctx.lineTo(springX, y + sign * springHeight / 2);
            }
            ctx.lineTo(wallWidth + springWidth - 10, y);
            ctx.lineTo(wallWidth + springWidth, y);
            ctx.stroke();
        }

        // Draw object
        ctx.fillStyle = '#696969';
        ctx.fillRect(wallWidth + springInitialWidth + x, canvas.height - floorHeight - blockHeight, blockWidth, blockHeight);
    }

    return { setup, loop };
}