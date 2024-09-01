
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PURCHASE-ORDER")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

    //filtering for Quotation number by active supplier
    purchaseOrderSupplierName.addEventListener('change', event => {

        quotationNoByPurchaseOrderSupplierName = getServiceRequest("/quotation/listbyquotation/" + JSON.parse(purchaseOrderSupplierName.value).id)
        fillSelectFeild(purchaseOrderQuotationNo, "Select Quotation Number", quotationNoByPurchaseOrderSupplierName, "quotation_number", "")

        if (oldPurchaseOrder != null && JSON.parse(purchaseOrderSupplierName.value).name != oldPurchaseOrder.quotation_id.quotation_request_id.supplier_id.supplier_company_name){

            purchaseOrderSupplierName.style.color = "orange"
            purchaseOrderSupplierName.style.borderBottom = "2px solid orange"

        }else {

            purchaseOrderSupplierName.style.color = "green"
            purchaseOrderSupplierName.style.borderBottom = "2px solid green"

        }

        $('#purchaseOrderQuotationNo').css("pointer-events", "all");
        $('#purchaseOrderQuotationNo').css("cursor", "pointer");

    })

    //filtering for model by quotation
    purchaseOrderQuotationNo.addEventListener('change', event => {

        modelNameByPurchaseOrderQuotationNumber = getServiceRequest("/model/listbymodel/" + JSON.parse(purchaseOrderQuotationNo.value).id)
        fillSelectFeild2(purchaseOrderModel, "Select Model", modelNameByPurchaseOrderQuotationNumber, "model_number", "model_name")

        if (oldPurchaseOrder != null && JSON.parse(purchaseOrderQuotationNo.value).name != oldPurchaseOrder.quotation_id.quotation_number){

            purchaseOrderQuotationNo.style.color = "orange"
            purchaseOrderQuotationNo.style.borderBottom = "2px solid orange"

        }else {

            purchaseOrderQuotationNo.style.color = "green"
            purchaseOrderQuotationNo.style.borderBottom = "2px solid green"

        }

        /*$('#purchaseOrderModel').css("pointer-events", "all");
        $('#purchaseOrderModel').css("cursor", "pointer");*/

    })

    //filtering for unit price by model
    purchaseOrderModel.addEventListener('change', event => {

        unitPriceByPurchaseOrderModel = getServiceRequest("/quotationhasmodel/listbymodelpurchaseprice/"+JSON.parse(purchaseOrderQuotationNo.value).id+"/"+JSON.parse(purchaseOrderModel.value).id);
        modelPurchasePrice = unitPriceByPurchaseOrderModel.purchase_price;
        purchaseOrderUnitPrice.value = parseFloat(modelPurchasePrice).toFixed(2)
        purchaseOrderHasModel.unit_price = parseFloat(modelPurchasePrice).toFixed(2);
        purchaseOrderUnitPrice.style.color = 'green';

        console.log(unitPriceByPurchaseOrderModel);

        if (oldPurchaseOrder != null && JSON.parse(purchaseOrderModel.value).name != oldPurchaseOrder.purchaseOrderHasModelList.model_id.model_name){

            purchaseOrderModel.style.color = "orange"
            purchaseOrderModel.style.borderBottom = "2px solid orange"

        }else {

            purchaseOrderModel.style.color = "green"
            purchaseOrderModel.style.borderBottom = "2px solid green"

        }

    })


}




//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    purchaseOrders = new Array();

    purchaseOrders = getServiceRequest("/purchaseorder/findall");

    //create display property list
    let DisplayPropertyList = ['purchase_order_number','quotation_id.quotation_request_id.supplier_id.supplier_company_name','quotation_id.quotation_number','total_amount','required_date','purchase_order_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object','object',getTotalAmount,'text','object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tablePurchaseOrder, purchaseOrders, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in purchaseOrders){

        if(purchaseOrders[index].purchase_order_status_id.name == "Deleted")
            tablePurchaseOrder.children[1].children[index].children[7].children[1].style.display = "none";

        /*if(purchaseOrders[index].purchase_order_status_id.name != "Requested")*/
            tablePurchaseOrder.children[1].children[index].children[7].children[0].style.display = "none";

    }
    //need to add jquery table
    $('#tablePurchaseOrder').dataTable();


}

