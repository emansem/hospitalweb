const customAlertWrapper = document.querySelector('.custom__alert--wrapper');
const progressBar = document.querySelector('.progressBar');
const alertMessage = document.querySelector('.alert-message');
console.log(alertMessage)
let sum = 10;
const duration = 2000;
const interval = 100;
let width = 100;
const decrement = (100/(duration/interval)); 



//show the sucess alert 

 export function showSucessAlert(message){
   
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
           }, 1500);
           
        }
    }, interval);
}
