
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=QUOTATION-REQUEST")

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
    quotationRequestDetails = new Array();

    quotationRequestDetails = getServiceRequest("/quotationrequest/findall");

    //create display property list
    let DisplayPropertyList = ['qr_number','supplier_id.supplier_company_name','quotation_required_date','quotation_request_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object','text','object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableQuotationRequest, quotationRequestDetails, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in quotationRequestDetails){

        if(quotationRequestDetails[index].quotation_request_status_id.name == "Deleted")
            tableQuotationRequest.children[1].children[index].children[5].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableQuotationRequest').dataTable();


}


const refreshForm = () => {


    quotationRequest = new Object();
    oldQuotationRequest = null;


    Suppliers = getServiceRequest("/supplier/listbyactivesupplierstatus");
    fillSelectFeild(quotationRequestSupplier, "Select Quotation Request Supplier", Suppliers, "supplier_company_name")

    QrStatuses = getServiceRequest("/quotationrequeststatus/list")
    fillSelectFeild(quotationRequestStatus, "Select Quotation Request Status", QrStatuses, "name", "Requested")

    quotationRequest.quotation_request_status_id = JSON.parse(quotationRequestStatus.value);

    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    quotationRequestSupplier.style.color        = "grey";
    quotationRequestSupplier.style.borderBottom = "none";

    quotationRequestStatus.style.color          = "green";
    quotationRequestStatus.style.borderBottom   = "solid";

    quotationRequestRequiredDate.value = "";
    quotationRequestNote.value         = "";


    // SETTING THE DATE FOR PRE-ORDER

    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() + 2);

    quotationRequestRequiredDate.min = currentDateForMin.getFullYear() + getMontahDate(currentDateForMin);


    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() + 30);

    quotationRequestRequiredDate.max = currentDateForMax.getFullYear() + getMontahDate(currentDateForMax);

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

    if (quotationRequest.supplier_id == null){

        error = error + "Quotation Request Supplier Field Incomplete \n";

    }

    if (quotationRequest.quotation_required_date == null){

        error = error + "Quotation Request Required Date Field Incomplete \n";

    }

    if (quotationRequest.quotation_request_status_id == ""){

        error = error + "Quotation Request Status Field Incomplete \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Quotation Request?\n" +
            "\n Quotation Request Supplier : " + quotationRequest.supplier_id.supplier_company_name +
            "\n Quotation Request Required Date : " + quotationRequest.quotation_required_date;


        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/quotationrequest", "POST", quotationRequest);


            if (postServiceResponse == "0") {

                alert("Quotation Request Added Successfully as you wish!!!");
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

    quotationRequest    = getAjexServiceRequest("/quotationrequest/getbyid/"+ob.id);
    oldQuotationRequest = getAjexServiceRequest("/quotationrequest/getbyid/"+ob.id);


    //SET VALUE
    quotationRequestRequiredDate.value = quotationRequest.quotation_required_date;
    quotationRequestNote.value         = quotationRequest.note;



    fillSelectFeild(quotationRequestSupplier, "Select Quotation Request Supplier", Suppliers, "supplier_company_name", quotationRequest.supplier_id.supplier_company_name);
    quotationRequestSupplier.style.borderBottom   = "solid";

    fillSelectFeild(quotationRequestStatus, "Select Quotation Request Status", QrStatuses, "name", quotationRequest.quotation_request_status_id.name);
    quotationRequestStatus.style.borderBottom   = "solid";


    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (quotationRequest != null && oldQuotationRequest != null) {


        if (quotationRequest.supplier_id.id != oldQuotationRequest.supplier_id.id) {
            update = update + "Quotation Request Supplier updated \n";
        }

        if ( quotationRequest.quotation_required_date != oldQuotationRequest.quotation_required_date) {
            update = update + "Quotation Request Required Date updated \n";
        }

        if (quotationRequest.quotation_request_status_id.id != oldQuotationRequest.quotation_request_status_id.id) {
            update = update + "Quotation Request Status updated \n";
        }

        if (quotationRequest.note != oldQuotationRequest.note) {
            update = update + "Quotation Request Note updated \n";
        }

    }

    return update;

}

const updateBTN = () => {

    // checking any errors in the form
    let errors = checkErrors();

    if (errors == "") {

        //checking any field is updated, does form has any updated value...
        let update = checkUpdate();
        if (update == ""){  //IF UPDATE IS EMPTY , NO UPDATE AVAILABLE IN THE FORM. BELOW CODE RUNS

            //if update is not available
            window.alert("Nothing Updated...!\n");

        }else {

            // get confirmation from user for updated value if available...
            let updateResponce = window.confirm("Are you willing to update following Quotation Request Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/quotationrequest","PUT",quotationRequest);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Quotation Request Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Quotation Request Details, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

}

const rowDelete = (ob) => {

    let deleteMsg = "Would you like to Delete the following Quotation Request?\n"
        +"\n Quotation Request Code : "+ ob.qr_number;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/quotationrequest","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Quotation Request Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    quotationRequestPrint = getServiceRequest("/quotationrequest/getbyid/"+ob.id)

    $('#quotationRequestModal').modal("show");

    modSupplier.innerHTML       = quotationRequestPrint.supplier_id.supplier_company_name;
    modDate.innerHTML           = quotationRequestPrint.quotation_required_date;
    modStatus.innerHTML         = quotationRequestPrint.quotation_request_status_id.name;

}

const clearBtn = () => {

    refreshForm();

}



