
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=GOODS-RECEIVE-NOTE")

    //CALLED USER FORM AND TABLE BOX OR CONTAINER 3D ROTATE
    formAndTableContainer3DRotate();

    //CALLED USER FORM AND TABLE BOX OR CONTAINER OVERLAYPANEL SLIDER TO SLIDE LEFT AND RIGHT
    moveRightAndLeftOverlayPanel();

    //CALLED REFRESH TABLE FUNCTION
    refreshTable();

    //CALLED REFRESH FORM FUNCTION
    refreshForm();

    grnSupplier.addEventListener('change', event => {

        purchaseOrderNoByGoodsReceiveNoteSupplierName = getServiceRequest("/purchaseorder/listbypurchaseorder/" + JSON.parse(grnSupplier.value).id)
        fillSelectFeild(grnPurchaseOrder, "Select Purchase-Order No", purchaseOrderNoByGoodsReceiveNoteSupplierName, "purchase_order_number", "")

        if (oldGoodsReceiveNote != null && JSON.parse(grnSupplier.value).name != oldGoodsReceiveNote.supplier_id.supplier_company_name){

            grnSupplier.style.color = "orange"
            grnSupplier.style.borderBottom = "2px solid orange"

        }else {

            grnSupplier.style.color = "green"
            grnSupplier.style.borderBottom = "2px solid green"

        }

    })

}


//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    goodsReceiveNotes = new Array();

    goodsReceiveNotes = getServiceRequest("/goodsreceivenote/findall");

    //create display property list
    let DisplayPropertyList = ['grn_code','supplier_id.supplier_company_name','purchase_order_id.purchase_order_number','net_total_amount','paid_amount','total_amount', 'goods_receive_note_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','object','object',getNetTotalAmount,getPaidAmount,getTotalAmount,'object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableGoodsReceiveNote, goodsReceiveNotes, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in goodsReceiveNotes){

        if(goodsReceiveNotes[index].goods_receive_note_status_id.name == "Deleted")
            tableGoodsReceiveNote.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableGoodsReceiveNote').dataTable();


}


const getNetTotalAmount = (ob) => {

    return "Rs." + parseFloat(ob.net_total_amount).toFixed(2);

}

const getPaidAmount = (ob) => {

    return "Rs." + parseFloat(ob.paid_amount).toFixed(2);

}

const getTotalAmount = (ob) => {

    return "Rs." + parseFloat(ob.total_amount).toFixed(2);

}

