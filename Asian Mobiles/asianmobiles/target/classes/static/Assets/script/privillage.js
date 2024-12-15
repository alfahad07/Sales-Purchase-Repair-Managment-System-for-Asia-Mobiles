
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PRIVILEGE")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();


    privilegeRoleName.addEventListener('change', event => {

        moduleNameByRoleName = getServiceRequest("/module/listbyrolename/" + JSON.parse(privilegeRoleName.value).id)
        fillSelectFeild(privilegeModuleName, "Select Module Name", moduleNameByRoleName, "name", "")

        if (oldPrivilege != null && JSON.parse(privilegeRoleName.value).name != oldPrivilege.role_id.name){

            privilegeRoleName.style.color = "orange"
            privilegeRoleName.style.borderBottom = "2px solid orange"

        }else {

            privilegeRoleName.style.color = "green"
            privilegeRoleName.style.borderBottom = "2px solid green"

        }

    })

}

//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    privileges = new Array();

    privileges = getServiceRequest("/privilege/findall");

    //create display property list
    let DisplayPropertyList = ['role_id.name','module_id.name','sel','ins','upd','del'];

    //create display property list type
    let DisplayPropertyListType = ['object','object',getSelStatus,getInsStatus,getUpdStatus,getDelStatus];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tablePrivilege, privileges, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in privileges){

        if(privileges[index].sel == "0" && privileges[index].ins == "0" && privileges[index].upd == "0" && privileges[index].del == "0")
            tablePrivilege.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tablePrivilege').dataTable();

}

