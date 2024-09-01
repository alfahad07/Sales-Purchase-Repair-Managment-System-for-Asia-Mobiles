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

    registeredCustomer.addEventListener('change', event => {

        preOrderNoByRegisteredCustomer = getServiceRequest("/preorder/getpreorderbycustomer/" + JSON.parse(registeredCustomer.value).id)
        fillSelectFeild(salesPreOrder, "Select Pre-Order No", preOrderNoByRegisteredCustomer, "pre_order_code", "")

        if (oldSalesInvoice != null && JSON.parse(registeredCustomer.value).id != oldSalesInvoice.pre_order_id.customer_id.id) {

            registeredCustomer.style.color = "orange"
            registeredCustomer.style.borderBottom = "2px solid orange"

        } else {

            registeredCustomer.style.color = "green"
            registeredCustomer.style.borderBottom = "2px solid green"

        }

        fillingCustomerFieldsByRegisteredCustomer = JSON.parse(registeredCustomer.value);
        salesCustomerName.value = fillingCustomerFieldsByRegisteredCustomer.fullname;
        salesCustomerAddress.value = fillingCustomerFieldsByRegisteredCustomer.address;
        salesContactNumber.value = fillingCustomerFieldsByRegisteredCustomer.mobile;
        salesCustomerNic.value = fillingCustomerFieldsByRegisteredCustomer.nic;
        salesCustomerEmail.value = fillingCustomerFieldsByRegisteredCustomer.email;

        //setting the values to the backend field
        salesInvoice.customer_name = salesCustomerName.value
        salesInvoice.customer_address = salesCustomerAddress.value
        salesInvoice.contact_number = salesContactNumber.value
        salesInvoice.customer_nic = salesCustomerNic.value
        salesInvoice.customer_email = salesCustomerEmail.value

        //validating the fileds to green colour
        salesCustomerName.style.color = "green"
        salesCustomerAddress.style.color = "green"
        salesContactNumber.style.color = "green"
        salesCustomerNic.style.color = "green"
        salesCustomerEmail.style.color = "green"

    })

    salesPreOrder.addEventListener('change', event => {

        itemsByPreOrder = getServiceRequest("/preorder/getpreorderbycustomer/" + JSON.parse(salesPreOrder.value).id)
        fillSelectFeild(salesInvoiceItem, "Select Item", itemsByPreOrder, "item_name", "")

        if (oldSalesInvoice != null && JSON.parse(salesPreOrder.value).id != oldSalesInvoice.pre_order_id.id) {

            salesPreOrder.style.color = "orange"
            salesPreOrder.style.borderBottom = "2px solid orange"

        } else {

            salesPreOrder.style.color = "green"
            salesPreOrder.style.borderBottom = "2px solid green"

        }

    })

}


//create function for refresh  table
const refreshTable = () => {

    //create Array for employees
    salesInvoices = new Array();

    salesInvoices = getServiceRequest("/salesinvoice/findall");

    //create display property list
    let DisplayPropertyList = ['pre_order_code', 'bill_number', 'customer_name', 'model', 'net_amount', 'sales_invoice_status_id.name'];

    //create display property list type
    let DisplayPropertyListType = ['text', 'text', 'text', getModelName, getNetAmount, 'object'];

    // calling filldataintotable function to fill data
    fillDataIntoTable(tableSalesInvoice, salesInvoices, DisplayPropertyList, DisplayPropertyListType, formRefill, rowDelete, rowView, true, loggedUserPrivilage);

    //Invisibling the Delete Button in the table when the Status is deleted (Once Deleted the Details or row, the Delete Btn will Disappear)
    for (let index in salesInvoices) {

        if (salesInvoices[index].sales_invoice_status_id.name == "Deleted")
            tableSalesInvoice.children[1].children[index].children[7].children[1].style.display = "none";

        if (salesInvoices[index].sales_invoice_status_id.name == "Paid")
            tableSalesInvoice.children[1].children[index].children[7].children[1].style.display = "none";

        tableSalesInvoice.children[1].children[index].children[7].children[0].style.display = "none";

    }

    //need to add jquery table
    $('#tableSalesInvoice').dataTable();


}

