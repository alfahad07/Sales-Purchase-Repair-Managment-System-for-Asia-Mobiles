window.addEventListener('load', ev =>{

    let loggedUser = getServiceRequest("/loggeduser")
    liaLoggedUser.innerText = loggedUser.username;

    let moduleList  = getServiceRequest("/modulename/byuser/"+loggedUser.username);

    for (let index in moduleList){

        if (document.getElementById(moduleList[index]) != null)
            document.getElementById(moduleList[index]).remove();

    }


})

const signOutFunction = () => {
  let userConfirm = confirm("Are You sure to Logged Out..?");

  if(userConfirm){
      window.location.replace("/logout");
  }
}