const refreshForm = () => {

    privilege = new Object();
    oldPrivilege = null;

    //user.role = new Array();

    roles = getServiceRequest("/role/findall")
    fillSelectFeild(privilegeRoleName, "Select Role Name", roles, "name", "")

    modules = getServiceRequest("/module/findall")
    fillSelectFeild(privilegeModuleName, "Select Module Name", modules, "name", "")



    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE EMPLOYEE
    privilegeRoleName.style.color        = "grey";
    privilegeRoleName.style.borderBottom = "none";

    privilegeModuleName.style.color        = "grey";
    privilegeModuleName.style.borderBottom = "none";


    switchPrivilegeSelect.checked    = false;
    privilege.sel                    = false
    labelPrivilegeSelect.innerText   = "Select Permission"
    labelPrivilegeSelect.style.color = "grey";

    switchPrivilegeInsert.checked    = false
    privilege.ins                    = false
    labelPrivilegeInsert.innerText   = "Select Permission"
    labelPrivilegeInsert.style.color = "grey";

    switchPrivilegeUpdate.checked    = false
    privilege.upd                    = false
    labelPrivilegeUpdate.innerText   = "Select Permission"
    labelPrivilegeUpdate.style.color = "grey";

    switchPrivilegeDelete.checked    = false
    privilege.del                    = false
    labelPrivilegeDelete.innerText   = "Select Permission"
    labelPrivilegeDelete.style.color = "grey";


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
function getSelStatus(privilege) {

    let status = "Not-Granted";

    if (privilege.sel) {
        status = "Granted";
    }

    return status;
}

//CREATE FUNCTION FOR USER STATUS
function getInsStatus(privilege) {

    let status = "Not-Granted";

    if (privilege.ins) {
        status = "Granted";
    }

    return status;
}

//CREATE FUNCTION FOR USER STATUS
function getUpdStatus(privilege) {

    let status = "Not-Granted";

    if (privilege.upd) {
        status = "Granted";
    }

    return status;
}

//CREATE FUNCTION FOR USER STATUS
function getDelStatus(privilege) {

    let status = "Not-Granted";

    if (privilege.del) {
        status = "Granted";
    }

    return status;
}


function checkErrors() {

    let error = "";

    if (privilege.role_id == null){

        error = error + "Privilege Role Name Field Incomplete \n";

    }

    if (privilege.module_id == null){

        error = error + "Privilege Module Name Field Incomplete \n";

    }

    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Privilege Details?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/privilege", "POST", privilege);


            if (postServiceResponse == "0") {

                alert("Privilege Details Added Successfuly as you wish!!!");
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

    privilege    = getAjexServiceRequest("/privilege/getbyid/"+ob.id);
    oldPrivilege = getAjexServiceRequest("/privilege/getbyid/"+ob.id);


    //SET VALUE

    if (privilege.sel) {
        switchPrivilegeSelect.checked = true;
        labelPrivilegeSelect.innerText   = "Granted";
        labelPrivilegeSelect.style.color = "green";
    }else {

        switchPrivilegeSelect.checked = false;
        labelPrivilegeSelect.innerText   = "Not-Granted";
        labelPrivilegeSelect.style.color = "Red";

    }

    if (privilege.ins) {
        switchPrivilegeInsert.checked = true;
        labelPrivilegeInsert.innerText   = "Granted";
        labelPrivilegeInsert.style.color = "green";
    }else {

        switchPrivilegeInsert.checked = false;
        labelPrivilegeInsert.innerText = "Not-Granted";
        labelPrivilegeInsert.style.color = "Red";
    }

    if (privilege.upd) {
        switchPrivilegeUpdate.checked = true;
        labelPrivilegeUpdate.innerText   = "Granted";
        labelPrivilegeUpdate.style.color = "green";
    }else {

        switchPrivilegeUpdate.checked = false;
        labelPrivilegeUpdate.innerText = "Not-Granted";
        labelPrivilegeUpdate.style.color = "Red";
    }

    if (privilege.del) {
        switchPrivilegeDelete.checked = true;
        labelPrivilegeDelete.innerText   = "Granted";
        labelPrivilegeDelete.style.color = "green";
    }else {

        labelPrivilegeDelete.checked = false;
        labelPrivilegeDelete.innerText = "Not-Granted";
        labelPrivilegeDelete.style.color = "Red";
    }


    fillSelectFeild(privilegeRoleName, "Select Role Name", roles,'name', privilege.role_id.name);
    privilegeRoleName.style.borderBottom   = "solid"
    privilegeRoleName.disabled  = true;
    privilegeRoleName.style.color  = "grey";

    fillSelectFeild(privilegeModuleName, "Select Module Name", modules,'name', privilege.module_id.name);
    privilegeModuleName.style.borderBottom = "solid"
    privilegeModuleName.disabled  = true;
    privilegeModuleName.style.color  = "grey";


    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (privilege != null && oldPrivilege != null) {


        if (privilege.role_id.name != oldPrivilege.role_id.name) {
            update = update + "Privilege Role Name updated \n";
        }

        if (privilege.module_id.name != oldPrivilege.module_id.name) {
            update = update + "Privilege Module Name updated \n";
        }

        if (privilege.sel != oldPrivilege.sel) {
            update = update + "Privilege Select updated \n";
        }

        if (privilege.ins != oldPrivilege.ins) {
            update = update + "Privilege Insert updated \n";
        }

         if (privilege.upd != oldPrivilege.upd) {
            update = update + "Privilege Update updated \n";
        }

         if (privilege.del != oldPrivilege.del) {
            update = update + "Privilege Delete updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Privilege Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/privilege","PUT",privilege);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Privilege Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Privilege Details, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active")

}

const rowDelete = (priOb) => {

    let deleteMsg = "WOULD U LIKE TO DELETE THE FOLLOWING PRIVILEGE DETAILS ?\n"
        +"ROLE : "+ priOb.role_id.name +"\n"
        +"MODULE : "+ priOb.module_id.name;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/privilege","DELETE", priOb);


        if(deleteSeverResponse == "0"){

            alert("AS YOU WISH, DELETED THE USER SUCCESSFULLY !!!");
            refreshTable();
        }else {
            window.confirm("YOU HAVE THE FOLLOWING ERROR\n" + deleteSeverResponse)
        }

    }

}

const rowView = (ob) => {

    privilegePrint = getServiceRequest("/privilege/getbyid/"+ob.id)

    $('#privilegeModal').modal("show");

    modPrivRoleName.innerHTML   = privilegePrint.role_id.name;
    modPrivModuleName.innerHTML = privilegePrint.module_id.name;
    modPrivSelect.innerHTML     = getSelStatus(privilegePrint);
    modPrivInsert.innerHTML     = getInsStatus(privilegePrint);
    modPrivUpdate.innerHTML     = getUpdStatus(privilegePrint);
    modPrivDelete.innerHTML     = getDelStatus(privilegePrint);


}

const clearBtn = () => {

    refreshForm();

}