const refreshForm = () => {


    goodsReceiveNote = new Object();
    oldGoodsReceiveNote = null;

    goodsReceiveNote.goodsReceiveNoteHasModelList = new Array();

    suppliers = getServiceRequest("/supplier/list");
    fillSelectFeild(grnSupplier, "Select Supplier", suppliers, "supplier_company_name");

    purchaseOrders = getServiceRequest("/purchaseorder/list");
    fillSelectFeild(grnPurchaseOrder, "Select Purchase-Order No", purchaseOrders, "purchase_order_number");

    grnStatuses = getServiceRequest("/goodsreceivenotestatus/list")
    fillSelectFeild(grnStatus, "Select GRN Status", grnStatuses, "name")


    goodsReceiveNote.total_amount = 0.00;
    goodsReceiveNote.tax = 0.00;
    goodsReceiveNote.discount = 0.00;


    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    grnSupplier.style.color             = "grey";
    grnSupplier.style.borderBottom      = "none";

    grnPurchaseOrder.style.color        = "grey";
    grnPurchaseOrder.style.borderBottom = "none";

    grnStatus.style.color               = "grey";
    grnStatus.style.borderBottom        = "none";



    grnBillInvoiceNo.value    = "";
    grnBillDate.value         = "";
    grnGoodsReceiveDate.value = "";
    grnTotalAmount.value      = "";
    grnTax.value              = "";
    grnDiscount.value         = "";
    grnNetTotalAmount.value   = "";
    grnPaidAmount.value       = "";
    grnNote.value             = "";


    $('#grnTotalAmount').css("pointer-events", "none");
    $('#grnTotalAmount').css("cursor", "not-allowed");

   /* $('#grnNetTotalAmount').css("pointer-events", "none");
    $('#grnNetTotalAmount').css("cursor", "not-allowed");*/

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
    goodsReceiveNoteHasModel    = new Object();
    oldGoodsReceiveNoteHasModel = null;


    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(innerGrnModel, "Select Model", innerModels,"model_number" ,"model_name",)


    innerGrnModel.style.color        = "grey";
    innerGrnModel.style.borderBottom = "none";
    innerGrnModel.value              = "";

    innerGrnUnitPrice.value          = "";
    innerGrnOrderQuantity.value      = "";
    innerGrnReceivedQuantity.value   = "";
    innerGrnLineTotal.value          = "";


    $('#innerGrnUnitPrice').css("pointer-events", "none");
    $('#innerGrnUnitPrice').css("cursor", "not-allowed");


    $('#innerGrnLineTotal').css("pointer-events", "none");
    $('#innerGrnLineTotal').css("cursor", "not-allowed");


    //INNER TABLE
    //SETTING DEFAULT VALUE TO THE TOTAL AMOUNT
    let totalAmount = 0.00;

    //create display property list
    let DisplayPropertyList = ['model_id.model_name','unit_price','ordered_quantity','received_quantity','line_amount'];

    //create display property list type
    let DisplayPropertyListType = ['object','text','text','text','text'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=GOODS-RECEIVE-NOTE");

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableGrnInnerTable,goodsReceiveNote.goodsReceiveNoteHasModelList,DisplayPropertyList, DisplayPropertyListType, innerFormRefill, innerRowDelete, innerRowView,true, innerLoggedUserPrivilage);


    // Created to invisible the Delete Btn in inner table  and sum all the line_total to total field.
    for (let index in goodsReceiveNote.goodsReceiveNoteHasModelList){

        tableGrnInnerTable.children[1].children[index].children[6].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(goodsReceiveNote.goodsReceiveNoteHasModelList[index].line_amount)

    }




    if (totalAmount != 0.00){

        grnTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        goodsReceiveNote.total_amount     = grnTotalAmount.value;
        netTotalCalculation();

        if (oldGoodsReceiveNote != null && goodsReceiveNote.total_amount != oldGoodsReceiveNote.total_amount){

            //update style
            grnTotalAmount.style.color = 'orange';


        }else {

            //valid style
            grnTotalAmount.style.color = 'green';

        }

    }

}

const selectModelToGetUnitPrice = () => {

    innerGrnUnitPrice.value = parseFloat(JSON.parse(innerGrnModel.value).sales_price).toFixed(2)
    goodsReceiveNoteHasModel.unit_price = innerGrnUnitPrice.value;
    innerGrnUnitPrice.style.color = 'green';


}

const multiplyQuantityWithUnitPrice = () => {

    if (innerGrnReceivedQuantity.value != 0){

        let regPattern = new RegExp("^[0-9]{1,5}$");

        if (regPattern.test(innerGrnReceivedQuantity.value)){

            innerGrnLineTotal.value  = (parseFloat(innerGrnUnitPrice.value)*parseFloat(innerGrnReceivedQuantity.value)).toFixed(2)
            innerGrnLineTotal.style.color = 'green';
            goodsReceiveNoteHasModel.line_amount = innerGrnLineTotal.value;
            innerFormBtnAdd.disabled = false;

        }else {

            innerGrnReceivedQuantity.style.color = 'red';
            $('#innerFormBtnAdd').css("cursor", "not-allowed");

        }

    }else {

        innerFormBtnAdd.disabled = true;
        innerGrnReceivedQuantity.style.color = 'red';
        innerGrnLineTotal.value = "";

    }

}


