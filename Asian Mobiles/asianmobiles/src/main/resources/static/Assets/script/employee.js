
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=EMPLOYEE")

    //CALLED EMPLOYE FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED EMPLOYE FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

    empDOB.addEventListener("change", checkDOB)

}

//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    employess = new Array();

    $.ajax("/employee/allemployee", {

        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            employees = data;
        },
        error: function (rxhrdata,errorstatus,errorMessage) {
            employees = [];
        }
    })

    //create display property list
    let DisplayPropertyList = ['callingname','fullname','nic','mobile','email','employeestatus_id.name']

    //create display property list type
    let DisplayPropertyListType = [getEmployeeCNRN,'text','text','text','text','object']

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableEmployee, employees, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView)

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in employees){

        if(employees[index].employeestatus_id.name == "Deleted")
            tableEmployee.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableEmployee').dataTable();


}

const refreshForm = () => {

    employee = new Object();
    oldemployee = null;

    civilStatuses = getAjexServiceRequest("/civilstatus/list")
    fillSelectFeild(empCivilStatus, "Select Civil Status", civilStatuses, "name", "")

    designations = getAjexServiceRequest("/designation/list")
    fillSelectFeild(empDesignation, "Select Designation", designations, "name", "")

    employeeStatuses = getAjexServiceRequest("/employeestatus/list")
    fillSelectFeild(empStatus, "Select Employee Status", employeeStatuses, "name", "")

    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE EMPLOYEE
    empfullname.value = "";
    empCallingname.value = "";
    empNic.value = "";
    empEmail.value = "";
    empMobile.value = "";
    empLand.value = "";
    male.value = "";
    female.value = "";
    empDOB.value = "";
    empAddress.value = "";
    empCivilStatus.value = "";
    empDesignation.value = "";
    empStatus.value = "";
    empDescription.value = "";

    male.checked = false;
    female.checked = false;

    empCivilStatus.style.color = "grey";
    empCivilStatus.style.borderBottom = "none"

    empDesignation.style.color = "grey";
    empDesignation.style.borderBottom = "none"

    empStatus.style.color = "grey";
    empStatus.style.borderBottom = "none"


    let mindate = new Date();
    let maxdate = new Date();

    maxdate.setFullYear(maxdate.getFullYear()-18);
    empDOB.max = getCurrentDate("date", maxdate);

    mindate.setFullYear(mindate.getFullYear()-60);
    empDOB.min = getCurrentDate("date", mindate);



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

function checkErrors() {

    let error = "";

    if (employee.fullname == null){

        error = error + "Employee Fullname Field Incomplete \n";

    }

    if (employee.callingname == null){

        error = error + "Employee Callingname Field Incomplete \n";

    }

    if (employee.nic == null){

        error = error + "Employee NIC Field Incomplete \n";

    }

    if (employee.mobile == null){

        error = error + "Employee Mobile Field Incomplete \n";

    }

    if (employee.email == null){

        error = error + "Employee Email Field Incomplete \n";

    }

    if (employee.employeestatus_id == null){

        error = error + "Employee Status Field Incomplete \n";

    }

    if (employee.designation_id == null){

        error = error + "Employee Designation Field Incomplete \n";

    }

    if (employee.civilstatus_id == null){

        error = error + "Employee Civil Status Field Incomplete \n";

    }

    if (employee.dob == null){

        error = error + "Employee DOB Field Incomplete \n";

    }

    if (employee.gender == null){

        error = error + "Employee Gender Field Incomplete \n";

    }

    if (employee.address == null){

        error = error + "Employee Address Field Incomplete \n";

    }


    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this employee?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/employee", "POST", employee);


            if (postServiceResponse == "0") {

                alert("Employee Added Successfuly as you wish!!!");
                refreshTable();
                refreshForm();

            } else {

                window.confirm("you have following error\n" + postServiceResponse)

            }
        }

    }else {

        alert("form has following errors \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active")

}


function getEmployeeCNRN(ob) {

    return "( " + ob.number + " )\n" +  ob.callingname;

}

