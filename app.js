//var smoothie = new SmoothieChart();//smothie
//smoothie.streamTo(document.getElementById("mycanvas"));//smothie


const audioCtx = new AudioContext();
const button = document.querySelector('button');
let morseWords = new Array();
let morseChar = new Array();
let analyser = audioCtx.createAnalyser();
let source;
analyser.fftSize = 32;

button.addEventListener('click', function() {
    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        getLocalStream();
    }
}, false);


function getLocalStream() {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        window.localStream = stream;
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        setInterval(draw, 1000);
    }).catch( err => {
        console.log("u got an error:" + err)
    });
}
let peak;
let box = document.getElementById('voiceBox');
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);
let spaceCounter = 0;
let oneCounter = 0;
let zeroCounter = 0;

let readingLevel = 50;
let dotDuration = 22;
let dashDuration = 76;
let letterSpacingDuration = dotDuration;
const spaceDuration = dotDuration*6;
const loss = 10;
let line = new TimeSeries(); //smothie

document.getElementById("VolumeValue").innerText  = readingLevel;
document.getElementById("dotDurationValue").innerText = dotDuration;
document.getElementById("dashDurationValue").innerText  = dashDuration;
document.getElementById("letterSpacingDurationValue").innerText  = letterSpacingDuration;

document.getElementById("VolumeEdge").value = readingLevel;
document.getElementById("dotDuration").value = dotDuration;
document.getElementById("dashDuration").value = dashDuration;
document.getElementById("letterSpacingDuration").value = letterSpacingDuration;

document.getElementById("dotDuration").addEventListener("change", function() {
    dotDuration = this.valueAsNumber;
});
document.getElementById("VolumeEdge").addEventListener("change", function() {
    readingLevel = this.valueAsNumber;
});
document.getElementById("dashDuration").addEventListener("change", function() {
    dashDuration = this.valueAsNumber;
});
document.getElementById("letterSpacingDuration").addEventListener("change", function() {
    letterSpacingDuration = this.valueAsNumber;
});

function draw() {
    document.getElementById("VolumeValue").innerText = readingLevel;
    document.getElementById("dotDurationValue").innerText = dotDuration;
    document.getElementById("dashDurationValue").innerText = dashDuration;
    document.getElementById("letterSpacingDurationValue").innerText  = letterSpacingDuration;

    let sum = 0;
    analyser.getByteFrequencyData(dataArray);
    //console.log(dataArray);
    dataArray.forEach( num => {
        sum = sum + num;
    });
    peak = dataArray[1] * 0.2;




    //line.append(new Date().getTime(), peak);
    //smoothie.addTimeSeries(line);
    //smoothie.streamTo(document.getElementById("mycanvas"), 1000 /*delay*/); //smothie

    //console.log(peak);

    box.style.height = String((peak)*5)+'px';
    if (peak > readingLevel) {
        morseChar.push(1);

        zeroCounter = 0;
        oneCounter++;

        //console.log(1);
    }else if (peak < readingLevel) {
        morseChar.push(0);

        oneCounter = 0;
        zeroCounter++;
        //console.log(0);
        if (zeroCounter == letterSpacingDuration) {
            spaceCounter++;
            //console.log(spaceCounter);
        }

    }

    if (spaceCounter == 2) {
        morseWords.push( identifyChar(morseChar) );
        morseChar.length = 0;
        oneCounter = 0;
        zeroCounter = 0;
        spaceCounter = 0;
    }

}

function identifyChar(a){
    //console.log(4);
    a.splice(0, a.indexOf(1, 0));
    a.splice(a.lastIndexOf(1,a.length-1), a.length - 1 - a.lastIndexOf(1,a.length-1));
    let char = '';
    let ones = 0;
    console.log(a);
    for (let i = 0; i < a.length; i++) {

        if (a[i] == 1) {
            ones++;
        } else {
            //if (ones != 0) {console.log(ones);}
            if ((ones > dotDuration - loss) && (ones < dotDuration + loss)){
                char = char + '· ';
            } else if (ones > dashDuration - loss) {
                char = char + '− ';
            }
            ones = 0;
        }
    }
    char = char.trim();

    console.log(char);

    if (char == '· −')      {char = 'А'}
    if (char == '− · · ·')  {char = 'Б'}
    if (char == '· − −')    {char = 'В'}
    if (char == '− − ·')    {char = 'Г'}
    if (char == '− · ·')    {char = 'Д'}
    if (char == '·')        {char = 'Е'}
    if (char == '· · · −')  {char = 'Ж'}
    if (char == '− − · ·')  {char = 'З'}
    if (char == '· ·')      {char = 'И'}
    if (char == '· − − −')  {char = 'Й'}
    if (char == '− · −')    {char = 'К'}
    if (char == '· − · ·')  {char = 'Л'}
    if (char == '− −')      {char = 'М'}
    if (char == '− ·')      {char = 'Н'}
    if (char == '− − −')    {char = 'О'}
    if (char == '· − − ·')  {char = 'П'}
    if (char == '· − ·')    {char = 'Р'}
    if (char == '· · ·')    {char = 'С'}
    if (char == '−')        {char = 'Т'}
    if (char == '· · −')    {char = 'У'}
    if (char == '· · − ·')  {char = 'Ф'}
    if (char == '· · · ·')  {char = 'Х'}
    if (char == '− · − ·')  {char = 'Ц'}
    if (char == '− − − ·')  {char = 'Ч'}
    if (char == '− − − −')  {char = 'Ш'}
    if (char == '− − · −')  {char = 'Щ'}
    if (char == '− − · − −'){char = 'Ъ'}
    if (char == '− · − −')  {char = 'Ы'}
    if (char == '− · · −')  {char = 'Ь'}
    if (char == '· · − · ·'){char = 'Э'}
    if (char == '· · − −')  {char = 'Ю'}
    if (char == '· − · −')  {char = 'Я'}

    console.log(char);
    let utterance = new SpeechSynthesisUtterance(char.toLowerCase());
    speechSynthesis.speak(utterance);
    return char;
}