const innerAddMC = () => {

    let itemExt = false;

    for (let index in goodsReceiveNote.goodsReceiveNoteHasModelList){

        if (goodsReceiveNote.goodsReceiveNoteHasModelList[index].model_id.model_name == goodsReceiveNoteHasModel.model_id.model_name){

            itemExt = true;
            break;

        }

    }

    if (!itemExt){

        let submitConfigMsg = "Are you willing to add following Goods Receive Note Model?\n" +
            "\n Model Name : " + goodsReceiveNoteHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + goodsReceiveNoteHasModel.unit_price +
            "\n Received Quantity : " + goodsReceiveNoteHasModel.received_quantity +
            "\n Line Total : Rs. " + goodsReceiveNoteHasModel.line_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            goodsReceiveNote.goodsReceiveNoteHasModelList.push(goodsReceiveNoteHasModel);
            alert("Goods Receive Note Models Added Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }

    }else {

        alert("Model Cannot be Added : It's already Exist!!!\n" + "\n Model Name : " + goodsReceiveNoteHasModel.model_id.model_name)

    }


}

const innerClearMC = () => {

    refreshInnerFormAndTable();

}

const innerFormRefill = () => {

}

const innerRowDelete = (innerOb, innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Goods Receive Note Model?\n"
        +"Model Name : "+ innerOb.model_id.model_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

         goodsReceiveNote.goodsReceiveNoteHasModelList.splice(innerRowIndex, 1);
         alert("As you wish, Deleted the Goods Receive Note Successfully !!!");
         refreshInnerFormAndTable();

    }

}

const innerRowView = () => {



}

function checkErrors() {

    let error = "";


    if (grnSupplier.value == ""){

        error = error + "Supplier Field Incomplete \n";

    }

    if (grnPurchaseOrder.value == ""){

        error = error + "Purchase-Order Field Incomplete \n";

    }


    if (goodsReceiveNote.bill_invoice_number == null){

        error = error + "Bill Invoice Number Field Incomplete \n";

    }

    if (goodsReceiveNote.bill_date == null){

        error = error + "Bill Date Field Incomplete \n";

    }

    if (goodsReceiveNote.goods_receive_date == null){

        error = error + "Goods Receive Date Field Incomplete \n";

    }

    if (goodsReceiveNote.total_amount == null){

        error = error + "Total Amount Field Incomplete \n";

    }

    if (goodsReceiveNote.tax == null){

        error = error + "Tax Field Incomplete \n";

    }

    if (goodsReceiveNote.discount == null){

        error = error + "Discount Field Incomplete \n";

    }

    if (goodsReceiveNote.net_total_amount == null){

        error = error + "Net Total Amount Field Incomplete \n";

    }

    if (goodsReceiveNote.paid_amount == null){

        error = error + "Paid Amount Field Incomplete \n";

    }

    if (grnStatus.value == ""){

        error = error + "GRN Status Field Incomplete \n";

    }

    if (goodsReceiveNote.goodsReceiveNoteHasModelList.length == "0"){

        error = error + " Models Not Added \n";

    }


    return error;


}

//SETTING THE NET TOTAL AMOUNT BY DEDUCTING THE TAX & THE DISCOUNT FROM THE TOTAL AMOUNT...
const netTotalCalculation = () => {

    if (grnNetTotalAmount.value == 0){

        let tax = parseFloat(grnTotalAmount.value)*parseFloat(grnTax.value)/100;
        let totalAmountAfterAddingTax = parseFloat(grnTotalAmount.value)+tax;
        let discount = totalAmountAfterAddingTax*parseFloat(grnDiscount.value)/100;


        grnNetTotalAmount.value  = (totalAmountAfterAddingTax-discount).toFixed(2)
        grnNetTotalAmount.style.color = 'green';
        goodsReceiveNote.net_total_amount = innerGrnLineTotal.value;
        console.log(grnNetTotalAmount)

    }else {

        grnNetTotalAmount.style.color = 'red';

    }

}

//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Goods Receive Note?\n" +
            "\n Supplier Name : " + goodsReceiveNote.supplier_id.supplier_company_name +
            "\n Purchase-Order No : " + goodsReceiveNote.purchase_order_id.purchase_order_number +
            "\n Goods Receive Date : " + goodsReceiveNote.goods_receive_date +
            "\n Total Amount : Rs." + goodsReceiveNote.total_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/goodsreceivenote", "POST", goodsReceiveNote);


            if (postServiceResponse == "0") {

                alert("Goods Receive Note Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active")

            } else {

                window.confirm("You have these following error\n" + postServiceResponse)

            }
        }

    }else {

        alert("Form has these following errors\n" + errors)

    }

}