const getModelName = (ob) => {

    let orderModelName = "";

    for (let index in ob.salesInvoiceHasItemsList) {

        if (ob.salesInvoiceHasItemsList.length - 1 == index)
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
    fillSelectFeild(registeredCustomer, "Select Registered Customer", customers, "nic");

    salesPreOrders = getServiceRequest("/preorder/list")
    fillSelectFeild(salesPreOrder, "Select Pre-Order", salesPreOrders, "pre_order_code");

    statuses = getServiceRequest("/salesinvoicestatus/list");
    fillSelectFeild(salesInvoiceStatus, "Select Sales Invoice Status", statuses, "name", "Not Paid")
    salesInvoice.sales_invoice_status_id = JSON.parse(salesInvoiceStatus.value)

    salesInvoice.discount = 0.00;
    salesInvoice.tax = 15.00;
    salesInvoice.total_amount = 0.00;

    //CLEARING THE DETAILS IN THE ATTRIBUTE FIELDS IN THE FORM AFTER ADDING A SALES INVOICE...
    registeredCustomer.style.color = "grey";
    registeredCustomer.style.borderBottom = "none";

    salesPreOrder.style.color = "grey";
    salesPreOrder.style.borderBottom = "none";

    salesInvoiceStatus.style.color = "green";
    salesInvoiceStatus.style.borderBottom = "solid";

    salesCustomerName.value = "";
    salesCustomerAddress.value = "";
    salesContactNumber.value = "";
    salesCustomerNic.value = "";
    salesCustomerEmail.value = "";
    salesTotalAmount.value = "";

    salesTax.value = "15.00";
    salesTax.style.color = "green";

    salesDiscount.value = "0.00";
    salesDiscount.style.color = "green";



    salesNetAmount.value = "";
    $('#salesNetAmount').css("pointer-events", "none");
    $('#salesNetAmount').css("cursor", "pointer");

    salesNote.value = "";


    disableAddUpdateBtn(true, false);

    refreshInnerFormAndTable();


}

const disableAddUpdateBtn = (addBtn) => {


    if (addBtn && loggedUserPrivilage.ins) {

        btnAdd.disabled = false;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "pointer");


    } else {

        btnAdd.disabled = true;
        $('#btnAdd').css("pointer-events", "all");
        $('#btnAdd').css("cursor", "not-allowed");

    }

}


//FUNCTIONS RELATED TO INNER TABLE AND FORM...
const refreshInnerFormAndTable = () => {

    //INNER FORM
    salesInvoiceHasItems = new Object();
    oldSalesInvoiceHasItems = null;


    innerItems = getServiceRequest("/items/list")
    fillSelectFeild(salesInvoiceItem, "Select Item", innerItems, "item_name");
    salesInvoiceItem.style.color = "grey";
    salesInvoiceItem.style.borderBottom = "none";
    $('#salesInvoiceItem').css("pointer-events", "all");
    $('#salesInvoiceItem').css("cursor", "pointer");
    salesInvoiceItem.value = "";

    salesInvoiceUnitPrice.value = "";
    $('#salesInvoiceUnitPrice').css("pointer-events", "none");
    $('#salesInvoiceUnitPrice').css("cursor", "not-allowed");

    salesInvoiceDiscountRate.value = "";

    salesInvoiceDiscountedPrice.value = "";
    $('#salesInvoiceDiscountedPrice').css("pointer-events", "none");
    $('#salesInvoiceDiscountedPrice').css("cursor", "not-allowed");

    salesInvoiceQuantity.value = "";
    $('#salesInvoiceQuantity').css("pointer-events", "none");
    $('#salesInvoiceQuantity').css("cursor", "not-allowed");

    salesInvoiceLineTotal.value = "";
    $('#salesInvoiceLineTotal').css("pointer-events", "none");
    $('#salesInvoiceLineTotal').css("cursor", "not-allowed");

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
    let DisplayPropertyList = ['items_id.item_name', 'unit_price', 'discount_rate', 'discounted_price', 'quantity', 'line_amount'];

    //create display property list type
    let DisplayPropertyListType = ['object', 'text', 'text', 'text', 'text', 'text'];

    let innerLoggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=SALES-INVOICE");
    // calling filldataintotable function to fill data
    fillDataIntoTable(tableSalesInvoiceInnerTable, salesInvoice.salesInvoiceHasItemsList, DisplayPropertyList, DisplayPropertyListType, innerFormRefill, innerRowDelete, innerRowView, true, innerLoggedUserPrivilage);


    // Created to invisible the Delete Btn in inner table  and sum all the line_total to total field.
    for (let index in salesInvoice.salesInvoiceHasItemsList) {

        tableSalesInvoiceInnerTable.children[1].children[index].children[7].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(salesInvoice.salesInvoiceHasItemsList[index].line_amount)

    }


    // To validate the total amount field with orange and green colour....
    if (totalAmount != 0.00) {

        salesTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        salesInvoice.total_amount = salesTotalAmount.value;

        if (oldSalesInvoice != null && salesInvoice.total_amount != oldSalesInvoice.total_amount) {

            //update style
            salesTotalAmount.style.color = 'orange';


        } else {

            //valid style
            salesTotalAmount.style.color = 'green';

        }

    }

}

