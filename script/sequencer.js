const Observable = Rx.Observable;

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const allSteps = document.querySelectorAll('.step input');

const audio = {
    bass: document.querySelector('#bass'),
    crash: document.querySelector('#crash'),
    hat: document.querySelector('#hat'),
    snare: document.querySelector('#snare')
};

const allSteps$ = Observable.fromEvent(allSteps, 'change');
const start$ = Observable.fromEvent(startButton, 'click');
const stop$ = Observable.fromEvent(stopButton, 'click');

const initialStepsData = [
    {
        crash: false,
        snare: false,
        bass: false,
        hat: false
    }, {
        crash: false,
        snare: false,
        bass: false,
        hat: false
    }, {
        crash: false,
        snare: false,
        bass: false,
        hat: false
    }, {
        crash: false,
        snare: false,
        bass: false,
        hat: false
    }
]

const changeSteps = (prev, { target }) => {
    const newValue  = target.checked;
    const step = target.parentNode.classList[2].substr(-1);
    const instrument = target.parentNode.parentNode.classList[1];
    prev[step][instrument] = newValue;
    return prev;
}

const playStep = ([step, setup]) => {
    [].slice.call(document.querySelectorAll('.active')).forEach(item => item.classList.remove('active'));
    [].slice.call(document.querySelectorAll(`.step-${step}`)).forEach(item => item.classList.add('active'));
    [].slice.call(document.querySelectorAll('audio')).forEach(item => { item.pause(); item.currentTime = 0 });
    for(let instrument in setup[step]) {
        if(setup[step][instrument]) {
            const player = audio[instrument];
            player
                .play()
                .then(() => console.log(`playing ${instrument}`))
                .catch(err => console.error(err));
        }
    }
}

const timer$ = Observable
    .interval(300)
    .take(4)
    .repeat()
    .takeUntil(stop$);

const steps$ = allSteps$
    .startWith(initialStepsData)
    .scan(changeSteps)

const sequenser$ = start$
    .switchMapTo(timer$)
    .withLatestFrom(steps$)
    .subscribe(playStep);