const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");

    goodsReceiveNote    = getAjexServiceRequest("/goodsreceivenote/getbyid/"+ob.id);
    oldGoodsReceiveNote = getAjexServiceRequest("/goodsreceivenote/getbyid/"+ob.id);


    //SET VALUE
    grnBillInvoiceNo.value    = goodsReceiveNote.bill_invoice_number;
    grnBillDate.value         = goodsReceiveNote.bill_date;
    grnGoodsReceiveDate.value = goodsReceiveNote.goods_receive_date;
    grnTotalAmount.value      = goodsReceiveNote.total_amount;
    grnTax.value              = goodsReceiveNote.tax;
    grnDiscount.value         = goodsReceiveNote.discount;
    grnNetTotalAmount.value   = goodsReceiveNote.net_total_amount;
    grnPaidAmount.value       = goodsReceiveNote.paid_amount;
    grnNote.value             = goodsReceiveNote.note;



    fillSelectFeild(grnSupplier, "Select Supplier", suppliers, "supplier_company_name", goodsReceiveNote.supplier_id.supplier_company_name);
    grnSupplier.style.borderBottom   = "solid";

    fillSelectFeild(grnPurchaseOrder, "Select Purchase-Order No", purchaseOrders, "purchase_order_number", goodsReceiveNote.purchase_order_id.purchase_order_number);
    grnPurchaseOrder.style.borderBottom   = "solid";

    fillSelectFeild(grnStatus, "Select GRN Status", grnStatuses, "name", goodsReceiveNote.goods_receive_note_status_id.name);
    grnStatus.style.borderBottom   = "solid";



    refreshInnerFormAndTable();

    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (goodsReceiveNote != null && oldGoodsReceiveNote != null) {


        if (JSON.parse(grnSupplier.value).id != oldGoodsReceiveNote.supplier_id.id) {
            update = update + "GRN Supplier Updated \n";
        }

        if (JSON.parse(grnPurchaseOrder.value).id != oldGoodsReceiveNote.purchase_order_id.id) {
            update = update + "GRN Purchase-Order Number Updated \n";
        }

        if (goodsReceiveNote.bill_invoice_number != oldGoodsReceiveNote.bill_invoice_number) {
            update = update + "GRN Bill Invoice Updated \n";
        }

        if (goodsReceiveNote.bill_date != oldGoodsReceiveNote.bill_date) {
            update = update + "GRN Bill Date Updated \n";
        }

        if (goodsReceiveNote.goods_receive_date != oldGoodsReceiveNote.goods_receive_date) {
            update = update + "GRN Goods Receive Date Updated \n";
        }

        if (goodsReceiveNote.total_amount != oldGoodsReceiveNote.total_amount) {
            update = update + "GRN Total Amount Updated \n";
        }

        if (goodsReceiveNote.tax != oldGoodsReceiveNote.tax) {
            update = update + "GRN Tax Updated \n";
        }

        if (goodsReceiveNote.discount != oldGoodsReceiveNote.discount) {
            update = update + "GRN Discount Updated \n";
        }

        if (goodsReceiveNote.net_total_amount != oldGoodsReceiveNote.net_total_amount) {
            update = update + "GRN Net Total Amount Updated \n";
        }


        if (goodsReceiveNote.paid_amount != oldGoodsReceiveNote.paid_amount) {
            update = update + "GRN Paid Amount updated \n";
        }

        if (goodsReceiveNote.note != oldGoodsReceiveNote.note) {
            update = update + "GRN Note updated \n";
        }

        if (goodsReceiveNote.goods_receive_note_status_id.id != oldGoodsReceiveNote.goods_receive_note_status_id.id) {
            update = update + "GRN Status updated \n";
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
            let updateResponce = window.confirm("Are you willing to update following Goods Receive Note Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/goodsreceivenote","PUT",goodsReceiveNote);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Goods Receive Note Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    refreshInnerFormAndTable()
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Goods Receive Note Details, Please try Again...!\n" + putResponce);

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



