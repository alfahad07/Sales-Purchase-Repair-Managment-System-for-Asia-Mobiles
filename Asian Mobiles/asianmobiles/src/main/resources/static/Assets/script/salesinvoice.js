
window.addEventListener('load', loadUserInterface);

//create function for browser on load event
function loadUserInterface() {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=SALES-INVOICE")

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
    salesInvoices = new Array();

    salesInvoices = getServiceRequest("/salesinvoice/findall");

    //create display property list
    let DisplayPropertyList = ['pre_order_code','bill_number','customer_name','model','net_amount','sales_invoice_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text','text','text',getModelName,getNetAmount,'object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableSalesInvoice, salesInvoices, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true,loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in salesInvoices){

        if(salesInvoices[index].sales_invoice_status_id.name == "Deleted")
            tableSalesInvoice.children[1].children[index].children[7].children[1].style.display = "none";

    }

    //need to add jquery table
    $('#tableSalesInvoice').dataTable();


}

const getModelName = (ob) => {

    let orderModelName = "";

    for (let index in ob.salesInvoiceHasItemsList){

        if(ob.salesInvoiceHasItemsList.length-1 == index )
            orderModelName = orderModelName + ob.salesInvoiceHasItemsList[index].items_id.model_id.model_name;
        else
            orderModelName = orderModelName + ob.salesInvoiceHasItemsList[index].items_id.model_id.model_name + ", ";

    }

    return orderModelName;

}

/*const getTotalAmount = (ob) => {

    return "Rs." + parseFloat(ob.total_amount).toFixed(2);

}*/

const getNetAmount = (ob) => {

    return "Rs." + parseFloat(ob.net_amount).toFixed(2);

}

