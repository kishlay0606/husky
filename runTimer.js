let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
console.time('timer')
// for(let index in arr) {
//     setTimeout(() => {
//         console.log('External' + arr[index] + ':');
//         console.timeLog('timer');
//         runInIntervals(arr[index]);
//     }, (arr[index] - 1)*3*1000);
// }

// function runInIntervals(item) {
//     setInterval(() => {
//         console.log('Internal' + item + ':');
//         console.timeLog('timer');
//     }, 1000 * 60)
// }

async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            resolve();
        }, time * 1000);
    })
}
async function run(){
    let index = 0;
    while(true) {
        console.log(index);
        //get_branch_details;
        //refresh_token_grubhub
                //get branch_token


        console.timeLog('timer');
        index++;
        index = index % arr.length;
        await delay(3);
    }
}
async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            resolve();
        }, time * 1000);
    })
}
async function run1(){
    let index = 0;
    while(true) {
        console.log(index);
        //get//orders-grubhub
        //get order_uber
        //get_orders//postmates

        console.timeLog('timer');
        index++;
        index = index % arr.length;
        await delay(3);
    }
}

run()