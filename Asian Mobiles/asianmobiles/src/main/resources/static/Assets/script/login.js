window.addEventListener('load', ev =>{

    let loggedUser = getServiceRequest("/loggeduser")

    let moduleList  = getServiceRequest("/modulename/byuser/"+loggedUser.username);

    for (let index in moduleList){

        if (document.getElementById(moduleList[index]) != null)
            document.getElementById(moduleList[index]).remove();

    }


})