const refreshForm = () => {


    salesInvoice = new Object();
    oldSalesInvoice = null;

    salesInvoice.salesInvoiceHasItemsList = new Array();

    customers = getServiceRequest("/customer/list");
    fillSelectFeild(registeredCustomer, "Select Registered Customer", customers, "fullname");

    salesPreOrders = getServiceRequest("/preorder/list")
    fillSelectFeild(salesPreOrder, "Select Pre-Order", salesPreOrders, "pre_order_code");

    statuses = getServiceRequest("/salesinvoicestatus/list");
    fillSelectFeild(salesInvoiceStatus, "Select Sales Invoice Status", statuses, "name")


    //CLEARING THE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING A SALES INVOICE...
    registeredCustomer.style.color        = "grey";
    registeredCustomer.style.borderBottom = "none";

    salesPreOrder.style.color        = "grey";
    salesPreOrder.style.borderBottom = "none";

    salesInvoiceStatus.style.color        = "grey";
    salesInvoiceStatus.style.borderBottom = "none";

    salesCustomerName.value    = "";
    salesCustomerAddress.value = "";
    salesContactNumber.value   = "";
    salesCustomerNic.value     = "";
    salesCustomerEmail.value   = "";
    salesTotalAmount.value     = "";
    salesTax.value             = "";
    salesDiscount.value        = "";

    salesNetAmount.value       = "";
    $('#salesNetAmount').css("pointer-events", "none");
    $('#salesNetAmount').css("cursor", "pointer");

    salesNote.value            = "";


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
    preOrderHasModel = new Object();
    oldPreOrderHasModel = null;


    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(preOrderModel, "Select Model", innerModels,"model_number" ,"model_name",)
    preOrderModel.style.color        = "grey";
    preOrderModel.style.borderBottom = "none";
    $('#preOrderModel').css("pointer-events", "all");
    $('#preOrderModel').css("cursor", "pointer");

    preOrderModel.value      = "";
    preOrderUnitPrice.value  = "";
    $('#preOrderUnitPrice').css("pointer-events", "none");
    $('#preOrderUnitPrice').css("cursor", "not-allowed");
    preOrderQuantity.value   = "";
    preOrderLineTotal.value  = "";
    $('#preOrderLineTotal').css("pointer-events", "none");
    $('#preOrderLineTotal').css("cursor", "not-allowed");

    //Disabling the inner Add Btn...
    innerFormBtnAdd.disabled = true;
    $('#innerFormBtnAdd').css("cursor", "not-allowed");

    //Disabling the inner Update Btn...
    innerFormBtnUpdate.disabled = true;
    $('#innerFormBtnUpdate').css("cursor", "not-allowed");



    //INNER TABLE

    //SETTING DEFAULT VALUE TO THE TOTAL AMOUNT
    let totalAmount = 0.00;

    //create display property list
    let DisplayPropertyList = ['model_id.model_name','unit_price','quantity','line_amount'];

    //create display property list type
    let DisplayPropertyListType = ['object','text','text','text'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=PRE-ORDER");
    // calling filldataintotable function to fill data
    fillDataIntoTable(tablePreOrderInnerTable,preOrder.preOrderHasModelList,DisplayPropertyList, DisplayPropertyListType, innerFormRefill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilage);


    // Created to invisible the Delete Btn in inner table  and sum all the line_total to total field.
    for (let index in preOrder.preOrderHasModelList){

        tablePreOrderInnerTable.children[1].children[index].children[5].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(preOrder.preOrderHasModelList[index].line_amount)

    }


    // To validate the total amount field with orange and green colour....
    if (totalAmount != 0.00){

        preOrderTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        preOrder.total_amount     = preOrderTotalAmount.value;

        if (oldPreOrder != null && preOrder.total_amount != oldPreOrder.total_amount){

            //update style
            preOrderTotalAmount.style.color = 'orange';


        }else {

            //valid style
            preOrderTotalAmount.style.color = 'green';

        }

    }

}

const selectModelToGetUnitPrice = () => {

    preOrderUnitPrice.value = parseFloat(JSON.parse(preOrderModel.value).sales_price).toFixed(2)
    preOrderHasModel.unit_price = preOrderUnitPrice.value;
    preOrderUnitPrice.style.color = 'green';

}

const multiplyQuantityWithUnitPrice = () => {

    if (preOrderQuantity.value != 0){

        let regPattern = new RegExp("^[0-9]{1,5}$");

        if (regPattern.test(preOrderQuantity.value)){

            preOrderLineTotal.value  = (parseFloat(preOrderUnitPrice.value)*parseFloat(preOrderQuantity.value)).toFixed(2)
            preOrderLineTotal.style.color = 'green';
            preOrderHasModel.line_amount = preOrderLineTotal.value;

            if (oldPreOrderHasModel == null){

                //Enabling the inner Add Btn...
                innerFormBtnAdd.disabled = false;
                $('#innerFormBtnAdd').css("cursor", "pointer");

            }else {

                //Enabling the inner Update Btn...
                innerFormBtnUpdate.disabled = false;
                $('#innerFormBtnUpdate').css("cursor", "pointer");

            }

        }else {

            preOrderQuantity.style.color = 'red';

        }

    }else {

        preOrderQuantity.style.color = 'red';
        preOrderLineTotal.value = "";

    }

}



const innerAddMC = () => {

    let itemExt = false;

    for (let index in preOrder.preOrderHasModelList){

        if (preOrder.preOrderHasModelList[index].model_id.model_name == preOrderHasModel.model_id.model_name){

            itemExt = true;
            break;

        }

    }

    if (!itemExt){

        let submitConfigMsg = "Are you willing to add following Pre-Order Model?\n" +
            "\n Model Name : " + preOrderHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + preOrderHasModel.unit_price +
            "\n Quantity : "   + preOrderHasModel.quantity +
            "\n Line Total : Rs. " + preOrderHasModel.line_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            preOrder.preOrderHasModelList.push(preOrderHasModel);
            alert("Pre-Order Model Added Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }

    }else {

        alert("Model Cannot be Added : It's already Exist!!!\n" + "\n Model Name : " + preOrderHasModel.model_id.model_name)

    }


}

const innerUpdateMC = () => {

    if (preOrderHasModel.quantity != oldPreOrderHasModel.quantity){

        let submitConfigMsg = "Are you willing to update the following Pre-Order Model?\n" +
            "\n Model Name : " + preOrderHasModel.model_id.model_name +
            "\n Unit Price : Rs. " + preOrderHasModel.unit_price +
            "\n Quantity : "   + preOrderHasModel.quantity +
            "\n Line Total : Rs. " + preOrderHasModel.line_amount;

        let userResponse    = window.confirm(submitConfigMsg)

        if (userResponse) {

            preOrder.preOrderHasModelList[selectedInnerRow] = preOrderHasModel;
            alert("Pre-Order Model Updated Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }


    }else {

        window.alert("Nothing Updated!!!")

    }

}

const innerClearMC = () => {

    refreshInnerFormAndTable();

}

const innerFormRefill = (innerOb, innerRowNo) => {

    selectedInnerRow = innerRowNo;
    preOrderHasModel = JSON.parse(JSON.stringify(innerOb));
    oldPreOrderHasModel = JSON.parse(JSON.stringify(innerOb));

    innerModels = getServiceRequest("/model/list")
    fillSelectFeild2(preOrderModel, "Select Model", innerModels,"model_number" ,"model_name", preOrderHasModel.model_id.model_number)
    preOrderModel.style.color        = "green";
    preOrderModel.style.borderBottom = "solid";
    $('#preOrderModel').css("pointer-events", "none");
    $('#preOrderModel').css("cursor", "not-allowed");


    preOrderUnitPrice.value       = preOrderHasModel.unit_price;
    preOrderUnitPrice.style.color = "green";
    $('#preOrderUnitPrice').css("pointer-events", "none");
    $('#preOrderUnitPrice').css("cursor", "not-allowed");


    preOrderQuantity.value   = preOrderHasModel.quantity;
    preOrderQuantity.style.color = "green";


    preOrderLineTotal.value  = preOrderHasModel.line_amount;
    preOrderLineTotal.style.color = "green";
    $('#preOrderLineTotal').css("pointer-events", "none");
    $('#preOrderLineTotal').css("cursor", "not-allowed");


    //Disabling the inner Add Btn...
    innerFormBtnAdd.disabled = true;
    $('#innerFormBtnAdd').css("cursor", "not-allowed");

}

const innerRowDelete = (innerOb, innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Sales Invoice Model?\n"
        +"Model Name : "+ innerOb.model_id.model_name ;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

         preOrder.preOrderHasModelList.splice(innerRowIndex, 1);
         alert("As you wish, Deleted the Pre-Order Successfully !!!");
         refreshInnerFormAndTable();

    }

}

const innerRowView = () => {

}


function checkErrors() {

    let error = "";


    if (salesInvoice.customer_name == ""){

        error = error + "Customer Name Field Incomplete \n";

    }

    if (salesInvoice.customer_address == ""){

        error = error + "Customer Address Field Incomplete \n";

    }

    if (salesInvoice.contact_number == ""){

        error = error + "Contact Number Field Incomplete \n";

    }

    if (salesInvoice.customer_nic == ""){

        error = error + "Customer NIC Field Incomplete \n";

    }

    if (salesInvoice.customer_email == ""){

        error = error + "Customer E-Mail Field Incomplete \n";

    }

    if (salesInvoice.total_amount == ""){

        error = error + "Total Amount Field Incomplete \n";

    }

    if (salesInvoice.discount == ""){

        error = error + "Discount Field Incomplete \n";

    }

    if (salesInvoice.tax == ""){

        error = error + "Tax Field Incomplete \n";

    }

    if (salesInvoice.net_amount == ""){

        error = error + "Net Amount Field Incomplete \n";

    }

    if (salesInvoice.sales_invoice_status_id == null){

        error = error + "Sales Invoice Status Field Incomplete \n";

    }

    if (salesInvoice.preOrderHasModelList.length == "0"){

        error = error + "Sales Invoice Models Not Added \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if ( errors == ""){

        let submitConfigMsg = "Are you willing to add this Sales Invoice?\n" +
            "\n Bill Number : " + salesInvoice.bill_number +
            "\n Customer Name : " + salesInvoice.customer_id.fullname +
            "\n Model Name : " + salesInvoice.model_id.model_name +
            "\n Total Amount : Rs. " + salesInvoice.total_amount +
            "\n Net Amount : Rs. " + salesInvoice.total_amount;

        let userResponse    = window.confirm(submitConfigMsg)


        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/preorder", "POST", salesInvoice);


            if (postServiceResponse == "0") {

                alert("Sales Invoice Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active")

            } else {

                window.confirm("You have these following error \n" + postServiceResponse)

            }
        }

    }else {

        alert("Form has these following errors \n" + errors)

    }

}


const formRefill = (ob) => {

    empMancontainer.classList.add("right-panel-active");

    salesInvoice    = getAjexServiceRequest("/salesinvoice/getbyid/"+ob.id);
    oldSalesInvoice = getAjexServiceRequest("/salesinvoice/getbyid/"+ob.id);


    //SET VALUE
    salesCustomerName.value    = salesInvoice.customer_name;
    salesCustomerAddress.value = salesInvoice.customer_address;
    salesContactNumber.value   = salesInvoice.contact_number;
    salesCustomerNic.value     = salesInvoice.customer_nic;
    salesCustomerEmail.value   = salesInvoice.customer_email;
    salesTotalAmount.value     = salesInvoice.total_amount;
    salesTax.value             = salesInvoice.tax;
    salesDiscount.value        = salesInvoice.discount;
    salesNetAmount.value       = salesInvoice.net_amount;
    salesNote.value            = salesInvoice.note;



    //CHECKING SALES INVOICE CUSTOMER ID IS NULL COZ NULL VALUES CANNOT SET IN COMBO BOX OR SELECT
    if (salesInvoice.customer_id =! null){

        fillSelectFeild(registeredCustomer, "Select Registered Customer", customers, "fullname", salesInvoice.customer_id.fullname);
        registeredCustomer.style.borderBottom   = "solid";

    }else {  registeredCustomer.style.borderBottom = "none"; }


    //CHECKING SALES INVOICE PRE-ORDER ID IS NULL COZ NULL VALUES CANNOT SET IN COMBO BOX OR SELECT
    if (salesInvoice.pre_order_id =! null) {

        fillSelectFeild(salesPreOrder, "Select Pre-Order Code", salesPreOrders, "pre_order_code", salesInvoice.pre_order_id.pre_order_code);
        salesPreOrder.style.borderBottom = "solid";

    }else{  salesPreOrder.style.borderBottom = "none"; }


    fillSelectFeild(salesInvoiceStatus, "Select Sales Invoice Status", statuses, "name", salesInvoice.sales_invoice_status_id.name);
    salesInvoiceStatus.style.borderBottom   = "solid";

    /*refreshInnerFormAndTable();*/

    disableAddUpdateBtn(false, true);

}

const checkUpdate = () => {

    let update = "";

    if (salesInvoice != null && oldSalesInvoice != null) {

        if (salesInvoice.customer_id.id != oldSalesInvoice.customer_id.id) {
            update = update + "Registered Customer updated \n";
        }

        if (salesInvoice.pre_order_id.id != oldSalesInvoice.pre_order_id.id) {
            update = update + "Sales Pre-Order updated \n";
        }

        if (salesInvoice.customer_name != oldSalesInvoice.customer_name) {
            update = update + "Customer Name updated \n";
        }

        if ( salesInvoice.customer_address != oldSalesInvoice.customer_address) {
            update = update + "Customer Address updated \n";
        }

        if ( salesInvoice.contact_number != oldSalesInvoice.contact_number ) {
            update = update + "Contact Number updated \n";
        }

        if (salesInvoice.customer_nic != oldSalesInvoice.customer_nic) {
            update = update + "Customer NIC updated \n";
        }

        if (salesInvoice.customer_email != oldSalesInvoice.customer_email) {
            update = update + "Customer Email updated \n";
        }

        if (salesInvoice.total_amount != oldSalesInvoice.total_amount) {
            update = update + "Total Amount updated \n";
        }

        if (salesInvoice.discount != oldSalesInvoice.discount) {
            update = update + "Discount updated \n";
        }

        if (salesInvoice.tax != oldSalesInvoice.tax) {
            update = update + "Tax updated \n";
        }

        if (salesInvoice.net_amount != oldSalesInvoice.net_amount) {
            update = update + "Net Amount updated \n";
        }

        if (salesInvoice.sales_invoice_status_id.id != oldSalesInvoice.sales_invoice_status_id.id) {
            update = update + "Sales Invoice Status updated \n";
        }

        if (salesInvoice.preOrderHasModelList.length != oldSalesInvoice.preOrderHasModelList.length) {

            update = update + "Sales Invoice Models updated \n" ;

        }else {

           let existUpdate = false;

            for (let i = 0; i < salesInvoice.salesInvoiceHasItemsList.length; i++){

                for (let l = 0; l < salesInvoice.salesInvoiceHasItemsList.length; l++){

                    if (salesInvoice.salesInvoiceHasItemsList[i].model_id.model_number == oldSalesInvoice.salesInvoiceHasItemsList[i].model_id.model_number){

                        if (salesInvoice.salesInvoiceHasItemsList[i].quantity == oldSalesInvoice.salesInvoiceHasItemsList[i].quantity){

                            existUpdate = true;
                            break;

                        }

                    }

                }

            }

            if (existUpdate){

                update = update + "Sales Invoice Model quantity updated \n";

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
            let updateResponce = window.confirm("Are you willing to update following Sales Invoice Details? \n" + update);

            if (updateResponce) {

                //IF USER CLICK OK BTN FOR UPDATE CONFIRMATION.
                let putResponce = getAjexServiceRequest("/preorder","PUT",salesInvoice);;

                if (putResponce == "0") {

                    //IF THE DATA UPDATED AND STORED SUCCESSFULLY
                    window.alert("Updated the Sales Invoice Details successfully as you wish...!");
                    refreshTable();
                    refreshForm();
                    refreshInnerFormAndTable();
                    empMancontainer.classList.remove("right-panel-active");

                }else {

                    //IF THE DATA UPDATED AND STORED IS UNSUCCESSFUL
                    window.alert("Failed to update the Sales Invoice Details, Please try Again...!\n" + putResponce);

                }

            }

        }

    }else{

        // if any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }


}

const rowDelete = (ob) => {

    let deleteMsg = "Would you like to Delete the following Sales Invoice?\n \n"
        +"Bill Number : "+ ob.bill_number + "\n"
        +"Customer Name : "+ ob.customer_name + "\n"
        +"Model : "+ ob.model + "\n"
        +"Net Amount : "+ ob.net_amount + "\n";

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/preorder","DELETE", ob);


        if(deleteSeverResponse == "0"){

            alert("As you wish, Deleted the Sales Invoice Successfully !!!");
            refreshTable();

        }else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    modelPrint = getServiceRequest("/model/getbyid/"+ob.id)

    $('#modelModal').modal("show");

    modSubCategory.innerHTML       = modelPrint.sub_catergory_id.name;
    modBrand.innerHTML             = modelPrint.brand_id.name;
    modModelName.innerHTML         = modelPrint.model_name;
    modModelNo.innerHTML           = modelPrint.model_number;
    modSalesPrice.innerHTML        = salesPrice(modelPrint);
    modPurchasePrice.innerHTML     = purchasePrice(modelPrint);
    modProfitRate.innerHTML        = modelPrint.profit_rate + "%";
    modMinDiscountRate.innerHTML   = modelPrint.min_discount_rate + "%";
    modMaxDiscountRate.innerHTML   = modelPrint.max_discount_rate + "%";
    modModelStatus.innerHTML       = modelPrint.model_status_id.name;
    modNote.innerHTML              = modelPrint.note;



}

const clearBtn = () => {

    refreshForm();

}



