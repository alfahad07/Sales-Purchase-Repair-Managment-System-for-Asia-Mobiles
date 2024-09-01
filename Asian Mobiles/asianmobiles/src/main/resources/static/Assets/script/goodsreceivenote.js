
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

    grnPurchaseOrder.addEventListener('change', event => {

        modelNameByGrnPurchaseOrder = getServiceRequest("/model/listbypurchaseorder/" + JSON.parse(grnPurchaseOrder.value).id)
        fillSelectFeild2(innerGrnModel, "Select Model", modelNameByGrnPurchaseOrder, "model_number", "model_name")

        if (oldGoodsReceiveNote != null && JSON.parse(grnPurchaseOrder.value).id != oldGoodsReceiveNote.purchase_order_id.id){

            grnPurchaseOrder.style.color = "orange"
            grnPurchaseOrder.style.borderBottom = "2px solid orange"

        }else {

            grnPurchaseOrder.style.color = "green"
            grnPurchaseOrder.style.borderBottom = "2px solid green"

        }

        /*$('#purchaseOrderModel').css("pointer-events", "all");
        $('#purchaseOrderModel').css("cursor", "pointer");*/

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

    //Invisibling the Delete and edit Button in the table
    for (let index in goodsReceiveNotes){

        tableGoodsReceiveNote.children[1].children[index].children[8].children[1].style.display = "none";
        tableGoodsReceiveNote.children[1].children[index].children[8].children[0].style.display = "none";

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

    suppliers = getServiceRequest("/supplier/listbyactivesupplierstatus");
    fillSelectFeild(grnSupplier, "Select Supplier", suppliers, "supplier_company_name");

    purchaseOrders = getServiceRequest("/purchaseorder/list");
    fillSelectFeild(grnPurchaseOrder, "Select Purchase-Order No", purchaseOrders, "purchase_order_number");

    grnStatuses = getServiceRequest("/goodsreceivenotestatus/list")
    fillSelectFeild(grnStatus, "Select GRN Status", grnStatuses, "name", "Received")
    goodsReceiveNote.goods_receive_note_status_id = JSON.parse(grnStatus.value);

    goodsReceiveNote.total_amount = 0.00;
    goodsReceiveNote.tax = 0.00;
    goodsReceiveNote.discount = 0.00;


    //CLEARING THE MODEL DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING THE MODELS

    grnSupplier.style.color             = "grey";
    grnSupplier.style.borderBottom      = "none";

    grnPurchaseOrder.style.color        = "grey";
    grnPurchaseOrder.style.borderBottom = "none";

    grnStatus.style.color               = "green";
    grnStatus.style.borderBottom        = "solid";



    grnBillInvoiceNo.value    = "";
    grnBillDate.value         = "";
    grnGoodsReceiveDate.value = "";
    grnTotalAmount.value      = "";
    grnTax.value              = "0.00";
    grnDiscount.value         = "0.00";
    grnNetTotalAmount.value   = "";
    grnNote.value             = "";


    $('#grnTotalAmount').css("pointer-events", "none");
    $('#grnTotalAmount').css("cursor", "not-allowed");

   /* $('#grnNetTotalAmount').css("pointer-events", "none");
    $('#grnNetTotalAmount').css("cursor", "not-allowed");*/

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

}


const refreshInnerFormAndTable = () => {

    //INNER FORM
    goodsReceiveNoteHasModel    = new Object();
    oldGoodsReceiveNoteHasModel = null;

    //THE BELOW ARRAY "goodsReceiveNoteHasModel.itemsList" IS USED TO ADD PHONE DETAILS TO THE ITEM MODULE.
    goodsReceiveNoteHasModel.itemsList = new Array();

    //checking the purchase order to fill the model filed according to the selected purchase order
    if(grnPurchaseOrder.value != ""){
        modelNameByGrnPurchaseOrder = getServiceRequest("/model/listbypurchaseorder/" + JSON.parse(grnPurchaseOrder.value).id)
        fillSelectFeild2(innerGrnModel, "Select Model", modelNameByGrnPurchaseOrder, "model_number", "model_name")

    }else{
        innerModels = getServiceRequest("/model/list")
        fillSelectFeild2(innerGrnModel, "Select Model", innerModels,"model_number" ,"model_name",)

    }


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


    // Created to invisible the View Btn in inner table  and sum all the line_total to total field.
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

// to get the unit price and Ordered Quantity of the model once selected the model
const selectModelToGetUnitPriceAndOrderedQuantity = () => {

    innerGrnUnitPrice.value = parseFloat(JSON.parse(innerGrnModel.value).purchase_price).toFixed(2)
    goodsReceiveNoteHasModel.unit_price = innerGrnUnitPrice.value;
    innerGrnUnitPrice.style.color = 'green';

    let porderhasmodal = getServiceRequest("/purchaseorderhasmodel/listbymodelpurchaseorderquantity/" + JSON.parse(grnPurchaseOrder.value).id + "/"+JSON.parse(innerGrnModel.value).id) ;
    innerGrnOrderQuantity.value = porderhasmodal.quantity;
     goodsReceiveNoteHasModel.ordered_quantity = innerGrnOrderQuantity.value;
    innerGrnOrderQuantity.style.color = 'green';

}

//multiplying unitprice with quantity to generate total price
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


//inner grn form add btn
const innerAddMC = () => {

    if (goodsReceiveNoteHasModel.model_id.sub_catergory_id.category_id.name == "Phones") {

        //need to open item modal
        $("#modalAddSerialNo").modal("show");

        refreshModalInnerItemFormAndTable()

    }else{
        innerGrnSubmit();
    }
}


// Inner Item form and table which appear as modal only for phones
const refreshModalInnerItemFormAndTable = () => {

    grnItems = new Object();
    oldgrnItems = null;


    //FILL DATA INTO INNER FORM TABLE

    phoneColours = getServiceRequest("/modelcolour/list")
    fillSelectFeild(itemPhoneColour, "Select Phone Colour", phoneColours, "name", "");

    itemPhoneColour.style.color        = "grey";
    itemPhoneColour.style.borderBottom = "none";

    //need empty inner item form element
    itemImeiNumber01.value  = "";
    itemImeiNumber02.value  = "";
    itemSerialNumber.value  = "";


    //FILL DATA INTO INNER ITEM TABLE

    //create display property list
    let DisplayPropertyList = ['iemi_number_1','iemi_number_2','serial_number','phone_colour_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','text','text','object'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=GOODS-RECEIVE-NOTE");

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableGrnItems,goodsReceiveNoteHasModel.itemsList, DisplayPropertyList, DisplayPropertyListType, innerItemFormRefill, innerItemRowDelete, innerItemRowView,true, innerLoggedUserPrivilage);


    // Created to invisible the EditBtn & ViewBtn in inner item table
    for (let index in goodsReceiveNoteHasModel.itemsList){

        tableGrnItems.children[1].children[index].children[5].children[0].style.display = "none";
        tableGrnItems.children[1].children[index].children[5].children[2].style.display = "none";

    }

    //Allowing to add the phone details according to the received quantity and auto submit
    if (goodsReceiveNoteHasModel.itemsList.length == goodsReceiveNoteHasModel.received_quantity){

           //setting timeout for the inner item form
           setTimeout(()=>{
               $("#modalAddSerialNo").modal("hide");
               innerGrnSubmit();
           }, 1500)
    }

}

// MODIFY BUTTONS FOR INNER ITEMS TABLE ONLY FOR PHONE
const innerItemFormRefill = () => {

}

const innerItemRowDelete = (innerOb , innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Item Details?\n"
        +"Serial No :  "+ innerOb.serial_number ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        goodsReceiveNoteHasModel.itemsList.splice(innerRowIndex, 1);
         alert("As you wish, Deleted the Item Details? Successfully !!!");
        refreshModalInnerItemFormAndTable();

    }

}

const innerItemRowView = () => {

}




// inner grn item form add button (Small Add Btn)
const addSerialNoBtn = () => {
    let itemExt = false;

    for (let index in goodsReceiveNoteHasModel.itemsList){

        if (goodsReceiveNoteHasModel.itemsList[index].serial_number == grnItems.serial_number){

            itemExt = true;
            break;

        }

    }

    if (!itemExt){

        let submitConfigMsg = "Are you willing to add following Phone Details ?\n" +
            "\n Serial No : " + grnItems.serial_number ;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            goodsReceiveNoteHasModel.itemsList.push(grnItems);
            alert("Phone Details Added Successfully as you wish!!!");
            refreshModalInnerItemFormAndTable();

        }

    }else {

        alert("Phone Details Cannot be Added : It's already Exist!!!\n" + "\n Serial No : " + grnItems.serial_number)

    }

}


// this function works as inner grn form add btn (Big Add Btn)
const innerGrnSubmit = () => {

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

    if (goodsReceiveNote.total_amount == ""){

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

    /*if (goodsReceiveNote.paid_amount == null){

        error = error + "Paid Amount Field Incomplete \n";

    }*/

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

        let tax = parseFloat(grnTotalAmount.value)*parseFloat(grnTax.value)/100;
        let totalAmountAfterAddingTax = parseFloat(grnTotalAmount.value)+tax;
        let discount = totalAmountAfterAddingTax*parseFloat(grnDiscount.value)/100;

        grnNetTotalAmount.value  = (totalAmountAfterAddingTax-discount).toFixed(2)
        grnNetTotalAmount.style.color = 'green';
        goodsReceiveNote.net_total_amount = grnNetTotalAmount.value;
        console.log(goodsReceiveNote.net_total_amount)

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

const formRefill = () => {
  
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

    grnPrint = getServiceRequest("/goodsreceivenote/getbyid/"+ob.id)

    $('#grnModal').modal("show");

    modSupplier.innerHTML           = grnPrint.quotation_id.quotation_number;
    modPurchaseBillInvoiceNo.innerHTML = grnPrint.quotation_id.quotation_request_id.supplier_id.supplier_company_name;
    modGrnGoodsReceiveDate.innerHTML   = grnPrint.required_date;
    modGrnTotalAmount.innerHTML        = grnPrint.total_amount;
    modGrnTax.innerHTML                = grnPrint.purchase_order_status_id.name;
    modGrnDiscount.innerHTML           = grnPrint.note;

}

const clearBtn = () => {

    refreshForm();

}




