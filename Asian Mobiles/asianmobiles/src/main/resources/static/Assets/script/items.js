
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=ITEMS")

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
    items = new Array();

    items = getServiceRequest("/items/findall");

    //create display property list
    let DisplayPropertyList = ['item_name','item_code_number','iemi_number_1','iemi_number_2','serial_number','item_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','text',"text","text","text","object"];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableItems, items, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in items){

        if(items[index].item_status_id.name == "Deleted")
            tableItems.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableItems').dataTable();

}

const refreshForm = () => {


    item = new Object();
    oldItem = null;

    itmeStatuses = getServiceRequest("/itemstatus/list")
    fillSelectFeild(itemStatus, "Select Item Status", itmeStatuses, "name", "");

    itmeModels = getServiceRequest("/model/findall")
    fillSelectFeild(itemModelName, "Select Item Model Name", itmeModels, "model_name", "");

    //CLEARING THE EMPLOYEE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE CUSTOMER

    itemStatus.style.color        = "grey";
    itemStatus.style.borderBottom = "none";

    itemModelName.style.color        = "grey";
    itemModelName.style.borderBottom = "none";


    itemNote.value          = "";
    itemName.value          = "";
    itemImeiNumber01.value  = "";
    itemImeiNumber02.value  = "";
    itemSerialNumber.value  = "";
    itemCodeNumber.value    = "";



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


const generateItemName = () => {

    if ( itemModelName.value != "" ){

        itemName.value = JSON.parse(itemModelName.value).name ;
        item.item_name = itemName.value;

        if (oldItem != null && item.item_name != oldItem.item_name){

            itemName.style.color = "orange";

        }else{

            itemName.style.color = "green";

        }

    }else {

        itemName.value = "";
        item.item_name = null;

    }

}


function checkErrors() {

    let error = "";


    if (item.model_id == null){

        error = error + "Item Model Name Field Incomplete \n";

    }


    if (item.item_name == null){

        error = error + "Item Name Field Incomplete \n";

    }


    if (item.iemi_number_1 == null){

        error = error + "Item IMEI Number 01 Field Incomplete \n";

    }


    if (item.serial_number == null){

        error = error + "Item Serial Number Field Incomplete \n";

    }

    if (item.item_code_number == null){

        error = error + "Item Code Number Field Incomplete \n";

    }

    if (item.item_status_id == null){

        error = error + "Item Status Field Incomplete \n";

    }


    return error;

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Item?";
        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/items", "POST", item);


            if (postServiceResponse == "0") {

                alert("Item Added Successfully as you wish!!!");
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

    item    = getAjexServiceRequest("/items/getbyid/"+ob.id);
    oldItem = getAjexServiceRequest("/items/getbyid/"+ob.id);


    //SET VALUE
    itemName.value          = item.item_name
    itemNote.value          = item.note;
    itemImeiNumber01.value  = item.iemi_number_1;
    itemImeiNumber02.value  = item.iemi_number_2;
    itemSerialNumber.value  = item.serial_number;
    itemCodeNumber.value    = item.item_code_number;


    fillSelectFeild(itemStatus, "Select Item Status", itmeStatuses, "name", item.item_status_id.name);
    itemStatus.style.borderBottom   = "solid";

    fillSelectFeild(itemModelName, "Select Item Model Name", itmeModels, "model_name", item.model_id.model_name);
    itemModelName.style.borderBottom   = "solid";


    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (item != null && oldItem != null) {


        if ( item.model_id.model_name != oldItem.model_id.model_name) {
            update = update + "Item Model Name updated \n";
        }

        if (item.item_name != oldItem.item_name) {
            update = update + "Item Name updated \n";
        }

        if (item.iemi_number_1 != oldItem.iemi_number_1) {
            update = update + "Item IEMI Number 01 updated \n";
        }

        if (item.iemi_number_2 != oldItem.iemi_number_2) {
            update = update + "Item IEMI Number 02 updated \n";
        }

        if (item.serial_number != oldItem.serial_number) {
            update = update + "Item Serial Number  updated \n";
        }

        if (item.item_code_number != oldItem.item_code_number) {
            update = update + "Item Code Number updated \n";
        }

        if (item.item_status_id.name != oldItem.item_status_id.name) {
            update = update + "Item Status updated \n";
        }

         if (item.note != oldItem.note) {
            update = update + "Item Note updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Item? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/items","PUT",item);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Item successfully as you wish...!");
                    refreshTable();
                    refreshForm();

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the item, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

    empMancontainer.classList.remove("right-panel-active")

}

const rowDelete = (ItemOb) => {

    let deleteMsg = "Would you like to Delete the following Item ?\n"
        +"Item Name : "+ ItemOb.item_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/items","DELETE", ItemOb);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Item Successfully !!!");
            refreshTable();
        }else {
            window.confirm("You have the following error\n" + deleteSeverResponse)
        }

    }

}

const rowView = (ob) => {

    itemsPrint = getServiceRequest("/items/getbyid/"+ob.id)

    $('#itemModal').modal("show");

    modItemName.innerHTML     = itemsPrint.item_name;
    modItemImeiNo01.innerHTML = itemsPrint.iemi_number_1;
    modItemImeiNo02.innerHTML = itemsPrint.iemi_number_2;
    modSerialNo.innerHTML     = itemsPrint.serial_number;
    modItemCodeNo.innerHTML   = itemsPrint.item_code_number;
    modItemStatus.innerHTML   = itemsPrint.item_status_id.name;
    modItemNote.innerHTML     = itemsPrint.note;


}

const clearBtn = () => {

    refreshForm();

}



