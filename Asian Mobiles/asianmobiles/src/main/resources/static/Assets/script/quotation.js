
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=QUOTATION")

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
    quotationDetails = new Array();

    quotationDetails = getServiceRequest("/quotation/findall");

    //create display property list
    let DisplayPropertyList = ['quotation_number','quotation_request_id.qr_number','recieved_date','expire_date','quotation_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object','text','text','object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableQuotation, quotationDetails, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in quotationDetails){

        if(quotationDetails[index].quotation_status_id.name == "Deleted")
            tableQuotation.children[1].children[index].children[6].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableQuotation').dataTable();


}


const refreshForm = () => {


    quotation = new Object();
    oldQuotation = null;

    quotation.quotationHasModelList = new Array();

    Suppliers = getServiceRequest("/supplier/list");
    fillSelectFeild(quotationSupplier, "Select Quotation Supplier", Suppliers, "supplier_company_name");

    quotationStatuses = getServiceRequest("/quotationstatus/list")
    fillSelectFeild(quotationStatus, "Select Quotation Status", quotationStatuses, "name");

    qrCodes = getServiceRequest("/quotationrequest/list")
    fillSelectFeild(quotationRequestCode, "Select Quotation Request Codes", qrCodes, "qr_number");

    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    quotationSupplier.style.color        = "grey";
    quotationSupplier.style.borderBottom = "none";

    quotationStatus.style.color          = "grey";
    quotationStatus.style.borderBottom   = "none";

    quotationRequestCode.style.color          = "grey";
    quotationRequestCode.style.borderBottom   = "none";


    quotationReceivedDate.value = "";
    quotationExpiredDate.value  = "";
    quotationNote.value         = "";


    refreshInnerFormAndTable();

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



const refreshInnerFormAndTable = () => {

    //INNER FORM
    quotationHasModel = new Object();
    oldQuotationHasModel = null;


    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(quotationModel, "Select Model", innerModels,"model_number" ,"model_name",)

    quotationModel.style.color        = "grey";
    quotationModel.style.borderBottom = "none";

    quotationModel.value      = "";
    quotationPurchasePrice.value  = "";



    //INNER TABLE

    //create display property list
    let DisplayPropertyList = ['model_id.model_name','purchase_price'];

    //create display property list type
    let DisplayPropertyListType = ['object','text'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=QUOTATION");

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableQuotationInnerTable,quotation.quotationHasModelList,DisplayPropertyList, DisplayPropertyListType, innerFormRefill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilage);

    for (let index in quotation.quotationHasModelList){

        tableQuotationInnerTable.children[1].children[index].children[3].children[2].style.display = "none";

    }

}

function innerRowView() {



}

function innerFormRefill() {



}

const innerRowDelete = (innerOb, innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Quotation Model?\n"
        +"Model Name : "+ innerOb.model_id.model_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        quotation.quotationHasModelList.splice(innerRowIndex, 1);
        alert("As you wish, Deleted the Quotation Model Successfully !!!");
        refreshInnerFormAndTable();

    }

}



