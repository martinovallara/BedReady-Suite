

const myPromise = (name: string): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        // after 1 second...generate a random number between 1 and 10
        // if even reject, if odd resolve

        setTimeout(() => {
            const randomNumber = Math.floor(Math.random() * 10) + 1
            if (randomNumber % 2 === 0) {
                reject(`promise ${name}: non valido è pari! -> ${randomNumber}`)
            } else {
                resolve(randomNumber)
            }
        }, 1000)
    })
}

const performPromises = async () => {

    try {
        const result = await myPromise("first");
        console.log("success 1: ", result);
        const result2 = await myPromise(`second: ${result}`);
        console.log("success 2: ", result2);
    } catch (error) {
        console.log("error: ", error);
    }
}
// wait the execution of promise for 5 second and print "end of program"
console.log("myPromises setting up, waiting...");
await performPromises();
console.log("end of program");



