const customAlertWrapper = document.querySelector('.custom__alert--wrapper');
const progressBar = document.querySelector('.progressBar');
const failedProgressBar = document.querySelector('.failedProgressBar');
const alertMessage = document.querySelector('.alert-message');
const failedAlerMessage = document.querySelector('.failedAler-Message');
const faild__alert = document.querySelector('.faild__alert');
console.log(alertMessage)
let sum = 10;
const duration = 2000;
const interval = 100;
let width = 100;
const decrement = (100/(duration/interval)); 



//show the sucess alert 

 export function showSucessAlert(message){
    customAlertWrapper.style.display = 'block';
    alertMessage.innerHTML = message;
    const intervalId = setInterval(() => {
        width-=decrement;
        progressBar.style.width = width +'%'
        if(width<= 0){
            clearInterval(intervalId);
              progressBar.style.width = '0%'
            // customAlertWrapper.classList.add('removeAnimationAlert');
           setTimeout(() => {
            customAlertWrapper.style.display = 'none';
           }, 2000);
           
        }
    }, interval);
}

export function failedsAlert(message){
    faild__alert.style.display = 'block';
    failedAlerMessage.innerHTML = message;
    const intervalId = setInterval(() => {
        width-=decrement;
        failedProgressBar.style.width = width +'%'
        if(width<= 0){
            clearInterval(intervalId);
            failedProgressBar.style.width = '0%'
            // customAlertWrapper.classList.add('removeAnimationAlert');
           setTimeout(() => {
            faild__alert.style.display = 'none';
           }, 1500);
           
        }
    }, interval);
}