const getTotalAmount = (ob) => {

    return "Rs." + parseFloat(ob.total_amount).toFixed(2);

}

const refreshForm = () => {


    purchaseOrder = new Object();
    oldPurchaseOrder = null;

    purchaseOrder.purchaseOrderHasModelList = new Array();

    suppliers = getServiceRequest("/supplier/listbyactivesupplierstatus");
    fillSelectFeild(purchaseOrderSupplierName, "Select Purchase-Order Supplier", suppliers, "supplier_company_name")

    statuses = getServiceRequest("/purchaseorderstatus/list")
    fillSelectFeild(purchaseOrderStatus, "Select Purchase-Order Status", statuses, "name", "Requested")
    purchaseOrder.purchase_order_status_id = JSON.parse(purchaseOrderStatus.value);

    quotationNos = getServiceRequest("/quotation/list")
    fillSelectFeild(purchaseOrderQuotationNo, "Select Quotation Number", quotationNos, "quotation_number")


    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    purchaseOrderSupplierName.style.color        = "grey";
    purchaseOrderSupplierName.style.borderBottom = "none";

    $('#purchaseOrderSupplierName').css("pointer-events", "all");
    $('#purchaseOrderSupplierName').css("cursor", "pointer");

    purchaseOrderStatus.style.color        = "green";
    purchaseOrderStatus.style.borderBottom = "solid";

    purchaseOrderQuotationNo.style.color        = "grey";
    purchaseOrderQuotationNo.style.borderBottom = "none";

    $('#purchaseOrderQuotationNo').css("pointer-events", "all");
    $('#purchaseOrderQuotationNo').css("cursor", "pointer");


    purchaseOrderRequiredDate.value = "";
    purchaseOrderTotalAmount.value  = "";
    /*purchaseTotalAmount.disabled = true;*/

    $('#purchaseOrderTotalAmount').css("pointer-events", "none");
    $('#purchaseOrderTotalAmount').css("cursor", "not-allowed");


    // SETTING THE DATE FOR PRE-ORDER

    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() + 2);

    purchaseOrderRequiredDate.min = currentDateForMin.getFullYear() + getMontahDate(currentDateForMin);


    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() + 30);

    purchaseOrderRequiredDate.max = currentDateForMax.getFullYear() + getMontahDate(currentDateForMax);

    refreshInnerFormAndTable();

    disableAddUpdateBtn(true);

}


const disableAddUpdateBtn = (addBtn) => {


    if( addBtn && loggedUserPrivilage.ins ){

        btnAdd.disabled = false;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "pointer");


    }else {

        btnAdd.disabled = true;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "not-allowed");

    }


    /*if( updBtn && loggedUserPrivilage.upd ){

        btnUpdate.disabled = false;
        $('#btnUpdate').css("pointer-events", "all");
        $('#btnUpdate').css("cursor", "pointer");


    }else {

        btnUpdate.disabled = true;
        $('#btnUpdate').css("pointer-events", "all");
        $('#btnUpdate').css("cursor", "not-allowed");

    }*/


}


