
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=USER")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

}

//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    users = new Array();

    users = getServiceRequest("/user/findall");

    //create display property list
    let DisplayPropertyList = ['employee_id.number','employee_id.fullname','username','role','email','status'];

    //create display property list type
    let DisplayPropertyListType = ['object','object','text',getUserRoles,'text',getUserStatus];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableUser, users, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in users){

        if(users[index].status == "0")
            tableUser.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableUser').dataTable();

}

const refreshForm = () => {


    user = new Object();
    oldUser = null;

    user.role = new Array();

    employeeName = getServiceRequest("/employee/allemployee")
    fillSelectFeild(userEmpName, "Select Employee Name", employeeName, "fullname", "")

    roles = getServiceRequest("/role/findall")

    divRoles.innerHTML = "";

    for (let index in roles) {

        let divCheck = document.createElement("div")
        divCheck.classList.add("form-check");

        let inputCheck = document.createElement("input")
        inputCheck.type = "checkbox";
        inputCheck.classList.add("form-check-input");

        inputCheck.onchange = function (params) {

            if (inputCheck.checked) {

                user.role.push(roles[index]);

            } else {

                for (let ind in user.roles) {

                    if(user.roles[ind].name == "Admin")
                        user.roles[ind].name.style.display = "none"

                    if (user.roles[ind].id == roles[index].id) {

                        user.roles.splice(ind, 1);

                    }

                }

            }
        }

        let labelCheck = document.createElement("label");
        labelCheck.classList.add("form-check-label");
        labelCheck.classList.add("fw-bold");
        labelCheck.style.color = "grey"
        labelCheck.innerHTML = roles[index].name;

        divCheck.appendChild(inputCheck);
        divCheck.appendChild(labelCheck);
        divRoles.appendChild(divCheck);

    }

    //ENABLING THE THESE FIELDS FROM DISABLED FOR EDITING...
    userEmpName.enabled = true;

    userName.style.color = "grey";
    $('#userName').css("pointer-events", "all");
    $('#userName').css("cursor", "pointer");


    userPassword.style.color = "grey";
    $('#userPassword').css("pointer-events", "all");
    $('#userPassword').css("cursor", "pointer");


    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE EMPLOYEE
    userEmpName.style.color        = "grey";
    userEmpName.style.borderBottom = "none"

    userEmpName.value            = "";
    userName.value               = "";
    userPassword.value           = "";
    userEmail.value              = "";
    switchUserStatus.checked     = false;
    labelUserStatus.innerText    = "Select User Status"
    labelUserStatus.style.color  = "grey";

    disableAddUpdateBtn(true, false);

}

const disableAddUpdateBtn = (addBtn, updBtn) => {


    if( addBtn && loggedUserPrivilage.ins ){

        btnAdd.disabled = false;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "pointer");


    }else {

        btnAdd.disabled = true;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "not-allowed");

    }


    if( updBtn && loggedUserPrivilage.upd ){

        btnUpdate.disabled = false;
        $('#btnUpdate').css("pointer-events", "all");
        $('#btnUpdate').css("cursor", "pointer");


    }else {

        btnUpdate.disabled = true;
        $('#btnUpdate').css("pointer-events", "all");
        $('#btnUpdate').css("cursor", "not-allowed");

    }


}


//CREATE FUNCTION FOR USER STATUS
function getUserStatus(user) {

    let status = "In-Active";

    if (user.status) {
        status = "Active";
    }

    return status;
}

// CREATE FUNCTION FOR USER ROLES
function getUserRoles(user) {

    let userRoles = "";
    let  roles = getServiceRequest("/role/listbyuser/"+user.id)
    for (let index in roles) {
        if(index == roles.length-1)
            userRoles = userRoles + roles[index].name;
        else
        userRoles = userRoles + roles[index].name + ", ";

    }

    return userRoles;
}


function checkErrors() {

    let error = "";

    if (user.username == null){

        error = error + "User's Username Field Incomplete \n";

    }

    if (user.employee_id == null){

        error = error + "Employee Name Field Incomplete \n";

    }

    if (user.password == null){

        error = error + "User Password Field Incomplete \n";

    }

    if (user.email == null){

        error = error + "User E-mail Field Incomplete \n";

    }

    if (user.status == null){

        error = error + "User Status Field Incomplete \n";

    }

    if (user.role.length == 0){

        error = error + "User Roles Field Incomplete \n";

    }


    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this User?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/user", "POST", user);


            if (postServiceResponse == "0") {

                alert("User Added Successfuly as you wish!!!");
                refreshTable();
                refreshForm();

            } else {

                window.confirm("You have these following error\n" + postServiceResponse)

            }
        }

    }else {

        alert("Form has these following errors \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active")

}