const selectModelToGetUnitPrice = () => {

    salesInvoiceUnitPrice.value = parseFloat(JSON.parse(salesInvoiceItem.value).model_id.sales_price).toFixed(2);
    salesInvoiceHasItems.unit_price = salesInvoiceUnitPrice.value;
    salesInvoiceUnitPrice.style.color = 'green';
    salesInvoiceQuantity.value ="1";
    salesInvoiceHasItems.quantity = parseInt(salesInvoiceQuantity.value);
    salesInvoiceQuantity.style.color = 'green';

}

const innerMultiplyQuantityWithDiscountedPrice = () => {

    if (salesInvoiceQuantity.value != 0) {

        let regPattern = new RegExp("^[0-9]{1,4}$");

        if (regPattern.test(salesInvoiceQuantity.value)) {

            salesInvoiceLineTotal.value = (parseFloat(salesInvoiceDiscountedPrice.value) * parseFloat(salesInvoiceQuantity.value)).toFixed(2)
            salesInvoiceLineTotal.style.color = 'green';
            salesInvoiceHasItems.line_amount = salesInvoiceLineTotal.value;

            if (oldSalesInvoiceHasItems == null) {

                //Enabling the inner Add Btn...
                innerFormBtnAdd.disabled = false;
                $('#innerFormBtnAdd').css("cursor", "pointer");

            } else {

                //Enabling the inner Update Btn...
                innerFormBtnUpdate.disabled = false;
                $('#innerFormBtnUpdate').css("cursor", "pointer");

            }

        } else {

            salesInvoiceQuantity.style.color = 'red';

        }

    } else {

        salesInvoiceQuantity.style.color = 'red';
        salesInvoiceLineTotal.value = "";

    }

}

const innerDeductDiscountRateWithUnitPrice = () => {

    let regPattern = new RegExp("^[0-9]{1,2}[.][0-9]{2}$");

    if (regPattern.test(salesInvoiceDiscountRate.value)) {

        let discountValue = parseFloat(salesInvoiceUnitPrice.value) * parseFloat(salesInvoiceDiscountRate.value) / 100;

        salesInvoiceDiscountedPrice.value = (parseFloat(salesInvoiceUnitPrice.value) - discountValue).toFixed(2);

        let itemPurchasePrice = parseFloat(JSON.parse(salesInvoiceItem.value).model_id.purchase_price).toFixed(2)
        if (parseFloat(itemPurchasePrice) <= parseFloat(salesInvoiceDiscountedPrice.value)) {

            salesInvoiceDiscountedPrice.style.color = 'green';
            salesInvoiceHasItems.discounted_price = salesInvoiceDiscountedPrice.value;

            if (oldSalesInvoiceHasItems == null) {

                //Enabling the inner Add Btn...
                innerFormBtnAdd.disabled = false;
                $('#innerFormBtnAdd').css("cursor", "pointer");

            } else {

                //Enabling the inner Update Btn...
                innerFormBtnUpdate.disabled = false;
                $('#innerFormBtnUpdate').css("cursor", "pointer");

            }

        } else {

            if (oldSalesInvoiceHasItems == null) {

                //Enabling the inner Add Btn...
                innerFormBtnAdd.disabled = true;
                $('#innerFormBtnAdd').css("cursor", "not-allowed");

            } else {

                //Enabling the inner Update Btn...
                innerFormBtnUpdate.disabled = true;
                $('#innerFormBtnUpdate').css("cursor", "not-allowed");

            }

            salesInvoiceDiscountRate.style.color = 'red';
            salesInvoiceDiscountedPrice.style.color = 'red';
            window.alert("The discount rate is invalid, Because Discounted price is lesser than Purchase price")

        }

    } else {

        salesInvoiceDiscountRate.style.color = 'red';
        salesInvoiceDiscountedPrice.value = "";

    }

}