const refreshInnerFormAndTable = () => {

    //INNER FORM
    purchaseOrderHasModel = new Object();
    oldPurchaseOrderHasModel = null;

    //checking the purchase order to fill the model filed according to the selected purchase order
    if(purchaseOrderQuotationNo.value != ""){
        modelNameByQuotation = modelNameByPurchaseOrderQuotationNumber = getServiceRequest("/model/listbymodel/" + JSON.parse(purchaseOrderQuotationNo.value).id)
        fillSelectFeild2(purchaseOrderModel, "Select Model", modelNameByQuotation, "model_number", "model_name")

    }else{

        innerModels = getServiceRequest("/model/list")
        fillSelectFeild2(purchaseOrderModel, "Select Model", innerModels,"model_number" ,"model_name",)

    }

    console.log(purchaseOrderModel)
    purchaseOrderModel.style.color        = "grey";
    purchaseOrderModel.style.borderBottom = "none";

    purchaseOrderModel.value      = "";
    purchaseOrderUnitPrice.value  = "";
    /*purchaseOrderUnitPrice.disabled = true;*/
    purchaseOrderQuantity.value   = "";
    purchaseOrderLineTotal.value  = "";
    /*preOrderLineTotal.disabled = true;*/

    //DISABLED THE DROPDOWN FIELD, WILL ENABLE THE DROPDOWN WHEN THE QUOTATION IS SELECTED
    /*$('#purchaseOrderModel').css("pointer-events", "none");
    $('#purchaseOrderModel').css("cursor", "not-allowed");*/

    $('#purchaseOrderUnitPrice').css("pointer-events", "none");
    $('#purchaseOrderUnitPrice').css("cursor", "not-allowed");

    $('#purchaseOrderLineTotal').css("pointer-events", "none");
    $('#purchaseOrderLineTotal').css("cursor", "not-allowed");

    //INEER TABLE

    //SETTING DEFAULT VALUE TO THE TOTAL AMOUNT
    let totalAmount = 0.00;

    //create display property list
    let DisplayPropertyList = ['model_id.model_name','unit_price','quantity','line_amount'];

    //create display property list type
    let DisplayPropertyListType = ['object','text','text','text'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PURCHASE-ORDER");
    // calling filldataintotable function to fill data
    fillDataIntoTable(tablePurchaseOrderInnerTable,purchaseOrder.purchaseOrderHasModelList,DisplayPropertyList, DisplayPropertyListType, innerFormRefill, innerRowDelete, innerRowView,true, innerLoggedUserPrivilage);


    //
    for (let index in purchaseOrder.purchaseOrderHasModelList){

        tablePurchaseOrderInnerTable.children[1].children[index].children[5].children[0].style.display = "none";
        tablePurchaseOrderInnerTable.children[1].children[index].children[5].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(purchaseOrder.purchaseOrderHasModelList[index].line_amount)

    }


    if (totalAmount != 0.00){

        purchaseOrderTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        purchaseOrder.total_amount     = purchaseOrderTotalAmount.value;

        if (oldPurchaseOrder != null && purchaseOrder.total_amount != oldPurchaseOrder.total_amount){

            //update style
            purchaseOrderTotalAmount.style.color = 'orange';


        }else {

            //valid style
            purchaseOrderTotalAmount.style.color = 'green';

        }

    }

}

const selectModelToGetUnitPrice = () => {


    purchaseOrderUnitPrice.value = parseFloat(JSON.parse(purchaseOrderModel.value).purchase_price).toFixed(2)
    purchaseOrderHasModel.unit_price = purchaseOrderUnitPrice.value;


    purchaseOrderUnitPrice.style.color = 'green';

}


const multiplyQuantityWithUnitPrice = () => {

    if (purchaseOrderQuantity.value != 0){

        let regPattern = new RegExp("^[0-9]{1,5}$");

        if (regPattern.test(purchaseOrderQuantity.value)){

            purchaseOrderLineTotal.value  = (parseFloat(purchaseOrderUnitPrice.value)*parseFloat(purchaseOrderQuantity.value)).toFixed(2)
            purchaseOrderLineTotal.style.color = 'green';
            purchaseOrderHasModel.line_amount = purchaseOrderLineTotal.value;
            innerFormBtnAdd.disabled = false;

        }else {

            purchaseOrderQuantity.style.color = 'red';

        }

    }else {

        purchaseOrderQuantity.style.color = 'red';
        innerFormBtnAdd.disabled = true;
        purchaseOrderLineTotal.value = "";

    }

}


const innerAddMC = () => {

    let itemExt = false;

    for (let index in purchaseOrder.purchaseOrderHasModelList){

        if (purchaseOrder.purchaseOrderHasModelList[index].model_id.model_name == purchaseOrderHasModel.model_id.model_name){

            itemExt = true;
            break;

        }

    }

    if (!itemExt){

        let submitConfigMsg = "Are you willing to add following Purchase-Order Model?\n" +
            "\n Model Name : " + purchaseOrderHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + purchaseOrderHasModel.unit_price +
            "\n Quantity   : "   + purchaseOrderHasModel.quantity +
            "\n Line Total : Rs. " + purchaseOrderHasModel.line_amount;

       // window.alert(purchaseOrderUnitPrice.value);

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            purchaseOrder.purchaseOrderHasModelList.push(purchaseOrderHasModel);
            alert("Purchase-Order Model Added Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }

    }else {

        alert("Model Cannot be Added : It's already Exist!!!\n" + "\n Model Name : " + purchaseOrderHasModel.model_id.model_name)

    }


}

const innerClearMC = () => {

    refreshInnerFormAndTable();

}

const innerFormRefill = (innerOb, innerRowNo) => {

    selectedInnerRow = innerRowNo;
    purOrHasModels = JSON.parse(JSON.stringify(innerOb));
    oldPurOrHasModels = JSON.parse(JSON.stringify(innerOb));

    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(purchaseOrderModel, "Select Model", innerModels,"model_number" ,"model_name", purOrHasModels.model_id.model_number)

    purchaseOrderModel.style.color        = "green";
    purchaseOrderModel.style.borderBottom = "solid";
    $('#purchaseOrderModel').css("pointer-events", "none");
    $('#purchaseOrderModel').css("cursor", "not-allowed");


    purchaseOrderUnitPrice.value       = purOrHasModels.unit_price;
    purchaseOrderUnitPrice.style.color = "green";
    $('#purchaseOrderUnitPrice').css("pointer-events", "none");
    $('#purchaseOrderUnitPrice').css("cursor", "not-allowed");


    purchaseOrderQuantity.value   = purOrHasModels.quantity;
    purchaseOrderQuantity.style.color = "green";


    purchaseOrderLineTotal.value  = purOrHasModels.line_amount;
    purchaseOrderLineTotal.style.color = "green";
    $('#purchaseOrderLineTotal').css("pointer-events", "none");
    $('#purchaseOrderLineTotal').css("cursor", "not-allowed");


    //Disabling the inner Add Btn...
    innerFormBtnAdd.disabled = true;
    $('#innerFormBtnAdd').css("cursor", "not-allowed");

}

const innerRowDelete = (innerOb, innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Purchase-Order Model?\n"
        +"Model Name : "+ innerOb.model_id.model_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

         purchaseOrder.purchaseOrderHasModelList.splice(innerRowIndex, 1);
         alert("As you wish, Deleted the Purchase-Order Successfully !!!");
         refreshInnerFormAndTable();

    }

}

const innerRowView = () => {

}


function checkErrors() {

    let error = "";


    if (purchaseOrderSupplierName.value == ""){

        error = error + "Purchase-Order Supplier Field Incomplete \n";

    }

    if (purchaseOrder.quotation_id == null){

        error = error + "Purchase-Order Quotation Field Incomplete \n";

    }

    if (purchaseOrder.required_date == null){

        error = error + "Purchase-Order Required Date Field Incomplete \n";

    }

    if (purchaseOrder.total_amount == null){

        error = error + "Purchase-Order Total Amount Field Incomplete \n";

    }

    if (purchaseOrder.purchase_order_status_id == null){

        error = error + "Purchase-Order Status Field Incomplete \n";

    }

    if (purchaseOrder.purchaseOrderHasModelList.length == "0"){

        error = error + "Purchase-Order Models Not Added \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Purchase-Order?\n" +
            "\n Supplier Name                : " + purchaseOrder.supplier_id.supplier_company_name +
            "\n Purchase-Order Required Date : " + purchaseOrder.required_date +
            "\n Total Amount                 : Rs. " + purchaseOrder.total_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/purchaseorder", "POST", purchaseOrder);


            if (postServiceResponse == "0") {

                alert("Purchase-Order Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active")

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

    purchaseOrder    = getAjexServiceRequest("/purchaseorder/getbyid/"+ob.id);
    oldPurchaseOrder = getAjexServiceRequest("/purchaseorder/getbyid/"+ob.id);


    //SET VALUE
    purchaseOrderRequiredDate.value = purchaseOrder.required_date;
    purchaseOrderTotalAmount.value  = purchaseOrder.total_amount;



    fillSelectFeild(purchaseOrderSupplierName, "Select Purchase-Order Supplier", suppliers, "supplier_company_name", purchaseOrder.quotation_id.quotation_request_id.supplier_id.supplier_company_name);
    purchaseOrderSupplierName.style.borderBottom   = "solid";
    $('#purchaseOrderSupplierName').css("pointer-events", "none");
    $('#purchaseOrderSupplierName').css("cursor", "not-allowed")

    fillSelectFeild(purchaseOrderStatus, "Select Purchase-Order Status", statuses, "name", purchaseOrder.purchase_order_status_id.name);
    purchaseOrderStatus.style.borderBottom   = "solid";

    fillSelectFeild(purchaseOrderQuotationNo, "Select Quotation Number", quotationNos, "quotation_number", purchaseOrder.quotation_id.quotation_number);
    purchaseOrderQuotationNo.style.borderBottom   = "solid";
    $('#purchaseOrderQuotationNo').css("pointer-events", "none");
    $('#purchaseOrderQuotationNo').css("cursor", "not-allowed");

    refreshInnerFormAndTable();

    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (purchaseOrder != null && oldPurchaseOrder != null) {


        if (JSON.parse(purchaseOrderSupplierName.value).id != oldPurchaseOrder.quotation_id.quotation_request_id.supplier_id.id) {
            update = update + "Purchase-Order Supplier updated \n";
        }

        if (purchaseOrder.quotation_id.id != oldPurchaseOrder.quotation_id.id) {
            update = update + "Purchase-Order Supplier updated \n";
        }

        if ( purchaseOrder.required_date != oldPurchaseOrder.required_date) {
            update = update + "Purchase-Order Required Date updated \n";
        }

        if (purchaseOrder.total_amount != oldPurchaseOrder.total_amount) {
            update = update + "Purchase-Order Total Amount updated \n";
        }

        if (purchaseOrder.note != oldPurchaseOrder.note) {
            update = update + "Purchase-Order Note updated \n";
        }

        if (purchaseOrder.purchase_order_status_id.id != oldPurchaseOrder.purchase_order_status_id.id) {
            update = update + "Purchase-Order Status updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Purchase-Order Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/purchaseorder","PUT",purchaseOrder);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Purchase-Order Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    refreshInnerFormAndTable()
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Purchase-Order Details, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }

}

const rowDelete = (ob) => {

    let deleteMsg = "Would you like to Delete the following Pre-Order?\n"
        +"Purchase-Order Code : "+ ob.purchase_order_number ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/purchaseorder","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Purchase-Order Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    purchaseOrderPrint = getServiceRequest("/purchaseorder/getbyid/"+ob.id)

    $('#purchaseOrderModal').modal("show");

    modPurchaseOrderSupplierName.innerHTML = purchaseOrderPrint.quotation_id.quotation_request_id.supplier_id.supplier_company_name;
    modPurchaseOrderQuotationNo.innerHTML  = purchaseOrderPrint.quotation_id.quotation_number;
    modPurchaseOrderRequiredDate.innerHTML = purchaseOrderPrint.required_date;
    modPurchaseOrderTotalAmount.innerHTML  = purchaseOrderPrint.total_amount;
    modPurchaseOrderStatus.innerHTML       = purchaseOrderPrint.purchase_order_status_id.name;
    modPurchaseOrderNote.innerHTML         = purchaseOrderPrint.note;



}

const clearBtn = () => {

    refreshForm();

}