const innerAddMC = () => {

    let itemExt = false;

    for (let index in quotation.quotationHasModelList){

        if (quotation.quotationHasModelList[index].model_id.model_name == quotationHasModel.model_id.model_name){

            itemExt = true;
            break;

        }

    }

    if (!itemExt){

        let submitConfigMsg = "Are you willing to add following Quotation Model?\n" +
            "\n Model Name : " + quotationHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + quotationHasModel.purchase_price ;


        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            quotation.quotationHasModelList.push(quotationHasModel);
            alert("Quotation Model Added Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }

    }else {

        alert("Model Cannot be Added : It's already Exist!!!\n" + "\n Model Name : " + quotationHasModel.model_id.model_name)

    }


}

const innerClearMC = () => {

    refreshInnerFormAndTable();

}




function checkErrors() {

    let error = "";

    if (quotationSupplier.value == ""){

        error = error + "Quotation Supplier Field Incomplete \n";

    }

    if (quotation.quotation_request_id == null){

        error = error + "Quotation Request Field Incomplete \n";

    }

    if (quotation.recieved_date == null){

        error = error + "Quotation Received Date Field Incomplete \n";

    }

    if (quotation.expire_date == null){

        error = error + "Quotation Expired Date Field Incomplete \n";

    }

    if (quotation.quotation_status_id == null){

        error = error + "Quotation Status Field Incomplete \n";

    }

    if (quotation.quotationHasModelList.length == "0"){

        error = error + "Quotation Models Not Added \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Quotation Request?\n" +
            "\n Quotation Number         : " + quotation.quotation_number +
            "\n Quotation Request Number : " + quotation.quotation_request_id.qr_number +
            "\n Quotation Supplier       : " + quotation.supplier_id.supplier_company_name;



        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/quotation", "POST", quotation);


            if (postServiceResponse == "0") {

                alert("Quotation Added Successfully as you wish!!!");
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

    quotation    = getAjexServiceRequest("/quotation/getbyid/"+ob.id);
    oldQuotation = getAjexServiceRequest("/quotation/getbyid/"+ob.id);


    //SET VALUE
    quotationReceivedDate.value = quotation.recieved_date;
    quotationExpiredDate.value  = quotation.expire_date;
    quotationNote.value         = quotation.note


    fillSelectFeild(quotationSupplier, "Select Quotation Supplier", Suppliers, "supplier_company_name", quotation.quotation_request_id.supplier_id.supplier_company_name);
    quotationSupplier.style.borderBottom   = "solid";

    fillSelectFeild(quotationStatus, "Select Quotation Status", quotationStatuses, "name", quotation.quotation_status_id.name);
    quotationStatus.style.borderBottom   = "solid";

    fillSelectFeild(quotationRequestCode, "Select Quotation Request Codes", qrCodes, "qr_number", quotation.quotation_request_id.qr_number);
    quotationRequestCode.style.borderBottom   = "solid";

    refreshInnerFormAndTable();


    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (quotation != null && oldQuotation != null) {


        if (JSON.parse(quotationSupplier.value).id != oldQuotation.quotation_request_id.supplier_id.id) {
            update = update + "Quotation Supplier updated \n";
        }

        if (quotation.quotation_request_id.id != oldQuotation.quotation_request_id.id) {
            update = update + "Quotation Requested Code updated \n";
        }

        if (quotation.expire_date.id != oldQuotation.expire_date.id) {
            update = update + "Quotation Expired Date updated \n";
        }

        if ( quotation.recieved_date != oldQuotation.recieved_date) {
            update = update + "Quotation Recieved Date updated \n";
        }

        if (quotation.quotation_status_id.id != oldQuotation.quotation_status_id.id) {
            update = update + "Quotation Status updated \n";
        }

        if (quotation.note != oldQuotation.note) {
            update = update + "Quotation Note updated \n";
        }

        if (quotation.quotationHasModelList.length != oldQuotation.quotationHasModelList.length) {
            update = update + "Quotation Model updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Quotation Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/quotation","PUT",quotation);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Quotation Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Quotation Details, Please try Again...!\n" + putResponce);

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

    let deleteMsg = "Would you like to Delete the following Quotation?\n"
        +"\n Quotation Code : "+ ob.quotation_number;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/quotation","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Quotation Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    quotationPrint = getServiceRequest("/quotation/getbyid/"+ob.id)

    $('#quotationModal').modal("show");

    modQuotationSupplier.innerHTML     = quotationPrint.quotation_request_id.supplier_id.supplier_company_name;
    modQuotationRequestCode.innerHTML  = quotationPrint.quotation_request_id.qr_number;
    modQuotationReceivedDate.innerHTML = quotationPrint.recieved_date;
    modQuotationExpiredDate.innerHTML  = quotationPrint.expire_date;
    modQuotationStatus.innerHTML       = quotationPrint.quotation_status_id.name;
    modQuotationNote.innerHTML         = quotationPrint.note;


}

const clearBtn = () => {

    refreshForm();

}