const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");

    employee    = new Object();
    oldemployee = new Object();

    employee    = getAjexServiceRequest("/employee/getbyid/"+ob.id);
    oldemployee = getAjexServiceRequest("/employee/getbyid/"+ob.id);

    //SET VALUE
    empfullname.value    = employee.fullname;
    empCallingname.value = employee.callingname;
    empNic.value         = employee.nic
    empMobile.value      = employee.mobile;
    empEmail.value       = employee.email;
    empLand.value        = employee.land;
    empDOB.value         = employee.dob;
    empAddress.value     = employee.address;
    empCivilStatus.value = employee.civilstatus_id.name;
    empDesignation.value = employee.designation_id.name;
    empStatus.value      = employee.employeestatus_id.name;
    empDescription.value         = employee.description;



    if(employee.gender == "male"){

        male.checked = true;

    }else {

        female.checked = true;

    }

    empCivilStatus.style.borderBottom = "solid"

    empDesignation.style.borderBottom = "solid"

    empStatus.style.borderBottom = "solid"


    fillSelectFeild(empStatus, "Select EmployeeStatus", employeeStatuses,'name', employee.employeestatus_id.name);
    fillSelectFeild(empCivilStatus, "Select Civil Status", civilStatuses, 'name', employee.civilstatus_id.name);
    fillSelectFeild(empDesignation, "Select Designations", designations,'name', employee.designation_id.name);

    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (employee != null && oldemployee != null) {

        if (employee.fullname != oldemployee.fullname){
            update = update + "Employee Fullname updated " + oldemployee.fullname + " into " + employee.fullname + "\n";
        }

        if (employee.callingname != oldemployee.callingname) {
            update = update + "Employee calling name updated \n";
        }

        if (employee.nic != oldemployee.nic) {
            update = update + "Employee NIC updated \n";
        }

        if (employee.mobile != oldemployee.mobile) {
            update = update + "Employee Mobile updated \n";
        }

        if (employee.email != oldemployee.email) {
            update = update + "Employee E-mail updated \n";
        }

        if (employee.dob != oldemployee.dob) {
            update = update + "Employee DOB updated \n";
        }

        if (employee.gender != oldemployee.gender) {
            update = update + "Employee Gender updated \n";
        }

        if (employee.employeestatus_id.name != oldemployee.employeestatus_id.name) {
            update = update + "Employee employeestatus_id updated \n";
        }

        if (employee.designation_id.name != oldemployee.designation_id.name) {
            update = update + "Employee designation_id updated \n";
        }

        if (employee.civilstatus_id.name != oldemployee.civilstatus_id.name) {
            update = update + "Employee civilstatus_id updated \n";
        }

        if (employee.description != oldemployee.description) {
            update = update + "Employee Description updated \n";
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
            let updateResponce = window.confirm("Are you sure to update following Employee? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/employee","PUT",employee);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Employee successfully as you wish...!");
                    refreshTable();
                    refreshForm();

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to updated the Employee, Please try Again...!\n" + putResponce);

                }


            }

        }



    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("you have the following errors in your form...! \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active")

}

const rowDelete = (ob) => {

    let deleteMsg = "WOULD U LIKE TO DELETE THIS EMPLOYEE ?\n" + ob.fullname;
    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse;

        $.ajax("/employee", {

            async: false,
            type : "DELETE",
            data: JSON.stringify(ob),
            contentType: "application/json",
            success: function (sucessessResponsedata,susStatus,responceObject) {
                deleteSeverResponse = sucessessResponsedata;
            },
            error: function (errorResponceObject, errorStatus, errorMsg) {
                deleteSeverResponse = errorMsg;
            }
        })

        if(deleteSeverResponse == "0"){

            alert("AS YOU WISH, DELETED THE EMPLOYEE SUCCESSFULLY !!!");
            refreshTable();
        }else {
            window.confirm("YOU HAVE THE FOLLOWING ERROR\n" + deleteSeverResponse)
        }

    }


}

const rowView = (ob) => {

 employeeprint = getServiceRequest("/employee/getbyid/"+ob.id)

    $('#empModal').modal("show");

    modEmpNumber.innerHTML = employeeprint.number;
    modEmpName.innerHTML = employeeprint.fullname;
    modEmpCallName.innerHTML = employeeprint.callingname;
    modEmpNic.innerHTML = employeeprint.nic;
    modEmpMobileNo.innerHTML = employeeprint.mobile;
    modEmpEmail.innerHTML = employeeprint.email;
    modEmpStatus.innerHTML = employeeprint.employeestatus_id.name;

}

const clearBtn = () => {


    refreshForm();

}

const checkDOB = () => {

    console.log(empDOB.value)

    let datepattern = new RegExp("^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$");

    if (datepattern.test(empDOB.value)){

        let empDob = new Date(empDOB.value);
        let currentdate = new Date();


        let dobTime = empDob.getTime()
        let currentTime = currentdate.getTime();
        let dobGapTime;

        if(empDob.getFullYear()>1970)
            dobGapTime = currentTime - dobTime;
        else
            dobGapTime = currentTime + (-1*dobTime); //


        if((18*365*24*60*60*1000) < dobGapTime && dobGapTime < (60*365*24*60*60*1000)){

            empDOB.style.color = "green";

        }else{

            empDOB.style.color = "red";

        }

    }else {

        empDOB.style.color = "red";

    }


}






