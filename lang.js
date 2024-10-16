const lang = {
    es: {
        name: 'Español',
        title: 'Simulador de Física',
        mass: 'Masa',
        springConstant: 'Constante del resorte',
        amplitude: 'Amplitud',
        dampingCoefficient: 'Coeficiente de amortiguamiento',
        speed: 'Velocidad',
        play: 'Reproducir',
        pause: 'Pausar',
        scripts: {
            oscillatoryMotionSpring: {
                label: 'Movimiento Oscilatorio (Resorte)',
            },
            oscillatoryMotionPendulum: {
                label: 'Movimiento Oscilatorio (Péndulo)',
            },
        },
        strings: {
            resetTime: 'Reiniciar Tiempo',
        },
    },
    en: {
        name: 'English',
        title: 'Physics Simulator',
        mass: 'Mass',
        springConstant: 'Spring Constant',
        amplitude: 'Amplitude',
        dampingCoefficient: 'Damping Coefficient',
        speed: 'Speed',
        play: 'Play',
        pause: 'Pause',
        scripts: {
            oscillatoryMotionSpring: {
                label: 'Oscillatory Motion (Spring)',
            },
            oscillatoryMotionPendulum: {
                label: 'Oscillatory Motion (Pendulum)',
            },
        },
        strings: {
            resetTime: 'Reset Time',
        },
    }
};

let currentLang = lang.es;

const onLangChange = (function () {
    const listeners = [];

    // Load languages into the language select input
    const languageSelect = document.getElementById('lang');
    for (const language in lang) {
        const option = document.createElement('option');
        option.value = language;
        option.innerText = lang[language].name;
        languageSelect.appendChild(option);
    }

    languageSelect.value = 'es';
    languageSelect.onchange = event => {
        currentLang = lang[languageSelect.value];
        for (const listener of listeners) {
            listener(lang[languageSelect.value]);
        }
    };

    return cb => {
        cb(currentLang);
        listeners.push(cb);
    };
})();