const innerAddMC = () => {

    let itemExt = false;

    for (let index in salesInvoice.salesInvoiceHasItemsList) {

        if (salesInvoice.salesInvoiceHasItemsList[index].items_id.item_name == salesInvoiceHasItems.items_id.item_name) {

            itemExt = true;
            break;

        }

    }

    if (!itemExt) {

        let submitConfigMsg = "Are you willing to add following Sales Invoice Item?\n" +
            "\n Item Name : " + salesInvoiceHasItems.items_id.item_name +
            "\n Unit Price : Rs. " + salesInvoiceHasItems.unit_price +
            "\n Discount Rate : " + salesInvoiceHasItems.discount_rate + "%" +
            "\n Discounted Price : Rs. " + salesInvoiceHasItems.discounted_price +
            "\n Quantity : " + salesInvoiceHasItems.quantity +
            "\n Line Total : Rs. " + salesInvoiceHasItems.line_amount;

        let userResponse = window.confirm(submitConfigMsg)

        if (userResponse) {

            salesInvoice.salesInvoiceHasItemsList.push(salesInvoiceHasItems);
            alert("Sales Invoice Item Added Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }

    } else {

        alert("Item Cannot be Added : It's already Exist!!!\n" + "\n Item Name : " + salesInvoiceHasItems.items_id.item_name)

    }


}

const innerUpdateMC = () => {

    if (salesInvoiceHasItems.quantity != oldSalesInvoiceHasItems.quantity) {

        let submitConfigMsg = "Are you willing to update the following Sales Invoice Model?\n" +
            "\n Model Name : " + salesInvoiceHasItems.items_id.item_name +
            "\n Unit Price : Rs. " + salesInvoiceHasItems.unit_price +
            "\n Discount Rate : " + salesInvoiceHasItems.discount_rate + "%" +
            "\n Discounted Price : Rs. " + salesInvoiceHasItems.discounted_price +
            "\n Quantity : " + salesInvoiceHasItems.quantity +
            "\n Line Total : Rs. " + salesInvoiceHasItems.line_amount;

        let userResponse = window.confirm(submitConfigMsg)

        if (userResponse) {

            salesInvoice.salesInvoiceHasItemsList[selectedInnerRow] = salesInvoiceHasItems;
            alert("Sales Invoice Items Updated Successfully as you wish!!!");
            refreshInnerFormAndTable();

        }


    } else {

        window.alert("Nothing Updated!!!")

    }

}

const innerClearMC = () => {

    refreshInnerFormAndTable();

}

const innerFormRefill = (innerOb, innerRowNo) => {

    selectedInnerRow = innerRowNo;
    salesInvoiceHasItems = JSON.parse(JSON.stringify(innerOb));
    oldSalesInvoiceHasItems = JSON.parse(JSON.stringify(innerOb));

    innerItems = getServiceRequest("/items/list")
    fillSelectFeild(salesInvoiceItem, "Select Item", innerItems, "item_name", salesInvoiceHasItems.items_id.item_name);

    salesInvoiceItem.style.color = "green";
    salesInvoiceItem.style.borderBottom = "solid";
    $('#salesInvoiceItem').css("pointer-events", "none");
    $('#salesInvoiceItem').css("cursor", "not-allowed");


    salesInvoiceUnitPrice.value = salesInvoiceHasItems.unit_price;
    salesInvoiceUnitPrice.style.color = "green";
    $('#salesInvoiceUnitPrice').css("pointer-events", "none");
    $('#salesInvoiceUnitPrice').css("cursor", "not-allowed");


    salesInvoiceDiscountRate.value = salesInvoiceHasItems.discount_rate;

    salesInvoiceDiscountedPrice.value = salesInvoiceHasItems.discounted_price;
    $('#salesInvoiceDiscountedPrice').css("pointer-events", "none");
    $('#salesInvoiceDiscountedPrice').css("cursor", "not-allowed");

    salesInvoiceQuantity.value = salesInvoiceHasItems.quantity;
    salesInvoiceQuantity.style.color = "green";
    $('#salesInvoiceQuantity').css("pointer-events", "none");
    $('#salesInvoiceQuantity').css("cursor", "not-allowed");


    salesInvoiceLineTotal.value = salesInvoiceHasItems.line_amount;
    salesInvoiceLineTotal.style.color = "green";
    $('#salesInvoiceLineTotal').css("pointer-events", "none");
    $('#salesInvoiceLineTotal').css("cursor", "not-allowed");


    //Disabling the inner Add Btn...
    innerFormBtnAdd.disabled = true;
    $('#innerFormBtnAdd').css("cursor", "not-allowed");

}

const innerRowDelete = (innerOb, innerRowIndex) => {

    let deleteMsg = "Would you like to Delete this Sales Invoice Model?\n"
        + "Item Name : " + innerOb.items_id.item_name;

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        salesInvoice.salesInvoiceHasItemsList.splice(innerRowIndex, 1); // deleteCount means how many rows should be deleted from the selected row by the index number of the object,Ex :- If it is 1 that mean only the selected row or if it is 2 that mean only the selected row and the next row.
        alert("As you wish, Deleted the Sales Invoice Model Successfully !!!");
        refreshInnerFormAndTable();

    }

}

const innerRowView = () => {

}

function checkErrors() {

    let error = "";


    if (salesInvoice.total_amount == null) {

        error = error + "Total Amount Field Incomplete \n";

    }

    if (salesInvoice.discount == null) {

        error = error + "Discount Field Incomplete \n";

    }

   /* if (salesInvoice.tax == null) {

        error = error + "Tax Field Incomplete \n";

    }*/

    if (salesInvoice.net_amount == null) {

        error = error + "Net Amount Field Incomplete \n";

    }

    if (salesInvoice.sales_invoice_status_id == null) {

        error = error + "Sales Invoice Status Field Incomplete \n";

    }

    if (salesInvoice.salesInvoiceHasItemsList.length == "0") {

        error = error + "Sales Invoice Items Not Added \n";

    }


    return error;


}


//CREATED FUNCTION FOR ADD BUTTON...
const submitBtnFunction = () => {

    let errors = checkErrors();

    if (errors == "") {

        let submitConfigMsg = "Are you willing to add this Sales Invoice?\n" +
            "\n Customer Name : " + salesInvoice.customer_name +
            "\n Total Amount : Rs. " + salesInvoice.total_amount +
            "\n Net Amount : Rs. " + salesInvoice.net_amount;

        let userResponse = window.confirm(submitConfigMsg)

        if (userResponse) {

            let postServiceResponse = getAjexServiceRequest("/salesinvoice", "POST", salesInvoice);


            if (postServiceResponse == "0") {

                alert("Sales Invoice Added Successfully as you wish!!!");
                refreshTable();
                refreshForm();
                empMancontainer.classList.remove("right-panel-active")

            } else {

                window.confirm("You have these following error \n" + postServiceResponse)

            }
        }

    } else {

        alert("Form has these following errors \n" + errors)

    }

}

const formRefill = (ob) => {

    /*empMancontainer.classList.add("right-panel-active");

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



    //CHECKING SALES INVOICE CUSTOMER ID IS NULL COZ NULL VALUES CANNOT SET IN COMBO BOX OR DROPDOWN, IF THE CUSTOMER IS NOT REGISTERED THEN THE COBO BOX IS NULL...
    if (salesInvoice.customer_id != null){

        fillSelectFeild(registeredCustomer, "Select Registered Customer", customers, "fullname", salesInvoice.customer_id.fullname);
        registeredCustomer.style.borderBottom   = "solid";
        registeredCustomer.style.color = "green";


    }else {  registeredCustomer.style.borderBottom = "none"; }


    //CHECKING SALES INVOICE PRE-ORDER ID IS NULL COZ NULL VALUES CANNOT SET IN COMBO BOX OR SELECT
    if (salesInvoice.pre_order_id != null) {

        fillSelectFeild(salesPreOrder, "Select Pre-Order Code", salesPreOrders, "pre_order_code", salesInvoice.pre_order_id.pre_order_code);
        salesPreOrder.style.borderBottom = "solid";
        salesPreOrder.style.color = "green";

    }else{  salesPreOrder.style.borderBottom = "none"; }


    fillSelectFeild(salesInvoiceStatus, "Select Sales Invoice Status", statuses, "name", salesInvoice.sales_invoice_status_id.name);
    salesInvoiceStatus.style.borderBottom   = "solid";
    salesInvoiceStatus.style.color = "green";


    disableAddUpdateBtn(false, true);

    refreshInnerFormAndTable();*/

}

//No need edit for GRN
/*const checkUpdate = () => {

    let update = "";

    if (salesInvoice != null && oldSalesInvoice != null) {

        if (salesInvoice.customer_id != null) {

            if (salesInvoice.customer_id.id != oldSalesInvoice.customer_id.id) {
                update = update + "Registered Customer updated \n";
            }

        }


        if (salesInvoice.pre_order_id != null) {

            if (salesInvoice.pre_order_id.id != oldSalesInvoice.pre_order_id.id) {
                update = update + "Sales Pre-Order updated \n";
            }

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

        if (salesInvoice.salesInvoiceHasItemsList.length != oldSalesInvoice.salesInvoiceHasItemsList.length) {

            update = update + "Sales Invoice Models updated \n" ;

        }else {

           let existUpdate = false;

            for (let i = 0; i < salesInvoice.salesInvoiceHasItemsList.length; i++){

                for (let l = 0; l < salesInvoice.salesInvoiceHasItemsList.length; l++){

                    if (salesInvoice.salesInvoiceHasItemsList[i].items_id.item_code_number == oldSalesInvoice.salesInvoiceHasItemsList[i].items_id.item_code_number){

                        if (salesInvoice.salesInvoiceHasItemsList[i].quantity == oldSalesInvoice.salesInvoiceHasItemsList[i].quantity){

                            existUpdate = true;
                            break;

                        }

                    }

                }

            }

            if (existUpdate){

                update = update + "Sales Invoice Item quantity updated \n";

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
                let putResponce = getAjexServiceRequest("/salesinvoice","PUT",salesInvoice);

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

        //If any errors occurred in the form this line will execute...
        window.alert("You have the following errors in your form...! \n" + errors)

    }


}*/

const rowDelete = (ob) => {

    let deleteMsg = "Would you like to Delete the following Sales Invoice?\n"
        + "Bill Number : " + ob.bill_number + "\n"
        + "Customer Name : " + ob.customer_name + "\n"
        + "Model : " + ob.model + "\n"
        + "Net Amount : " + ob.net_amount + "\n";

    let deleteUserResponse = window.confirm(deleteMsg);

    if (deleteUserResponse) {

        let deleteSeverResponse = getAjexServiceRequest("/salesinvoice", "DELETE", ob);


        if (deleteSeverResponse == "0") {

            alert("As you wish, Deleted the Sales Invoice Successfully !!!");
            refreshTable();

        } else {

            window.confirm("You have the following error\n" + deleteSeverResponse)

        }

    }

}

const rowView = (ob) => {

    modelSalesInvoice = getServiceRequest("/salesinvoice/getbyid/" + ob.id)

    $('#modelModal').modal("show");


    modelSalesCustomerName.value = modelSalesInvoice.customer_name;
    modelSalesCustomerAddress.value = modelSalesInvoice.customer_address;
    modelSalesContactNumber.value = modelSalesInvoice.contact_number;
    modelSalesCustomerNic.value = modelSalesInvoice.customer_nic;
    modelSalesCustomerEmail.value = modelSalesInvoice.customer_email;
    modelSalesTotalAmount.value = modelSalesInvoice.total_amount;
    modelSalesTax.value = modelSalesInvoice.discount;
    modelSalesDiscount.value = modelSalesInvoice.tax;
    modelSalesNetAmount.value = modelSalesInvoice.net_amount;
    modelSalesNote.value = modelSalesInvoice.note;

    /* modSubCategory.innerHTML       = modelPrint.sub_catergory_id.name;
     modBrand.innerHTML             = modelPrint.brand_id.name;
     modModelName.innerHTML         = modelPrint.model_name;
     modModelNo.innerHTML           = modelPrint.model_number;
     modSalesPrice.innerHTML        = salesPrice(modelPrint);
     modPurchasePrice.innerHTML     = purchasePrice(modelPrint);
     modProfitRate.innerHTML        = modelPrint.profit_rate + "%";
     modMinDiscountRate.innerHTML   = modelPrint.min_discount_rate + "%";
     modMaxDiscountRate.innerHTML   = modelPrint.max_discount_rate + "%";
     modModelStatus.innerHTML       = modelPrint.model_status_id.name;
     modNote.innerHTML              = modelPrint.note;*/


}

const clearBtn = () => {

    refreshForm();

}

//gettingTheNetTotalByDeductingTaxAndDiscountFromTotalAmount
const gettingTheNetTotal = () => {

    let totalAmountAndTax = parseFloat(salesTotalAmount.value) + parseFloat(salesTotalAmount.value) * parseFloat(salesTax.value) / 100;
    salesNetAmount.value = (totalAmountAndTax - (totalAmountAndTax * parseFloat(salesDiscount.value) / 100)).toFixed(2)
    salesNetAmount.style.color = 'green';
    salesInvoice.net_amount = salesNetAmount.value;
    console.log(salesInvoice.net_amount)

}

const individualItemDiscountCheck = () => {

    let itemMaxDiscount = parseFloat(JSON.parse(salesInvoiceItem.value).model_id.max_discount_rate);
    let itemMinDiscount = parseFloat(JSON.parse(salesInvoiceItem.value).model_id.min_discount_rate);

    if (itemMinDiscount <= salesInvoiceDiscountRate.value && itemMaxDiscount >= salesInvoiceDiscountRate.value) {

        window.alert("Discount Rate is Invalid, Please try a valid Discount Rate")
        innerFormBtnAdd.disabled =true;

    }else{

        innerFormBtnAdd.disabled =false;

    }


}


const invoiceItemByPreOrder = () => {

    console.log("aaaaa")
    // salesPreOrder
    // salesInvoice.salesInvoiceHasItemsList

     customerOrderModel = JSON.parse(salesPreOrder.value).preOrderHasModelList;

    for (const customerOrderModelElement of customerOrderModel) {
        let avaItembyModel  = getServiceRequest("/items/getbymodelid/" + customerOrderModelElement.model_id.id)
        if (parseInt(customerOrderModelElement.quantity) < avaItembyModel.length) {
            for (let i = 0; i < parseInt(customerOrderModelElement.quantity); i++) {
              let salesInvoiceHasItems = new Object();
                salesInvoiceHasItems.items_id = avaItembyModel[i];
                salesInvoiceHasItems.unit_price = parseFloat(customerOrderModelElement.model_id.sales_price).toFixed(2);
                salesInvoiceHasItems.discount_rate = parseFloat(customerOrderModelElement.model_id.max_discount_rate).toFixed(2);
                salesInvoiceHasItems.discounted_price = (parseFloat(customerOrderModelElement.model_id.sales_price) - (parseFloat(customerOrderModelElement.model_id.max_discount_rate) * parseFloat(customerOrderModelElement.model_id.max_discount_rate)/100)).toFixed(2);
                salesInvoiceHasItems.quantity = 1;
                salesInvoiceHasItems.line_amount = parseFloat( salesInvoiceHasItems.discounted_price).toFixed(2);
                salesInvoice.salesInvoiceHasItemsList.push(salesInvoiceHasItems);
            }
        }


    }

    refreshInnerFormAndTable();
}
