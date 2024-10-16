// Copyright (c) Andre Roldan
// Licensed under the MIT license

(function () {
    // Set document title and heading
    onLangChange(i18n => {
        document.title = i18n.title;
        document.getElementById('heading').innerText = i18n.title;
    });

    let time = 0;
    let paused = false;
    let speed = 1;

    const selector = document.getElementById('selector');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const scripts = {
        oscillatoryMotionSpring: oscillatoryMotionSpring(canvas, ctx),
        oscillatoryMotionPendulum: oscillatoryMotionPendulum(canvas, ctx)
    };
    let selected = Object.keys(scripts).at(0);

    // Master Controls
    {
        const playPauseButton = document.getElementById('play-pause');
        onLangChange(i18n => playPauseButton.innerText = paused ? i18n.play : i18n.pause);
        playPauseButton.onclick = event => {
            paused = !paused;
            playPauseButton.innerText = paused ? currentLang.play : currentLang.pause;
        };

        const resetTimeButton = document.getElementById('reset-time');
        onLangChange(i18n => resetTimeButton.innerText = i18n.strings.resetTime);
        resetTimeButton.onclick = event => {
            time = 0;
        };

        const speedInput = document.getElementById('speed');
        const speedLabel = document.getElementById('speed-label');
        onLangChange(i18n => speedLabel.innerText = `${i18n.speed}: ${speed}x`);
        speedInput.oninput = event => {
            speed = Number(speedInput.value);
            speedLabel.innerText = `${currentLang.speed}: ${speed}x`;
        };
    }

    // Draws sliders for the parameters a script declares
    function createSliders(parameters) {
        if (!parameters) return;
        const controls = document.getElementById('controls');
        for (const parameter of parameters) {
            const container = document.createElement('div');
            const label = document.createElement('label');
            onLangChange(i18n => label.innerText = ` ${i18n[parameter.type]} (${parameter.varName})`);
            container.appendChild(label);

            const slider = document.createElement('input');
            const unit = document.createElement('span');
            unit.innerText = ` ${parameter.initialValue} ${parameter.unit}`;

            slider.type = 'range';
            slider.min = parameter.min;
            slider.max = parameter.max;
            slider.step = parameter.step;
            slider.value = parameter.initialValue;
            slider.oninput = event => {
                const val = Number(event.target.value);
                unit.innerText = ` ${val} ${parameter.unit}`;
                parameter.onChange(val);
            };
            container.appendChild(slider);
            container.appendChild(unit);
            controls.appendChild(container);
        }
    }

    // Initial setup
    createSliders(scripts[selected].setup());

    // Add buttons for each script
    for (const [ key, script ] of Object.entries(scripts)) {
        const button = document.createElement('button');
        onLangChange(i18n => button.innerText = i18n.scripts[key].label);
        button.onclick = event => {
            if (selected !== key) {
                // Remove old sliders
                controls.textContent = '';

                // Clear our canvas and redraw
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const parameters = script.setup();
                createSliders(parameters);

                time = 0;
                selected = key;
            }

            event.preventDefault();
            event.stopPropagation();
        };
        selector.appendChild(button);
    }

    // Main loop for the selected script
    setInterval(() => {
        if (paused) return;

        const loop = scripts[selected].loop;
        if (loop) loop(time, canvas, ctx);

        time += speed;
        if (time >= Number.MAX_SAFE_INTEGER) {
            time = 0;
        }
    }, 1);
})();