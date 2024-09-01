window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=CUSTOMER")

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
    customers = new Array();

    customers = getServiceRequest("/customer/findall");

    //create display property list
    let DisplayPropertyList = ['fullname','nic','email','mobile','address','customer_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','text',"text","text","text","object"];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableCustomer, customers, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in customers){

        if(customers[index].customer_status_id.name == "Deleted")
            tableCustomer.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableCustomer').dataTable();

}

const refreshForm = () => {


    customer = new Object();
    oldCustomer = null;

    custStatus = getServiceRequest("/customerstatus/list")
    fillSelectFeild(customerStatus, "Select Customer Status", custStatus, "name", "Registered")
    customer.customer_status_id = JSON.parse(customerStatus.value);

    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE CUSTOMER

    customerStatus.style.color        = "green";
    customerStatus.style.borderBottom = "solid";

    customerFullname.value = "";
    customerNic.value      = "";
    customerMobile.value   = "";
    customerEmail.value    = "";
    customerAddress.value  = "";
    customerNote.value     = "";


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


    if (customer.fullname == null){

        error = error + "Customer Fullname Field Incomplete \n";

    }

    if (customer.nic == null){

        error = error + "Customer NIC Field Incomplete \n";

    }

    if (customer.mobile == null){

        error = error + "Customer Contact Number Field Incomplete \n";

    }

    if (customer.email == null){

        error = error + "Customer Email Field Incomplete \n";

    }

    if (customer.customer_status_id == null){

        error = error + "Customer Status Field Incomplete \n";

    }

    if (customer.address == null){

        error = error + "Customer Address Field Incomplete \n";

    }

    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Customer?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/customer", "POST", customer);


            if (postServiceResponse == "0") {

                alert("Customer Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active");

            } else {

                window.confirm("You have these following error\n" + postServiceResponse)

            }
        }

    }else {

        alert("Form has these following errors \n" + errors)

    }

}

const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");

    customer    = getAjexServiceRequest("/customer/getbyid/"+ob.id);
    oldCustomer = getAjexServiceRequest("/customer/getbyid/"+ob.id);


    //SET VALUE
    customerFullname.value = customer.fullname;
    customerNic.value      = customer.nic;
    customerMobile.value   = customer.mobile;
    customerEmail.value    = customer.email;
    customerAddress.value  = customer.address;
    customerNote.value     = customer.note;


    fillSelectFeild(customerStatus, "Select Customer Status", custStatus, "name", customer.customer_status_id.name);
    customerStatus.style.borderBottom   = "solid";


    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (customer != null && oldCustomer != null) {


        if (customer.fullname != oldCustomer.fullname) {
            update = update + "Customer Fullname updated \n";
        }

        if (customer.nic != oldCustomer.nic) {
            update = update + "Customer NIC updated \n";
        }

        if (customer.mobile != oldCustomer.mobile) {
            update = update + "Customer Contact Number updated \n";
        }

        if ( customer.email != oldCustomer.email) {
            update = update + "Customer E-mail updated \n";
        }

        if (customer.customer_status_id.name != oldCustomer.customer_status_id.name) {
            update = update + "Customer Status updated \n";
        }

         if (customer.address != oldCustomer.address) {
            update = update + "Customer Address updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Customer? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/customer","PUT",customer);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Customer successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Customer, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

}

const rowDelete = (custOb) => {

    let deleteMsg = "Would you like to Delete the following customer ?\n"
        +"Customer Name : "+ custOb.fullname ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/customer","DELETE", custOb);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Customer Successfully !!!");
            refreshTable();
        }else {
            window.confirm("You have the following error\n" + deleteSeverResponse)
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



