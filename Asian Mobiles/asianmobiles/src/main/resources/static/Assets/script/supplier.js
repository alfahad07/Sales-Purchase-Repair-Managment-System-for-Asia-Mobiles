
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=SUPPLIER")

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
    supplierDetails = new Array();

    supplierDetails = getServiceRequest("/supplier/findall");

    //create display property list
    let DisplayPropertyList = ['supplier_reg_no','supplier_company_reg_no','supplier_company_name','contact_number','supplier_company_email','supplier_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','text','text','text','text','object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableSupplier, supplierDetails, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in supplierDetails){

        if(supplierDetails[index].supplier_status_id.name == "Deleted")
            tableSupplier.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableSupplier').dataTable();


}


const refreshForm = () => {


    supplier = new Object();
    oldSupplier = null;


    supBanks = getServiceRequest("/bank/list");
    fillSelectFeild(supBank, "Select Bank", supBanks, "name")

    supStatuses = getServiceRequest("/supplierstatus/list")
    fillSelectFeild(supStatus, "Select Supplier Status", supStatuses, "name","Active")
    supplier.supplier_status_id = JSON.parse(supStatus.value);

    supplier.supplierHasModelList = new Array();
    fillSelectFeild(selectedModelsSelectionField, "", supplier.supplierHasModelList, "model_name")

    supAllModels = getServiceRequest("/model/list")
    fillSelectFeild(allModelsSelectionField, "", supAllModels, "model_name")


    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    supBank.style.color        = "grey";
    supBank.style.borderBottom = "none";


    supStatus.style.borderBottom   = "solid";

    supCompanyRegNo.value          = "";
    supCompanyName.value           = "";
    supContactNo.value             = "";
    supEmail.value                 = "";
    supAddress.value               = "";
    supCompanyStaffName.value      = "";
    supCompanyStaffMobileNo.value  = "";
    supBankBranchName.value        = "";
    supBankAccountNumber.value     = "";
    supBankAccountHolderName.value = "";
    supAreasAmount.value           = "0.00";
    supplier.arreas_amount         = supAreasAmount.value
    supNote.value                  = "";

    supAreasAmount.style.color  = "green"
    $('#supAreasAmount').css("pointer-events", "none");
    $('#supAreasAmount').css("cursor", "not-allowed");

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

    if (supplier.supplier_company_reg_no == null){

        error = error + "Company Registration Number Field Incomplete \n";

    }

    if (supplier.supplier_company_name == null){

        error = error + "Company Name Field Incomplete \n";

    }

    if (supplier.contact_number == null){

        error = error + "Contact Number Field Incomplete \n";

    }

    if (supplier.supplier_company_email == null){

        error = error + "E-mail Field Incomplete \n";

    }

    if (supplier.address == null){

        error = error + "Address Field Incomplete \n";

    }

    if (supplier.company_staff_mobile_no == null){

        error = error + "Company Staff Mobile Number Field Incomplete \n";

    }

    if (supplier.bank_id == null){

        error = error + "Bank Field Incomplete \n";

    }

    if (supplier.bank_branch_name == null){

        error = error + "Bank Branch Name Field Incomplete \n";

    }

    if (supplier.bank_account_number == null){

        error = error + "Bank Account Number Field Incomplete \n";

    }

    if (supplier.account_holder_name == null){

        error = error + "Bank Account Holder Name Field Incomplete \n";

    }

    if (supplier.supplier_status_id == null){

        error = error + "Supplier Status Field Incomplete \n";

    }

    if (supplier.supplierHasModelList.length == 0){

        error = error + "Supplier Model List Incomplete \n";

    }

    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Supplier?\n" +
            "\n Company Reg No  : " + supplier.supplier_company_reg_no +
            "\n Company Name    : " + supplier.supplier_company_name;



        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/supplier", "POST", supplier);


            if (postServiceResponse == "0") {

                alert("Supplier Added Successfully as you wish!!!");
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

    supplier    = getAjexServiceRequest("/supplier/getbyid/"+ob.id);
    oldSupplier = getAjexServiceRequest("/supplier/getbyid/"+ob.id);


    //SET VALUE
    supCompanyRegNo.value          = supplier.supplier_company_reg_no;
    supCompanyName.value           = supplier.supplier_company_name;
    supContactNo.value             = supplier.contact_number;
    supEmail.value                 = supplier.supplier_company_email;
    supAddress.value               = supplier.address;
    supCompanyStaffName.value      = supplier.supplier_company_staff_name;
    supCompanyStaffMobileNo.value  = supplier.company_staff_mobile_no;
    supBankBranchName.value        = supplier.bank_branch_name;
    supBankAccountNumber.value     = supplier.bank_account_number;
    supBankAccountHolderName.value = supplier.account_holder_name;
    supAreasAmount.value           = supplier.arreas_amount;
    supNote.value                  = supplier.note;


    fillSelectFeild(supBank, "Select Bank ", supBanks, "name", supplier.bank_id.name);
    supBank.style.borderBottom   = "solid";

    fillSelectFeild(supStatus, "Select Supplier Status", supStatuses, "name", supplier.supplier_status_id.name);
    supStatus.style.borderBottom   = "solid";

    fillSelectFeild(selectedModelsSelectionField, "", supplier.supplierHasModelList, "model_name")

    supAllModels = getAjexServiceRequest("/model/listwithoutsupplier/" + supplier.id); //all list
    fillSelectFeild(allModelsSelectionField, "", supAllModels, "model_name");

    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (supplier != null && oldSupplier != null) {


        if ( supplier.supplier_company_reg_no != oldSupplier.supplier_company_reg_no) {
            update = update + "Company Registration Number updated \n";
        }

        if (supplier.supplier_company_name != oldSupplier.supplier_company_name) {
            update = update + "Company Name updated \n";
        }

        if (supplier.contact_number != oldSupplier.contact_number) {
            update = update + "Contact Number updated \n";
        }

        if (supplier.supplier_company_email != oldSupplier.supplier_company_email) {
            update = update + "E-mail updated \n";
        }

        if (supplier.address != oldSupplier.address) {
            update = update + "Address updated \n";
        }

        if (supplier.supplier_company_staff_name != oldSupplier.supplier_company_staff_name) {
            update = update + "Company Staff Name updated \n";
        }

        if (supplier.company_staff_mobile_no != oldSupplier.company_staff_mobile_no) {
            update = update + "Company Staff Mobile Number updated \n";
        }

        if (supplier.bank_id.id != oldSupplier.bank_id.id) {
            update = update + "Bank updated \n";
        }

        if (supplier.bank_branch_name != oldSupplier.bank_branch_name) {
            update = update + "Bank Branch Name updated \n";
        }

        if (supplier.bank_account_number != oldSupplier.bank_account_number) {
            update = update + "Bank Account Number updated \n";
        }

        if (supplier.account_holder_name != oldSupplier.account_holder_name) {
            update = update + "Bank Account Holder Name updated \n";
        }

        if (supplier.arreas_amount != oldSupplier.arreas_amount) {
            update = update + "Company Areas Amount updated \n";
        }

        if (supplier.note != oldSupplier.note) {
            update = update + "Supplier Note updated \n";
        }

        if (supplier.supplier_status_id.id != oldSupplier.supplier_status_id.id) {
            update = update + "Supplier Status updated \n";
        }


        if(supplier.supplierHasModelList.length != oldSupplier.supplierHasModelList.length){

            update = update + "Supplier Model List updated \n";

        }else {

            let ext = 0;
            for(let index in supplier.supplierHasModelList){

                for(let ind in oldSupplier.supplierHasModelList){

                    if(supplier.supplierHasModelList[index].id == oldSupplier.supplierHasModelList[ind].id){

                        ext = ext +1;
                        break;

                    }

                }

            }

            if (ext != user.role.length){

                update = update + "Supplier Model List updated \n";

            }

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
            let updateResponce = window.confirm("Are you willing to update following Supplier Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/supplier","PUT",supplier);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Supplier Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Supplier Details, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

}

const rowDelete = (ob) => {

    let deleteMsg = "Would you like to Delete the following Supplier?\n" +
    "\n Business Reg No : " + ob.business_reg_no +
    "\n Company Reg No  : " + ob.supplier_company_reg_no +
    "\n Company Name    : " + ob.supplier_company_name;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/supplier","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Supplier Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    supplierPrint = getServiceRequest("/supplier/getbyid/"+ob.id)

    $('#supplierModal').modal("show");


    modSupBusRegNo.innerHTML              = supplierPrint.supplier_reg_no;
    modSupComRegNo.innerHTML              = supplierPrint.supplier_company_reg_no;
    modSupCompName.innerHTML              = supplierPrint.supplier_company_name;
    modSupContNo.innerHTML                = supplierPrint.contact_number;
    modSupEmail.innerHTML                 = supplierPrint.supplier_company_email;
    modSupAddress.innerHTML               = supplierPrint.address;
    modSupStaffName.innerHTML             = supplierPrint.supplier_company_staff_name;
    modSupStaffMobileNo.innerHTML         = supplierPrint.company_staff_mobile_no;
    modSupBank.innerHTML                  = supplierPrint.bank_id.name;
    modSupBankBranch.innerHTML            = supplierPrint.bank_branch_name;
    modSupBankAccountNo.innerHTML         = supplierPrint.bank_account_number;
    modSupBankAccountHolderName.innerHTML = supplierPrint.account_holder_name;
    modSupAreasAmount.innerHTML           = supplierPrint.arreas_amount;
    modSupStatus.innerHTML                = supplierPrint.supplier_status_id.name;
    modSupNote.innerHTML                  = supplierPrint.note;

}

const clearBtn = () => {

    refreshForm();

}

const btnAddOneModel = () => {

    console.log(supplier.supplierHasModelList.length);
    console.log(supplier);

    if(allModelsSelectionField.value != ""){
    //SELECT MODELS FROM ALL-MODELS LIST AND ADD TO THE SELECTED MODELS LIST
        let selectedModels = JSON.parse(allModelsSelectionField.value) // JSON.parse() is used to convert json string values to javascript object.

        supplier.supplierHasModelList.push(selectedModels);
        fillSelectFeild(selectedModelsSelectionField, "", supplier.supplierHasModelList, "model_name");

        let extIndex = supAllModels.map(model => model.id).indexOf(selectedModels.id)
        if (extIndex != -1) {

          supAllModels.splice(extIndex, 1); //remove Selected model from the all-models list
          fillSelectFeild(allModelsSelectionField, "", supAllModels, "model_name");

        }

    }else {

          window.alert("Please select a model to add...");

    }


}


const btnAddAllModel = () => {

    for (const model of supAllModels){

        supplier.supplierHasModelList.push(model);

    }

    fillSelectFeild(selectedModelsSelectionField, "", supplier.supplierHasModelList, "model_name");

    supAllModels = []; // Emptying all-model list
    fillSelectFeild(allModelsSelectionField, "", supAllModels, "model_name");


}


const btnRemoveOneModel = () => {

    if(selectedModelsSelectionField.value != ""){
        //SELECT MODELS FROM ALL-MODELS LIST AND ADD TO THE SELECTED MODELS LIST
        let selectedModelsToRemove = JSON.parse(selectedModelsSelectionField.value) // JSON.parse() is used to convert json string values to javascript object.

        supAllModels.push(selectedModelsToRemove);
        fillSelectFeild(allModelsSelectionField, "", supAllModels, "model_name");

        let extIndex = supplier.supplierHasModelList.map(model => model.id).indexOf(selectedModelsToRemove.id)
        if (extIndex != -1) {

            supplier.supplierHasModelList.splice(extIndex, 1); //remove Selected model from the selected-models list
            fillSelectFeild(selectedModelsSelectionField, "", supplier.supplierHasModelList, "model_name");

        }
    }else {

        window.alert("Please select a model to remove...");

    }

}


const btnRemoveAllModel = () => {

    for (const model of supplier.supplierHasModelList){

        supAllModels.push(model);

    }

    fillSelectFeild(allModelsSelectionField, "", supAllModels, "model_name");

    supplier.supplierHasModelList = []; // Emptying all-model list
    fillSelectFeild(selectedModelsSelectionField, "", supplier.supplierHasModelList, "model_name");

}