const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");

    user    = getAjexServiceRequest("/user/getbyid/"+ob.id);
    oldUser = getAjexServiceRequest("/user/getbyid/"+ob.id);


    //SET VALUE
    userEmail.value       = user.email;
    userDescription.value = user.description;
    userName.value        = user.username;
    userPassword.value    = user.password;

    //DISABLEING THE THESE FIELDS TO UNABLE EDITING...

    userName.style.color = "grey";
    $('#userName').css("pointer-events", "none");
    $('#userName').css("cursor", "not-allowed");

    userPassword.style.color = "grey";
    $('#userPassword').css("pointer-events", "none");
    $('#userPassword').css("cursor", "not-allowed");


    if(user.status){

        switchUserStatus.checked    = true;
        labelUserStatus.innerText   = "User Account Active";
        labelUserStatus.style.color = "green";

    }else {

        switchUserStatus.checked    = false;
        labelUserStatus.innerText   = "User Account In-Active";
        labelUserStatus.style.color = "red";

    }


    fillSelectFeild(userEmpName, "Select Employee Name", employeeName,'fullname', user.employee_id.fullname);
    userEmpName.disabled  = true;
    userEmpName.style.color  = "grey";
    userEmpName.style.borderBottom = "solid"



    roles = getServiceRequest("/role/findall")

    divRoles.innerHTML = "";

    for (let index in roles) {

        let divCheck = document.createElement("div")
        divCheck.classList.add("form-check");

        let inputCheck = document.createElement("input")
        inputCheck.type = "checkbox";
        inputCheck.classList.add("form-check-input");

        inputCheck.onchange = function (params) {

            if (inputCheck.checked) {
                user.role.push(roles[index]);
            } else {

                for (let ind in user.role) {

                    if (user.role[ind].id == roles[index].id) {
                        user.role.splice(ind, 1);
                    }

                }

            }
        }

        if(user.role.length != 0 ){
            let extindex = user.role.map(r=> r.name).indexOf(roles[index].name);
            if(extindex != -1){
                inputCheck.checked = true;
            }
        }


        let labelCheck = document.createElement("label");
        labelCheck.classList.add("form-check-label");
        labelCheck.classList.add("fw-bold");
        labelCheck.style.color = "grey"
        labelCheck.innerHTML = roles[index].name;

        divCheck.appendChild(inputCheck);
        divCheck.appendChild(labelCheck);
        divRoles.appendChild(divCheck);

    }


    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (user != null && oldUser != null) {


        if (user.email != oldUser.email) {
            update = update + "User E-mail updated \n";
        }

        if (user.status != oldUser.status) {
            update = update + "User Status updated \n";
        }

        if(user.role.length != oldUser.role.length){
            update = update + "User Roles updated \n";
        }else {
            let ext = 0;
            for(let index in user.role){
                for(let ind in oldUser.role){
                    if(user.role[index].id == oldUser.role[ind].id){
                        ext = ext +1;
                        break;
                    }
                }
            }

            if (ext != user.role.length){
                update = update + "User Roles updated \n";
            }

        }

    }

    return update;

}

const updateBTN = () => {

    // checking any errors in the form
    let errors = "";

    if (errors == "") {

        //checking any field is updated, does form has any updated value...
        let update = checkUpdate();
        if (update == ""){  //IF UPDATE IS EMPTY , NO UPDATE AVAILABLE IN THE FORM. BELOW CODE RUNS

            //if update is not available
            window.alert("Nothing Updated...!\n");

        }else {

            // get confirmation from user for updated value if available...
            let updateResponce = window.confirm("Are you sure to update following User? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/user","PUT",user);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the User successfully as you wish...!");
                    refreshTable();
                    refreshForm();

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to updated the User, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active")

}

const rowDelete = (ob) => {

    let deleteMsg = "WOULD U LIKE TO DELETE THIS USER ?\n" + ob.username;
    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/user","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("AS YOU WISH, DELETED THE USER SUCCESSFULLY !!!");
            refreshTable();
        }else {
            window.confirm("YOU HAVE THE FOLLOWING ERROR\n" + deleteSeverResponse)
        }

    }

}

const rowView = (ob) => {

userPrint = getServiceRequest("/user/getbyid/"+ob.id)

    $('#userModal').modal("show");

    modUserEmpNo.innerHTML = userPrint.employee_id.number;
    modUserEmpName.innerHTML = userPrint.employee_id.fullname;
    modUserName.innerHTML = userPrint.username;
    modUserEmail.innerHTML = userPrint.email;
    modUserStatus.innerHTML = getUserStatus(userPrint);
    modUserRoles.innerHTML =  getUserRoles(userPrint);


}

const clearBtn = () => {

    refreshForm();

}



